"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, CheckCircle, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";

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
}

export function VerificationSection({ user }: VerificationSectionProps) {
  const router = useRouter();

  console.log(user);
  // Individual verifications - for all users
  const individualVerifications: VerificationItem[] = [
    {
      id: "phone",
      type: "phone",
      title: "Phone Number",
      description: "Verified during signup via Firebase",
      route: "", // No route - already verified
      isVerified: true, // Always verified via Firebase
      verifiedAt: user.createdAt, // Use account creation date
      required: true,
    },
    {
      id: "email",
      type: "email",
      title: "Email Address",
      description: user.isEmailVerified ? `Verified ${user.email}` : "Verify your email address",
      route: "/profile/verify/email",
      isVerified: user.isEmailVerified || false,
      verifiedAt: user.emailVerifiedAt,
      required: true,
    },
    {
      id: "aadhaar",
      type: "aadhaar",
      title: "Aadhaar Verification",
      description: user.isAadhaarVerified
        ? `Verified ${user.maskedAadhaar || "XXXX XXXX XXXX"}`
        : "Verify your identity with Aadhaar",
      route: "/profile/verify/aadhaar",
      isVerified: user.isAadhaarVerified || false,
      verifiedAt: user.aadhaarVerifiedAt,
      required: false,
    },
    {
      id: "bank",
      type: "bank",
      title: "Bank Account",
      description: user.isBankVerified
        ? `Verified ${user?.maskedBankAccount}`
        : "Verify your bank account",
      route: "/profile/verify/bank",
      isVerified: user.isBankVerified || false,
      verifiedAt: user.bankVerifiedAt,
      required: false,
    },
  ];

  // Business verifications - only for business accounts
  const businessVerifications: VerificationItem[] = user.userType === "business" ? [
    {
      id: "pan",
      type: "pan",
      title: "PAN Verification",
      description: user.business?.pan?.isPANVerified
        ? `Verified ${user.maskedPan || user.business?.pan?.maskedPAN || "XXXXX****X"}`
        : "Verify your PAN for business operations",
      route: "/profile/verify/pan",
      isVerified: user.business?.pan?.isPANVerified || false,
      verifiedAt: user.business?.pan?.panVerifiedAt,
      required: true,
      businessOnly: true,
    },
    {
      id: "gst",
      type: "gst",
      title: "GST Verification",
      description: user.business?.isGSTVerified
        ? `Verified ${user.business?.gstNumber || "GST Number"}`
        : "Verify your GST number for tax compliance",
      route: "/profile/verify/gst",
      isVerified: user.business?.isGSTVerified || false,
      verifiedAt: user.business?.gstVerifiedAt,
      businessOnly: true,
    },
    // TODO: Implement business bank verification in backend first
    // {
    //   id: "business-bank",
    //   type: "business-bank",
    //   title: "Business Bank Account",
    //   description: user.business?.bankAccount?.isVerified
    //     ? `Verified ${user.business.bankAccount.accountHolderName}`
    //     : "Verify your business bank account",
    //   route: "/profile/verify/business-bank",
    //   isVerified: user.business?.bankAccount?.isVerified || false,
    //   verifiedAt: user.business?.bankAccount?.verifiedAt,
    //   required: true,
    //   businessOnly: true,
    // },
  ] : [];

  const handleNavigate = (route: string) => {
    router.push(route);
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
              onClick={() => handleNavigate(item.route)}
              className="w-full px-4 py-4 sm:px-5 sm:py-5 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getVerificationIcon(item)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    {getStatusBadge(item)}
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  {item.verifiedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Verified on {new Date(item.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Business Verifications - Only for business accounts */}
      {user.userType === "business" && businessVerifications.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 sm:px-5 sm:py-4 bg-primary-50 border-b border-primary-200">
            <h3 className="text-sm font-semibold text-primary-900">Business Verifications</h3>
            <p className="text-xs text-primary-700 mt-0.5">Required for business operations</p>
          </div>
          <div className="divide-y divide-gray-100">
            {businessVerifications.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.route)}
                className="w-full px-4 py-4 sm:px-5 sm:py-5 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getVerificationIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      {getStatusBadge(item)}
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    {item.verifiedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Verified on {new Date(item.verifiedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trust Level Info */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-lg p-4 sm:p-5 border border-primary-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Trust Level</h3>
          {user.userType === "business" && user.business?.verificationStatus ? (
            <span className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
              user.business.verificationStatus.badge === "enterprise" && "bg-green-100 text-green-800",
              user.business.verificationStatus.badge === "trusted" && "bg-purple-100 text-purple-800",
              user.business.verificationStatus.badge === "verified" && "bg-blue-100 text-blue-800",
              (user.business.verificationStatus.badge === "basic" || user.business.verificationStatus.badge === "none") && "bg-yellow-100 text-yellow-800"
            )}>
              {user.business.verificationStatus.badge?.toUpperCase() || "BASIC"}
            </span>
          ) : (
            <span className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
              user.verificationBadge === "trusted" && "bg-green-100 text-green-800",
              user.verificationBadge === "verified" && "bg-blue-100 text-blue-800",
              user.verificationBadge === "basic" && "bg-yellow-100 text-yellow-800",
              !user.verificationBadge && "bg-gray-100 text-gray-800"
            )}>
              {user.verificationBadge?.toUpperCase() || "NONE"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">
                {user.userType === "business" && user.business?.verificationStatus ? (
                  `Level ${user.business.verificationStatus.level || 0}/3`
                ) : (
                  user.verificationBadge === "trusted" ? "100%" :
                  user.verificationBadge === "verified" ? "66%" :
                  user.verificationBadge === "basic" ? "33%" : "0%"
                )}
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  user.userType === "business" && user.business?.verificationStatus ? (
                    user.business.verificationStatus.level === 3 ? "bg-green-600 w-full" :
                    user.business.verificationStatus.level === 2 ? "bg-purple-600 w-2/3" :
                    user.business.verificationStatus.level === 1 ? "bg-blue-600 w-1/3" :
                    "bg-yellow-500 w-0"
                  ) : (
                    user.verificationBadge === "trusted" ? "bg-green-600 w-full" :
                    user.verificationBadge === "verified" ? "bg-blue-600 w-2/3" :
                    user.verificationBadge === "basic" ? "bg-yellow-600 w-1/3" :
                    "bg-gray-400 w-0"
                  )
                )}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {user.userType === "business" ? (
            "Complete more business verifications to unlock higher trust levels and premium features"
          ) : (
            "Complete more verifications to increase your trust level and unlock premium features"
          )}
        </p>
      </div>
    </div>
  );
}
