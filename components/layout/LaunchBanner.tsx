import React from "react";
import { Megaphone } from "lucide-react";

export function LaunchBanner() {
  return (
    <div className="w-full border-b border-primary-200 bg-primary-50/80">
      <div className="max-w-7xl mx-auto py-2.5 px-0">
        <div className="flex w-full items-start gap-3 pr-4 sm:pr-6 lg:pr-8">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-primary-300 shadow-sm">
            <Megaphone className="size-4 text-secondary-800" />
          </div>

          <p className="flex-1 min-w-0 text-base sm:text-lg leading-7 text-secondary-900">
            ExtraHand is now live in Hyderabad from April 1.
            <span className="text-secondary-800">
            <span className="font-semibold text-secondary-800">Task completion may depend on current availability in your area.</span>
            Our team is actively onboarding helpers across categories.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

