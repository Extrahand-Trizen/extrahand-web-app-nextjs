/**
 * Next.js Middleware for route protection
 * Handles authentication and onboarding redirects
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
   "/",
   "/login",
   "/signup",
   "/otp-verification",
   "/earn-money",
   "/services",
   "/jobs",
   "/locations",
];

// Auth routes (should redirect if already authenticated)
const authRoutes = ["/login", "/signup", "/otp-verification"];

// Protected routes (require authentication - handled client-side)
const protectedRoutes = [
   "/home",
   "/profile",
   "/tasks/new",
   "/chat",
   "/applications",
   "/payments",
];

// Onboarding routes
const onboardingRoutes = [
   "/onboarding/choose-location-method",
   "/onboarding/search-location",
   "/onboarding/location-input",
   "/onboarding/location-confirmation",
   "/onboarding/role-selection",
];

export function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;

   // Allow public routes and their sub-routes
   const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
   );

   if (isPublicRoute) {
      return NextResponse.next();
   }

   // For protected routes, we'll check authentication on the client side
   // This middleware mainly handles redirects based on URL patterns
   // Actual auth checks happen in components using useAuth hook

   // Allow all other routes - client-side auth will handle redirects
   return NextResponse.next();
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public folder files
       */
      "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};
