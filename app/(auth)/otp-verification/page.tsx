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
   const redirectTo = searchParams.get("next") || "/home";

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
