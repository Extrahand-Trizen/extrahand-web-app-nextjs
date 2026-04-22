import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Star, Clock } from "lucide-react";
import { UserProfile } from "@/types/user";
import { UserBadge } from "@/components/ui/user-badge";
import { cn } from "@/lib/utils";
import { getSafeProfilePhotoUrl } from "@/lib/utils/profilePhoto";

type PublicHeroProps = {
  user: UserProfile;
  isAvailable: boolean;
  responseTimeLabel?: string | null;
  headline?: string | null;
  badge?: string | null;
  ratingLabel: React.ReactNode;
};

function formatDate(date?: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/** Avoid showing future "Member since" dates (e.g. bad backend/seed data). */
function formatMemberSince(date?: Date | string): string {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  if (Number.isNaN(d.getTime())) return "—";
  if (d.getTime() > now.getTime()) return "Recently";
  return formatDate(date);
}

export function PublicProfileHero({
  user,
  isAvailable,
  responseTimeLabel,
  headline,
  badge,
  ratingLabel,
}: PublicHeroProps) {
  const resolvedBadge = String(badge || user.verificationBadge || "none").toLowerCase();
  const safePhotoUrl = getSafeProfilePhotoUrl(user);
  const locationLabel =
    user.location?.city || user.location?.state ? `${user.location?.city || ""}${user.location?.city && user.location?.state ? ", " : ""}${user.location?.state || ""}` : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-5 min-w-0">
            <div className="relative">
              <Avatar className="md:w-24 md:h-24 w-20 h-20 shrink-0">
                <AvatarImage src={safePhotoUrl} alt={user.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-medium">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isAvailable && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
                  {user.name}
                </h1>
                {resolvedBadge !== "none" && (
                  <UserBadge badge={resolvedBadge as any} size="md" showLabel clickable />
                )}
                {isAvailable && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
                    Available Now
                  </Badge>
                )}
              </div>

              {/* Headline */}
              <p className="mt-1 text-sm md:text-base text-gray-700">
                {headline?.trim() ? headline : "This tasker is ready to help with your tasks."}
              </p>

              {/* Rating / new user */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">{ratingLabel}</div>
                {responseTimeLabel ? (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="size-4" />
                      {responseTimeLabel}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                {locationLabel ? (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    <span>{locationLabel}</span>
                  </div>
                ) : null}
                <div className={cn("flex items-center gap-1.5", locationLabel ? "" : "")}>
                  <Calendar className="size-4" />
                  <span>Member since {formatMemberSince(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for CTA block; we’ll wire this later */}
          <div className="hidden md:flex shrink-0 flex-col items-end gap-2" />
        </div>
      </CardContent>
    </Card>
  );
}

export function buildRatingLabel({
  rating,
  totalReviews,
}: {
  rating?: number | null;
  totalReviews?: number | null;
}): React.ReactNode {
  if (totalReviews != null && totalReviews > 0 && rating != null && rating > 0) {
    return (
      <>
        <Star className="size-5 text-amber-400 fill-amber-400" />
        <span className="text-base font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
      </>
    );
  }

  return (
    <>
      <Badge
        variant="secondary"
        className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-sm font-medium"
      >
        New on ExtraHand
      </Badge>
    </>
  );
}

