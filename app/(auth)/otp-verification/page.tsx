"use client";

import { Suspense } from "react";
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
   let redirectTo = defaultRedirect;

   if (typeof window !== "undefined") {
      const cookieMatch = document.cookie
         .split("; ")
         .find((cookie) => cookie.startsWith("extrahand_redirect_to="));
      const cookieRedirect = cookieMatch
         ? decodeURIComponent(cookieMatch.split("=")[1])
         : "";
      const sessionRedirect = sessionStorage.getItem("postAuthRedirectTo") || "";
      // Cookie/session take priority (set when redirected from a protected page)
      redirectTo = cookieRedirect || sessionRedirect || defaultRedirect;

      sessionStorage.removeItem("postAuthRedirectTo");
      document.cookie = "extrahand_redirect_to=; Max-Age=0; Path=/; SameSite=Lax";
   }

   // For login flow, restore task creation context and append to redirect URL if available
   if (authType === "login" && typeof window !== "undefined") {
      const context = sessionStorage.getItem("taskCreationContext");
      if (context && redirectTo.startsWith("/tasks/new")) {
         try {
            const { category, location } = JSON.parse(context);
            const params = new URLSearchParams();
            if (category) params.append("category", category);
            if (location) params.append("location", location);
            if (params.toString()) {
               redirectTo = `/tasks/new?${params.toString()}`;
            }
            // Don't clear yet - will be cleared when TaskCreationFlow component uses it
         } catch (e) {
            console.error("Failed to parse task creation context", e);
         }
      }
   }

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
