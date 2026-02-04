"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * StickyMobileCtaBar
 * Fixed bottom bar on small screens to keep the primary CTA visible.
 */
export const StickyMobileCtaBar: React.FC = () => {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-secondary-200 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.2)]">
      <div className="flex gap-3">
        <Link href="/tasks/new" className="flex-1">
          <Button className="w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold py-6 rounded-xl">
            Post a Task
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="border-secondary-300 text-secondary-700 font-medium py-6 rounded-xl">
            Tasker
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StickyMobileCtaBar;
