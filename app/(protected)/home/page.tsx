"use client";

/**
 * Unified Home Page for Signed-In Users
 * Seamless full-width design with integrated hero and action card
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DynamicActionCard, RecommendedTasks } from "@/components/home";
import { useUserStore } from "@/lib/state/userStore";
import { useDashboardStore } from "@/lib/state/dashboardStore";

type CardState =
   | "first_time"
   | "incomplete_setup"
   | "pending_action"
   | "returning_user"
   | "verification_pending"
   | "low_activity"
   | "achievement_unlocked"
   | "payment_pending"
   | "profile_incomplete"
   | "auto";

const POPULAR_CATEGORIES = [
   "Cleaning",
   "Moving",
   "Handyman",
   "Painting",
   "Gardening",
   "Plumbing",
   "Business",
   "Delivery",
];

const CATEGORY_PARAM_MAP: Record<string, string> = {
   Cleaning: "cleaning",
   Gardening: "gardening",
   Delivery: "delivery",
   Moving: "delivery",
   Handyman: "repair",
   Painting: "repair",
   Plumbing: "repair",
   Business: "other",
};

function StatPill({
   label,
   value,
   loading,
}: {
   label: string;
   value: number | undefined;
   loading: boolean;
}) {
   if (loading) {
      return (
         <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary-100 text-secondary-600 text-xs sm:text-sm font-medium inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-secondary-300 animate-pulse" />
            <span className="h-3 w-16 sm:w-20 bg-secondary-300 rounded-full animate-pulse" />
         </div>
      );
   }

   return (
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50 text-primary-800 text-xs sm:text-sm font-medium inline-flex items-center gap-2">
         <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] sm:text-xs font-semibold">
            {typeof value === "number" ? value : "–"}
         </span>
         <span>{label}</span>
      </div>
   );
}

export default function HomePage() {
   const router = useRouter();
   const { user } = useUserStore();
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const { stats, statsLoading, fetchStats } = useDashboardStore();

   useEffect(() => {
      // Warm dashboard stats cache; no-op if already fresh
      fetchStats().catch(() => {
         // Swallow errors here; individual pages can handle messaging if needed
      });
   }, [fetchStats]);

   const handleRefresh = async () => {
      setIsRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsRefreshing(false);
   };

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();

      const params = new URLSearchParams();
      if (trimmed) {
         // Use search text as initial task title
         params.set("title", trimmed);
      }

      const qs = params.toString();
      router.push(qs ? `/tasks/new?${qs}` : "/tasks/new");
   };

   const handleCategoryClick = (category: string) => {
      const params = new URLSearchParams();
      // Use the chip label as a helpful starter title
      params.set("title", category);

      const categoryId = CATEGORY_PARAM_MAP[category];
      if (categoryId) {
         params.set("category", categoryId);
      }

      router.push(`/tasks/new?${params.toString()}`);
   };

   return (
      <>
         <div className="bg-secondary-50">

            {/* Main Content - Full Width */}
            <div className="w-full">
               {/* Full-Width Seamless Card */}
               <div className="bg-white border-b border-secondary-200">
                  {/* Hero Section Inside Card */}
                  <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
                     {/* Greeting - Centered */}
                     <div className="text-center mb-6 sm:mb-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
                           {getGreeting()},{" "}
                           {user?.name?.split(" ")[0] || "there"}
                        </h1>
                        <p className="text-sm sm:text-base text-secondary-600">
                           How can we help you today?
                        </p>
                     </div>

                     {/* Quick stats (from dashboard store) */}
                     <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
                        {(statsLoading || stats) && (
                           <>
                              <StatPill
                                 label="Tasks posted"
                                 value={stats?.totalTasks}
                                 loading={statsLoading && !stats}
                              />
                              <StatPill
                                 label="Tasks completed"
                                 value={stats?.completedTasks}
                                 loading={statsLoading && !stats}
                              />
                              <StatPill
                                 label="Offers sent"
                                 value={stats?.totalApplications}
                                 loading={statsLoading && !stats}
                              />
                           </>
                        )}
                     </div>

                     {/* Search Bar - Centered */}
                     <form
                        onSubmit={handleSearch}
                        className="w-full max-w-2xl mx-auto mb-6"
                     >
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
                           <Input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="What do you need done?"
                              className="h-12 sm:h-14 pl-10 sm:pl-12 pr-24 sm:pr-36 text-sm sm:text-base border-secondary-300 focus-visible:ring-2 focus-visible:ring-primary-500"
                              aria-label="Describe what you need done"
                           />
                           <button
                              type="submit"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 sm:h-10 px-2.5 sm:px-6 bg-primary-500 hover:bg-primary-600 text-white rounded text-[10px] sm:text-base font-medium transition-colors flex items-center justify-center"
                           >
                              <Search className="hidden sm:block w-4 h-4 sm:mr-2" />
                              <span className="whitespace-nowrap leading-none">Get offers</span>
                           </button>
                        </div>
                     </form>

                     {/* Popular Categories - Centered */}
                     <div className="w-full max-w-2xl mx-auto">
                        <p className="text-xs sm:text-sm text-secondary-500 mb-3 sm:mb-4 font-medium text-center">
                           Popular Categories
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                           {POPULAR_CATEGORIES.map((category) => (
                              <button
                                 key={category}
                                 onClick={() => handleCategoryClick(category)}
                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-primary-50 text-secondary-700 hover:text-primary-700 text-xs sm:text-sm font-medium transition-all border border-secondary-200 hover:border-primary-300 shadow-sm hover:shadow-md"
                              >
                                 {category}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Dynamic Action Card Section - Full Width, Centered Content */}
                  <div>
                     <div className="w-full mx-auto">
                        {user && <DynamicActionCard user={user} />}
                     </div>
                  </div>
               </div>

               {/* Recommended Tasks Carousel */}
               <RecommendedTasks />
            </div>
         </div>
      </>
   );
}

function getGreeting(): string {
   const hour = new Date().getHours();
   if (hour < 12) return "Good morning";
   if (hour < 17) return "Good afternoon";
   return "Good evening";
}
