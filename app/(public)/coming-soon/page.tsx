"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || undefined;
  const label = searchParams.get("label") || undefined;

  const isInfoPage = type === "info";

  const title = isInfoPage ? "Page coming soon" : "Coming Soon!";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
          <Construction className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          {title}
        </h1>
        {isInfoPage && label ? (
          <p className="text-secondary-600">
            {label} page is under construction. Please check back soon.
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {!isInfoPage && (
            <Link href="/tasks/new">
              <Button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold">
                Get Help
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ComingSoonContent />
    </Suspense>
  );
}
