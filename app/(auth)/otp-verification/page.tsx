"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { OTPVerificationForm } from "@/components/auth";
import { formatPhoneNumber } from "@/lib/utils/phone";

function OTPVerificationContent() {
   const searchParams = useSearchParams();
   const rawPhone = searchParams.get("phone") || "";
   const phone = rawPhone ? formatPhoneNumber(rawPhone) : "";
   const userName = searchParams.get("name") || "";
   const authType = (searchParams.get("type") || "login") as "login" | "signup";

   // Default differs by flow: login → /home, signup → onboarding
   const defaultRedirect =
      authType === "signup" ? "/onboarding/goal-selection" : "/home";

   // Must be resolved client-side (cookies/sessionStorage are unavailable during SSR).
   // Using state + useEffect ensures we always read the latest stored redirect.
   const [redirectTo, setRedirectTo] = useState(defaultRedirect);

   useEffect(() => {
      // Read redirect hints from cookie (set by LoginForm) and sessionStorage
      const cookieMatch = document.cookie
         .split("; ")
         .find((c) => c.startsWith("extrahand_redirect_to="));
      const cookieRedirect = cookieMatch
         ? decodeURIComponent(cookieMatch.split("=")[1])
         : "";
      const sessionRedirect = sessionStorage.getItem("postAuthRedirectTo") || "";

      // Cookie/session take priority over the default
      let resolved = cookieRedirect || sessionRedirect || defaultRedirect;

      // For login flow: append task creation context if redirecting to /tasks/new
      if (authType === "login" && resolved.startsWith("/tasks/new")) {
         const context = sessionStorage.getItem("taskCreationContext");
         if (context) {
            try {
               const { category, location } = JSON.parse(context);
               const params = new URLSearchParams();
               if (category) params.append("category", category);
               if (location) params.append("location", location);
               if (params.toString()) {
                  resolved = `/tasks/new?${params.toString()}`;
               }
               // Don't clear yet — TaskCreationFlow component will read it
            } catch (e) {
               console.error("Failed to parse task creation context", e);
            }
         }
      }

      setRedirectTo(resolved);

      // Clean up redirect hints so they don't bleed into future navigations
      sessionStorage.removeItem("postAuthRedirectTo");
      document.cookie = "extrahand_redirect_to=; Max-Age=0; Path=/; SameSite=Lax";
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // run once on mount — searchParams values are stable

   return (
      <OTPVerificationForm
         phone={phone}
         userName={userName}
         authType={authType}
         redirectTo={redirectTo}
      />
   );
}

export default function OTPVerificationPage() {
   return (
      <Suspense fallback={null}>
         <OTPVerificationContent />
      </Suspense>
   );
}
