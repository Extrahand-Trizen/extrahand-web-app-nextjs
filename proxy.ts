/**
 * Next.js Proxy (formerly Middleware) for route protection
 * Next.js 16+: file convention `proxy.ts` and exported `proxy()`
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth routes (should redirect if already authenticated)
const authRoutes = ["/login", "/signup", "/otp-verification"];

// Protected routes (require authentication)
const protectedRoutes = [
   "/home",
   "/profile",
   "/tasks/new",
   "/chat",
   "/applications",
   "/payments",
];

function isProtectedPath(pathname: string) {
   return protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
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
