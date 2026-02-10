/**
 * Next.js Proxy (formerly Middleware) for route protection
 * Next.js 16+: file convention `proxy.ts` and exported `proxy()`
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth routes (should redirect if already authenticated)
const authRoutes = ["/login", "/signup", "/otp-verification"];

// Public routes (accessible without authentication)
const publicRoutes = [
   "/discover",
   "/", // Landing page
];

// Protected routes (require authentication)
const protectedRoutes = [
   "/home",
   "/profile",
   "/profile/verify",
   "/tasks",
   "/tasks/new",
   "/chat",
   "/applications",
   "/payments",
];

function isPublicPath(pathname: string) {
   const standardPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
   );

   const protectedProfilePaths = ["/profile/verify"];
   const isProtectedProfilePath = protectedProfilePaths.some(
      (path) => pathname.startsWith(path)
   );

   // Only allow /profile/[id] where id is an actual user ID (not a reserved keyword)
   const isPublicProfile = pathname.startsWith("/profile/") && 
                           !isProtectedProfilePath &&
                           pathname.split("/").length >= 3;

   // Public task details: /tasks/[id] (full public read view)
   const isPublicTaskDetails =
      pathname.startsWith("/tasks/") &&
      !pathname.startsWith("/tasks/new") &&
      pathname.split("/").length >= 3;

   return standardPublic || isPublicProfile || isPublicTaskDetails;
}

function isProtectedPath(pathname: string) {
   // /profile without ID or with query params is protected
   if (pathname === "/profile" || (pathname.startsWith("/profile?") || pathname.startsWith("/profile#"))) {
      return true;
   }

   // /tasks root and query variants are protected (my tasks/applications),
   // but /tasks/[id] is handled as public above.
   if (pathname === "/tasks" || pathname.startsWith("/tasks?") || pathname.startsWith("/tasks#")) {
      return true;
   }
   
   return protectedRoutes.some(
      (route) => {
         // Skip /profile and /tasks root here since we handle them above
         if (route === "/profile" || route === "/tasks") return false;
         return pathname === route || pathname.startsWith(`${route}/`);
      }
   );
}

function isAuthPath(pathname: string) {
   return authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
   );
}

function checkAuthenticated(req: NextRequest): boolean {
   // Prefer a dedicated auth cookie if set by client
   const authCookie = req.cookies.get("extrahand_auth")?.value;

   // Fallbacks: common cookie names used in Firebase/ID-token setups
   const sessionCookie = req.cookies.get("__session")?.value;
   const idTokenCookie = req.cookies.get("idToken")?.value;

   // Treat any present value as authenticated; value "1" for our cookie
   return (
      authCookie === "1" || Boolean(sessionCookie) || Boolean(idTokenCookie)
   );
}

export function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl;

   const authenticated = checkAuthenticated(request);

   // Allow public routes without authentication check
   if (isPublicPath(pathname)) {
      return NextResponse.next();
   }

   // If already authenticated, avoid auth pages
   if (authenticated && isAuthPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
   }

   // Block protected paths when unauthenticated
   if (!authenticated && isProtectedPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // Preserve intended destination
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
   }

   // Default: allow request
   return NextResponse.next();
}

export const config = {
   matcher: [
      // Match all paths except for assets and API routes
      "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};
