"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Home } from "lucide-react";

interface CategoryNotFoundProps {
   type: "job" | "service";
   categoryName?: string;
}

export const CategoryNotFound: React.FC<CategoryNotFoundProps> = ({
   type,
   categoryName,
}) => {
   const typeLabel = type === "job" ? "Job" : "Service";
   const browseLink = type === "job" ? "/jobs" : "/services";

   return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
         <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
               <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-secondary-400" />
               </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
               <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
                  {typeLabel} Category Not Found
               </h1>
               {categoryName && (
                  <p className="text-base text-secondary-600">
                     We couldn't find "{categoryName}" in our listings.
                  </p>
               )}
            </div>

            {/* Description */}
            <p className="text-sm text-secondary-500">
               This category might not be available yet, or the link may be
               incorrect. Browse our available categories to find what you're
               looking for.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
               <Link href={browseLink}>
                  <Button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600">
                     <Search className="w-4 h-4 mr-2" />
                     Browse All {typeLabel}s
                  </Button>
               </Link>
               <Link href="/">
                  <Button
                     variant="outline"
                     className="w-full sm:w-auto border-secondary-300"
                  >
                     <Home className="w-4 h-4 mr-2" />
                     Go Home
                  </Button>
               </Link>
            </div>

            {/* Additional Help */}
            <div className="pt-6 border-t border-secondary-200">
               <p className="text-xs text-secondary-500">
                  Need help?{" "}
                  <a
                     href="https://extrhand-support-frontend.apps.extrahand.in"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary-600 hover:underline font-medium"
                  >
                     Contact Support
                  </a>
               </p>
            </div>
         </div>
      </div>
   );
};
