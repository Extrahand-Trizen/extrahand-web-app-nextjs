import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { UserProfile } from "@/types/user";
import { UserBadge } from "@/components/ui/user-badge";
import { cn } from "@/lib/utils";

function isRecentlyJoined(createdAt?: Date | string): boolean {
  if (!createdAt) return false;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return false;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

/** Check if user has verified certificates (both verified and certified flags must be true) */
function hasVerifiedCertificates(user: UserProfile): boolean {
  const skills = Array.isArray(user.skills?.list) ? user.skills.list : [];
  const hasVerifiedSkillFlags = skills.some(
    (skill) => skill?.verified === true && skill?.certified === true
  );

  const hasVerifiedCertificateDoc = skills.some((skill) => {
    const certificates = Array.isArray(skill?.certificates) ? skill.certificates : [];
    return certificates.some((cert: any) => isCertificateVerified(cert));
  });

  return hasVerifiedSkillFlags || hasVerifiedCertificateDoc;
}

function isCertificateVerified(cert: any): boolean {
  const status = normalizeCertificateStatus(
    cert?.status ?? cert?.statusTag ?? cert?.verificationStatus ?? cert?.reviewStatus
  );

  return Boolean(
    cert &&
      (cert?.verified === true ||
        cert?.isVerified === true ||
        cert?.approved === true ||
        status === "verified" ||
        status === "approved")
  );
}

function normalizeCertificateStatus(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function PublicProfileMeetCard({
  user,
  isAvailable,
  professionLabel,
  badge,
  ratingLabel,
}: {
  user: UserProfile;
  isAvailable: boolean;
  professionLabel?: string;
  badge?: string | null;
  ratingLabel: React.ReactNode;
}) {
  const resolvedBadge = String(badge || user.verificationBadge || "none").toLowerCase();
  const city = (user.location?.city || "").trim();
  const state = (user.location?.state || "").trim();
  const locationLabel =
    city && state
      ? city.toLowerCase() === state.toLowerCase()
        ? city
        : `${city}, ${state}`
      : city || state || null;

  const recentlyJoined = isRecentlyJoined(user.createdAt);
  const professionalVerified = hasVerifiedCertificates(user);

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Meet
            </div>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-[28px] leading-tight font-semibold text-slate-900 truncate">{user.name}</h2>
            </div>

            {professionLabel ? (
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-700">{professionLabel}</span>
                {professionalVerified ? (
                  <Badge className="shrink-0 border border-emerald-200 bg-emerald-100 text-emerald-800">
                    Professional
                  </Badge>
                ) : null}
              </div>
            ) : null}

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {resolvedBadge !== "none" ? (
                <UserBadge badge={resolvedBadge as any} size="sm" showLabel />
              ) : null}
              {user.isAadhaarVerified ? (
                <Badge className="shrink-0 border border-emerald-200 bg-emerald-100 text-emerald-800">
                  Aadhaar Verified
                </Badge>
              ) : null}
              {isAvailable ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5" />
                  Available Now
                </Badge>
              ) : null}
            </div>
          </div>

          <Avatar className="size-20 shrink-0">
            <AvatarImage src={user.photoURL || undefined} alt={user.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-medium">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {ratingLabel ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5">{ratingLabel}</div>
          </div>
        ) : null}

        {locationLabel ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="size-4" />
            <span className="truncate">{locationLabel}</span>
          </div>
        ) : null}

        <p className={cn("mt-3 text-sm text-slate-600", recentlyJoined ? "" : "hidden")}>
          {user.name} has recently joined ExtraHand and is ready to help you.
        </p>
      </CardContent>
    </Card>
  );
}

// Optional helper to render rating in compact form for the Meet card.
export function buildMeetCardRatingLabel({
  rating,
  totalReviews,
}: {
  rating?: number | null;
  totalReviews?: number | null;
}): React.ReactNode {
  if (totalReviews != null && totalReviews > 0 && rating != null && rating > 0) {
    return (
      <>
        <Star className="size-4 text-amber-400 fill-amber-400" />
        <span className="text-sm font-semibold text-slate-900">{rating.toFixed(1)}</span>
        <span className="text-sm text-slate-500">({totalReviews})</span>
      </>
    );
  }

  return null;
}

