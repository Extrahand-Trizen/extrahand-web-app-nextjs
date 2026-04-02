import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type TrustMetricsProps = {
  completedTasks: number;
  completionRatePercent: number;
  avgRating: number;
};

function Metric({
  icon: Icon,
  label,
  value,
  sublabel,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-none shadow-sm bg-slate-50/50", className)}>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className="p-2 rounded-full bg-white shadow-sm mb-3">
          <Icon className="size-5 text-slate-700" />
        </div>
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">
          {label}
        </div>
        {sublabel ? (
          <div className="text-xs text-slate-500 mt-1">{sublabel}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PublicProfileTrustMetrics({
  completedTasks,
  completionRatePercent,
  avgRating,
}: TrustMetricsProps) {
  const safeRating = Number.isFinite(avgRating) ? Math.max(0, Math.min(5, avgRating)) : 0;
  const hasAnyTask = completedTasks > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Metric
        icon={CheckCircle2}
        label="Tasks Completed"
        value={
          hasAnyTask ? (
            String(completedTasks)
          ) : (
            <Badge
              variant="secondary"
              className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-sm font-medium"
            >
              New
            </Badge>
          )
        }
      />
      <Metric icon={TrendingUp} label="Completion Rate" value={`${completionRatePercent}%`} />
      <Metric icon={Star} label="Avg Rating" value={safeRating > 0 ? safeRating.toFixed(1) : "New"} />
    </div>
  );
}

