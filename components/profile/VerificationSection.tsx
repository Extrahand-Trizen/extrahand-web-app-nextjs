"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, CheckCircle, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";

interface VerificationSectionProps {
  user: UserProfile;
  onVerify?: (type: string) => void;
}

interface VerificationItem {
  id: string;
  type: string;
  title: string;
  description: string;
  route: string;
  isVerified: boolean;
  verifiedAt?: Date;
  required?: boolean;
  businessOnly?: boolean;
  /** When true, verified items do not navigate (e.g. Aadhaar KYC is one-time). */
  lockAfterVerification?: boolean;
}

/** Single source of truth for trust/verification level. Avoids duplicated badge/percentage logic in UI. */
function getTrustMeta(user: UserProfile): {
  percentage: number;
  badge: string;
  badgeLabel: string;
  barWidthPercent: number;
  barClassName: string;
  badgeClassName: string;
} {
  const badgeToPercentage: Record<string, number> = {
    trusted: 100,
    verified: 66,
    basic: 33,
    none: 0,
  };
  const badgeToBarClass: Record<string, string> = {
    trusted: "bg-green-600",
    verified: "bg-blue-600",
    basic: "bg-yellow-600",
    none: "bg-gray-400",
  };
  const badgeToBadgeClass: Record<string, string> = {
    trusted: "bg-green-100 text-green-800",
    verified: "bg-blue-100 text-blue-800",
    basic: "bg-yellow-100 text-yellow-800",
    enterprise: "bg-green-100 text-green-800",
    none: "bg-gray-100 text-gray-800",
  };

  if (user.userType === "business" && user.business?.verificationStatus) {
    const level = user.business.verificationStatus.level ?? 0;
    const badge = user.business.verificationStatus.badge ?? "none";
    const maxLevel = 3;
    return {
      percentage: Math.round((level / maxLevel) * 100),
      badge,
      badgeLabel: (badge === "none" ? "BASIC" : badge).toUpperCase(),
      barWidthPercent: (level / maxLevel) * 100,
      barClassName:
        level === 3 ? "bg-green-600" :
        level === 2 ? "bg-purple-600" :
        level === 1 ? "bg-blue-600" : "bg-yellow-500",
      badgeClassName: badgeToBadgeClass[badge] ?? "bg-yellow-100 text-yellow-800",
    };
  }

  const badge = user.verificationBadge ?? "none";
  const percentage = badgeToPercentage[badge] ?? 0;
  return {
    percentage,
    badge,
    badgeLabel: (badge === "none" ? "NONE" : badge).toUpperCase(),
    barWidthPercent: percentage,
    barClassName: badgeToBarClass[badge] ?? "bg-gray-400",
    badgeClassName: badgeToBadgeClass[badge] ?? "bg-gray-100 text-gray-800",
  };
}

