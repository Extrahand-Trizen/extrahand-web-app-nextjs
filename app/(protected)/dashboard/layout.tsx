'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { RouteChrome } from "@/components/layout/RouteChrome";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { userData, loading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      // Only redirect if we're done loading and there's no user
      if (!loading && !userData) {
         router.push("/login");
      }
   }, [userData, loading, router]);

   // Show a lightweight skeleton while checking auth instead of a bare spinner
   if (loading) {
      return (
         <div className="min-h-screen bg-secondary-50">
            <div className="border-b bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
                     <div className="h-4 w-28 bg-secondary-200 rounded animate-pulse" />
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                     <div className="h-8 w-20 bg-secondary-200 rounded-full animate-pulse" />
                     <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
                  </div>
               </div>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
               <div className="h-8 w-40 bg-secondary-200 rounded animate-pulse mb-4" />
               <div className="h-40 bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse" />
            </main>
         </div>
      );
   }

   // Don't render if not authenticated
   if (!userData) {
      return null;
   }

   return <RouteChrome variant="protected">{children}</RouteChrome>;
}
