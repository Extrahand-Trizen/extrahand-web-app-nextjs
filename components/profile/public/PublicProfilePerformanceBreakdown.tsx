import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import type { Review } from "@/types/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type RatingKey = "communication" | "quality" | "timeliness" | "professionalism" | "value";

const RATING_ROWS: Array<{ key: RatingKey; label: string }> = [
  { key: "communication", label: "Communication" },
  { key: "quality", label: "Quality" },
  { key: "timeliness", label: "Timeliness" },
  { key: "value", label: "Value" },
  { key: "professionalism", label: "Professionalism" },
];

function clampRating(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(5, v));
}

function computeAverages(reviews: Review[]) {
  const acc: Record<RatingKey, { sum: number; count: number }> = {
    communication: { sum: 0, count: 0 },
    quality: { sum: 0, count: 0 },
    timeliness: { sum: 0, count: 0 },
    professionalism: { sum: 0, count: 0 },
    value: { sum: 0, count: 0 },
  };

  for (const r of reviews) {
    const ratings = r.ratings;
    if (!ratings) continue;

    for (const { key } of RATING_ROWS) {
      const v = ratings[key];
      if (typeof v !== "number" || v <= 0) continue;
      acc[key].sum += clampRating(v);
      acc[key].count += 1;
    }
  }

  const averages: Partial<Record<RatingKey, number>> = {};
  for (const { key } of RATING_ROWS) {
    if (acc[key].count > 0) averages[key] = acc[key].sum / acc[key].count;
  }

  const hasAny = Object.keys(averages).length > 0;
  return { averages, hasAny };
}

function RatingRow({ label, value }: { label: string; value: number }) {
  const pct = (clampRating(value) / 5) * 100;
  return (
    <div className="grid grid-cols-[140px_1fr_64px] items-center gap-3">
      <div className="text-xs text-secondary-600">{label}</div>
      <div className="h-2 rounded-full bg-secondary-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-secondary-900"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-end gap-1 text-xs text-secondary-900 font-semibold tabular-nums">
        <Star className="size-3.5 text-amber-400 fill-amber-400" />
        <span>{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

export function PublicProfilePerformanceBreakdown({
  reviews,
  completedTasks,
}: {
  reviews: Review[];
  completedTasks: number;
}) {
  const { averages, hasAny } = useMemo(() => computeAverages(reviews), [reviews]);
  const [expanded, setExpanded] = useState(false);

  if (!completedTasks || completedTasks <= 0) return null;
  if (!hasAny) return null;

  const reviewsWithDetailedRatings = reviews.filter(
    (r) => r.ratings && Object.values(r.ratings).some((v) => typeof v === "number" && v > 0)
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">Performance breakdown</CardTitle>
            <div className={cn("text-xs text-muted-foreground", reviewsWithDetailedRatings ? "" : "hidden")}>
              {reviewsWithDetailedRatings} review{reviewsWithDetailedRatings === 1 ? "" : "s"}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2 text-secondary-700 hover:text-secondary-900"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                Hide <ChevronUp className="size-4 ml-1" />
              </>
            ) : (
              <>
                Show <ChevronDown className="size-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded ? (
        <CardContent className="space-y-3">
          {RATING_ROWS.map(({ key, label }) => {
            const v = averages[key];
            if (typeof v !== "number") return null;
            return <RatingRow key={key} label={label} value={v} />;
          })}
        </CardContent>
      ) : null}
    </Card>
  );
}