/** Consistent verification date formatting. Locale-controlled, single place to change. */
function formatVerificationDate(date?: Date | string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Factory: one contract for all verification items. DRY, testable, easy to extend. */
function createVerificationItem({
  id,
  title,
  isVerified,
  verifiedAt,
  verifiedText,
  defaultText,
  route,
  required = false,
  businessOnly,
  lockAfterVerification,
}: {
  id: string;
  title: string;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedText?: string;
  defaultText: string;
  route: string;
  required?: boolean;
  businessOnly?: boolean;
  lockAfterVerification?: boolean;
}): VerificationItem {
  const verified = isVerified ?? false;
  return {
    id,
    type: id,
    title,
    description: verified ? (verifiedText ?? "Verified") : defaultText,
    route,
    isVerified: verified,
    verifiedAt,
    required,
    ...(businessOnly !== undefined && { businessOnly }),
    ...(lockAfterVerification !== undefined && { lockAfterVerification }),
  };
}

export function VerificationSection({ user }: VerificationSectionProps) {
  const router = useRouter();

  const isBusiness = user.userType === "business";
  const panData = isBusiness
    ? user.business?.pan
    : {
        isPANVerified: user.isPanVerified,
        maskedPAN: user.maskedPan,
        panVerifiedAt: user.panVerifiedAt,
      };
  const isPANVerified = panData?.isPANVerified ?? false;
  const trustMeta = getTrustMeta(user);

  // Individual verifications – single source of truth via factory
  const individualVerifications: VerificationItem[] = [
    createVerificationItem({
      id: "phone",
      title: "Phone Number",
      isVerified: !!user.phone,
      verifiedAt: user.createdAt,
      verifiedText: user.phone ? `Verified ${user.phone}` : "Verified",
      defaultText: "Verify your phone number",
      route: "",
      required: true,
    }),
    createVerificationItem({
      id: "email",
      title: "Email Address",
      isVerified: user.isEmailVerified,
      verifiedAt: user.emailVerifiedAt,
      verifiedText: user.email ? `Verified ${user.email}` : "Verified",
      defaultText: "Verify your email address",
      route: "/profile/verify/email",
      required: true,
    }),
    createVerificationItem({
      id: "aadhaar",
      title: "Aadhaar Verification",
      isVerified: user.isAadhaarVerified,
      verifiedAt: user.aadhaarVerifiedAt,
      verifiedText: `Verified ${user.maskedAadhaar || "XXXX XXXX XXXX"}`,
      defaultText: "Verify your identity with Aadhaar",
      route: "/profile/verify/aadhaar",
      lockAfterVerification: true,
    }),
    createVerificationItem({
      id: "bank",
      title: "Bank Account",
      isVerified: user.isBankVerified,
      verifiedAt: user.bankVerifiedAt,
      verifiedText: user.maskedBankAccount ? `Verified ${user.maskedBankAccount}` : "Verified",
      defaultText: "Verify your bank account",
      route: "/profile/verify/bank",
    }),
    createVerificationItem({
      id: "pan",
      title: "PAN Card",
      isVerified: isPANVerified,
      verifiedAt: panData?.panVerifiedAt,
      verifiedText: `Verified ${panData?.maskedPAN || "XXXXX****X"}`,
      defaultText: "Verify your PAN card",
      route: "/profile/verify/pan",
    }),
  ];

  // Business verifications – same factory, businessOnly flag
  const businessVerifications: VerificationItem[] = isBusiness
      ? [
          createVerificationItem({
            id: "gst",
            title: "GST Verification",
            isVerified: user.business?.isGSTVerified,
            verifiedAt: user.business?.gstVerifiedAt,
            verifiedText: `Verified ${user.business?.gstNumber || "GST Number"}`,
            defaultText: "Verify your GST number for tax compliance",
            route: "/profile/verify/gst",
            businessOnly: true,
          }),
        ]
      : [];

  const handleNavigate = (item: VerificationItem) => {
    if (item.isVerified && item.lockAfterVerification) {
      toast.success("Already verified", {
        description: "This verification has already been completed and cannot be changed.",
      });
      return;
    }
    if (item.route) {
      router.push(item.route);
    }
  };

  const getVerificationIcon = (item: VerificationItem) => {
    if (item.isVerified) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (item.required) {
      return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
    return <Shield className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = (item: VerificationItem) => {
    if (item.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Verified
        </span>
      );
    }
    if (item.required) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Optional
      </span>
    );
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Verifications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Verify your identity to build trust and unlock features
        </p>
      </div>

      {/* Individual Verifications */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Individual Verifications</h3>
          <p className="text-xs text-gray-500 mt-0.5">Required for all users</p>
        </div>
        <div className="divide-y divide-gray-100">
          {individualVerifications.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item)}
              className="w-full px-4 py-4 sm:px-5 sm:py-5 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {getVerificationIcon(item)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    {getStatusBadge(item)}
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  {item.verifiedAt && formatVerificationDate(item.verifiedAt) && (
                    <p className="text-xs text-gray-400 mt-1">
                      Verified on {formatVerificationDate(item.verifiedAt)}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Business Verifications - Only for business accounts */}
      {isBusiness && businessVerifications.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 sm:px-5 sm:py-4 bg-primary-50 border-b border-primary-200">
            <h3 className="text-sm font-semibold text-primary-900">Business Verifications</h3>
            <p className="text-xs text-primary-700 mt-0.5">Required for business operations</p>
          </div>
          <div className="divide-y divide-gray-100">
            {businessVerifications.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item)}
                className="w-full px-4 py-4 sm:px-5 sm:py-5 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {getVerificationIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      {getStatusBadge(item)}
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    {item.verifiedAt && formatVerificationDate(item.verifiedAt) && (
                      <p className="text-xs text-gray-400 mt-1">
                        Verified on {formatVerificationDate(item.verifiedAt)}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trust Level Info – driven by getTrustMeta, no duplicated badge/percentage logic */}
      <div className="bg-linear-to-br from-primary-50 to-primary-100/50 rounded-lg p-4 sm:p-5 border border-primary-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Trust Level</h3>
          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", trustMeta.badgeClassName)}>
            {trustMeta.badgeLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">{trustMeta.percentage}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", trustMeta.barClassName)}
                style={{ width: `${trustMeta.barWidthPercent}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {isBusiness
            ? "Complete more business verifications to unlock higher trust levels and premium features"
            : "Complete more verifications to increase your trust level and unlock premium features"}
        </p>
      </div>
    </div>
  );
}
