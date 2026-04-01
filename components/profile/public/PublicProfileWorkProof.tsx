import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Star } from "lucide-react";
import { WorkHistoryItem } from "@/types/profile";
import { cn } from "@/lib/utils";

function formatDate(date?: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function WorkItem({ item }: { item: WorkHistoryItem }) {
  const categoryColors: Record<string, string> = {
    cleaning: "bg-blue-100 text-blue-700",
    repair: "bg-orange-100 text-orange-700",
    delivery: "bg-green-100 text-green-700",
    assembly: "bg-purple-100 text-purple-700",
    gardening: "bg-emerald-100 text-emerald-700",
    petcare: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-colors h-full">
      <div className="flex items-start gap-2 mb-2">
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <Briefcase className="size-4 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
            {item.taskTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Badge
          variant="secondary"
          className={cn(
            "capitalize text-[10px] px-1.5 py-0.5 h-5",
            categoryColors[item.category] || categoryColors.other
          )}
        >
          {item.category}
        </Badge>
        {item.earnings ? (
          <span className="text-sm font-bold text-gray-900">
            ₹{item.earnings.toLocaleString("en-IN")}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {formatDate(item.completedDate)}
        </span>
        {item.rating ? (
          <span className="flex items-center gap-0.5">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            {item.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function PublicProfileWorkProof({ workHistory }: { workHistory: WorkHistoryItem[] }) {
  if (!workHistory || workHistory.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Work Proof</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workHistory.slice(0, 6).map((item) => (
            <WorkItem key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

