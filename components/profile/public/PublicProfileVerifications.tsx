import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";

function VerificationBadge({ label, verified }: { label: string; verified?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg",
        verified ? "bg-green-50" : "bg-gray-50"
      )}
    >
      {verified ? (
        <CheckCircle2 className="size-4 text-green-500" />
      ) : (
        <div className="size-4 rounded-full border-2 border-gray-300" />
      )}
      <span className={cn("text-sm", verified ? "text-green-700" : "text-gray-500")}>
        {label}
      </span>
    </div>
  );
}

export function PublicProfileVerifications({ user }: { user: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <VerificationBadge label="Identity Verified" verified={!!user.isAadhaarVerified} />
          <VerificationBadge label="Phone Verified" verified={!!user.isPhoneVerified} />
          <VerificationBadge label="Email Verified" verified={!!user.isEmailVerified} />
          <VerificationBadge label="Bank Verified" verified={!!user.isBankVerified} />
          {user.userType === "business" ? (
            <>
              <VerificationBadge label="PAN Verified" verified={!!user.business?.pan?.isPANVerified || !!user.isPanVerified} />
              <VerificationBadge label="GST Verified" verified={!!user.business?.isGSTVerified} />
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

