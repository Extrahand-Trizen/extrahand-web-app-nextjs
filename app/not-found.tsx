"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-secondary-50 to-white">
         {/* Content */}
         <div className="text-center max-w-md">
            {/* Icon */}
            <div className="flex justify-center mb-6">
               <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600" />
               </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
               404
            </h1>

            {/* Subheading */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
               Page Not Found
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
               The page you're looking for doesn't exist or has been removed.
               This action is not available at the moment.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-secondary-300 text-secondary-700 hover:bg-secondary-50"
               >
                  <Link href="/" className="flex items-center gap-2">
                     <ArrowLeft className="w-5 h-5" />
                     Go Back
                  </Link>
               </Button>

               <Button
                  asChild
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
               >
                  <Link href="/" className="flex items-center gap-2">
                     <Home className="w-5 h-5" />
                     Home
                  </Link>
               </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-12 p-6 bg-white border border-secondary-200 rounded-lg">
               <p className="text-sm text-gray-600 mb-3">
                  Looking for something else?
               </p>
               <div className="flex flex-col gap-2">
                  <Link
                     href="/discover"
                     className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                     Browse Tasks
                  </Link>
                  <Link
                     href="/services"
                     className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                     Browse Services
                  </Link>
                  <Link
                     href="/"
                     className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                     Home Page
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
