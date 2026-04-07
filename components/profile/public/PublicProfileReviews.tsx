import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Review } from "@/types/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function formatDate(date?: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function isRecentlyJoined(createdAt?: Date | string): boolean {
  if (!createdAt) return false;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return false;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const hasLongComment = (review.comment || "").trim().length > 120;

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-colors h-full">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={review.reviewerPhoto} />
          <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-semibold">
            {review.reviewerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{review.reviewerName}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>
        <span className="text-[10px] text-gray-500 shrink-0">{formatDate(review.createdAt)}</span>
      </div>

      {review.comment ? (
        <div className="mb-2">
          <p className={cn("text-xs text-gray-600", expanded ? "" : "line-clamp-2")}>
            "{review.comment}"
          </p>
          {hasLongComment ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="size-3.5" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="size-3.5" />
                </>
              )}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-1 text-[10px] text-gray-500">
        <Briefcase className="size-3" />
        <span className="truncate">{review.taskTitle || "Task"}</span>
      </div>
    </div>
  );
}

export function PublicProfileReviews({
  reviews,
  userName,
  memberSince,
  totalReviews = 0,
  avgRating = 0,
}: {
  reviews: Review[];
  userName: string;
  memberSince?: Date | string;
  totalReviews?: number;
  avgRating?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (typeof r.rating === "number" ? r.rating : 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const top = sorted.slice(0, 3);
  const recentlyJoined = isRecentlyJoined(memberSince);
  const displayReviewCount = Math.max(reviews.length, totalReviews || 0);
  const displayRating = averageRating > 0 ? averageRating : avgRating;
  const hasAnyReviews = top.length > 0 || displayReviewCount > 0;

  return (
    <Card>
      <CardHeader>
        {hasAnyReviews ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-base flex items-center gap-2">
                Overall rating {displayRating.toFixed(1)}
                <Star className="size-4 text-amber-400 fill-amber-400" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">{displayReviewCount} reviews</p>
            </div>
            {reviews.length > 3 ? (
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? `Show top reviews` : `See all ${reviews.length} reviews`}
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <CardTitle className="text-base">No reviews yet</CardTitle>
            <p className="text-sm text-muted-foreground">
              {recentlyJoined ? `${userName} has recently joined ExtraHand` : `Be the first to hire ${userName}`}
            </p>
          </>
        )}
      </CardHeader>
      <CardContent>
        {top.length > 0 ? (
          <>
            {!expanded ? (
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {top.map((r) => (
                    <div key={r.id} className="snap-start shrink-0 w-[280px]">
                      <ReviewItem review={r} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sorted.map((r) => (
                  <ReviewItem key={r.id} review={r} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-slate-700">
            {displayReviewCount > 0
              ? "Reviews are available and will appear here shortly."
              : recentlyJoined
              ? `${userName} is new here — be the first to hire and leave a review.`
              : `No reviews yet — be the first to hire ${userName}.`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

