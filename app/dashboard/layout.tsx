'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

   // Show loading while checking auth
   if (loading) {
      return <LoadingSpinner />;
   }

   // Don't render if not authenticated
   if (!userData) {
      return null;
   }

   return (
      <div suppressHydrationWarning>
         <LandingHeader />
         <main className="min-h-[calc(100vh - 110px)]">
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
}
