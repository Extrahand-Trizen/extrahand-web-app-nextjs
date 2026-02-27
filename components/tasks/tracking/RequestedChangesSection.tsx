"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Task } from "@/types/task";

interface Feedback {
  _id?: string;
  message: string;
  createdById: string;
  createdAt: Date;
}

interface RequestedChangesSectionProps {
  task: Task;
  requesterName?: string;
}

export function RequestedChangesSection({
  task,
  requesterName = "Task Owner",
}: RequestedChangesSectionProps) {
  const feedback: Feedback[] = (task.feedback || []).map((f: any) => ({
    _id: f._id,
    message: f.message,
    createdById: f.createdById,
    createdAt:
      f.createdAt instanceof Date ? f.createdAt : new Date(f.createdAt),
  }));

  if (!feedback || feedback.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
        <p className="text-secondary-600">No changes have been requested yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((change, index) => (
        <div
          key={change._id || index}
          className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 md:p-6"
        >
          <div className="flex items-start gap-3 md:gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm md:text-base font-semibold text-secondary-900">
                  {requesterName} requested changes
                </h4>
                <span className="text-xs md:text-sm text-secondary-500 flex-shrink-0">
                  {new Date(change.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-sm md:text-base text-secondary-700 leading-relaxed break-words">
                {change.message}
              </p>

              {/* Visual indicator - show order */}
              <div className="mt-3 pt-3 border-t border-secondary-100">
                <span className="text-xs text-secondary-500">
                  Change request #{index + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-xs md:text-sm text-blue-800">
          💡 The task was reverted to <strong>Assigned</strong> status. Please review the changes above and complete the work according to the feedback provided. Click "<strong>Start</strong>" to continue when ready.
        </p>
      </div>
    </div>
  );
}
