"use client";

import { useSearchParams } from "next/navigation";
import { OTPVerificationForm } from "@/components/auth";
import { formatPhoneNumber } from "@/lib/utils/phone";

export default function OTPVerificationPage() {
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
