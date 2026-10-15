"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");
  const label = searchParams.get("label");

  const title = label
    ? `${label} Coming Soon`
    : feature
      ? `${feature.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Coming Soon`
      : "Coming Soon";

  const isInfoPage = Boolean(feature && label);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
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
            <Button
              onClick={() => redirectToAppStore()}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold cursor-pointer"
            >
              Get Help
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Button>
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
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
              <Construction className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
              Coming Soon
            </h1>
          </div>
        </div>
      }
    >
      <ComingSoonContent />
    </Suspense>
  );
}
