"use client";

/**
 * Unified Home Page for Signed-In Users
 * Seamless full-width design with integrated hero and action card
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw, X, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
   NotificationCenter,
   QuickSearch,
   DynamicActionCard,
   RecommendedTasks,
} from "@/components/home";
import { mockDashboardData, mockUser } from "@/lib/data/mockDashboard";
import type { DashboardData } from "@/types/dashboard";

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

export default function HomePage() {
   const router = useRouter();
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCardState, setSelectedCardState] =
      useState<CardState>("auto");
   const [showSettingsPanel, setShowSettingsPanel] = useState(false);

   const data: DashboardData = mockDashboardData;
   const user = mockUser;

   const handleRefresh = async () => {
      setIsRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsRefreshing(false);
   };

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         router.push(`/tasks?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
         router.push("/tasks");
      }
   };

   const handleCategoryClick = (category: string) => {
      router.push(`/tasks?q=${encodeURIComponent(category)}`);
   };

   return (
      <>
         <div className="bg-secondary-50">
            {/* Header Actions - Top Right */}
            <div className="fixed top-20 right-4 z-50 flex items-center gap-2">
               <QuickSearch tasks={data.taskSnapshots} />
               <NotificationCenter status={data.currentStatus} />
               <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors bg-white shadow-sm"
                  title="Refresh"
               >
                  <RefreshCw
                     className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
               </button>
               <button
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors bg-white shadow-sm"
                  title="Card Settings (Dev)"
               >
                  <Settings />
               </button>
            </div>

            {/* Settings Panel - Fixed on Right Side */}
            {showSettingsPanel && (
               <div className="fixed right-0 top-30 h-1/2 w-64 bg-white border-l border-secondary-200 shadow-xl z-40 overflow-y-auto">
                  <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-secondary-900">
                        Card State (Dev)
                     </h3>
                     <button
                        onClick={() => setShowSettingsPanel(false)}
                        className="p-1 text-secondary-400 hover:text-secondary-600"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="p-4">
                     <label className="block text-xs font-medium text-secondary-700 mb-2">
                        Select Card State
                     </label>
                     <select
                        value={selectedCardState}
                        onChange={(e) =>
                           setSelectedCardState(e.target.value as CardState)
                        }
                        className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                     >
                        <option value="auto">Auto (Based on Data)</option>
                        <option value="first_time">First Time User</option>
                        <option value="incomplete_setup">
                           Incomplete Setup
                        </option>
                        <option value="pending_action">Pending Action</option>
                        <option value="verification_pending">
                           Verification Pending
                        </option>
                        <option value="payment_pending">Payment Pending</option>
                        <option value="profile_incomplete">
                           Profile Incomplete
                        </option>
                        <option value="low_activity">Low Activity</option>
                        <option value="achievement_unlocked">
                           Achievement Unlocked
                        </option>
                        <option value="returning_user">Returning User</option>
                     </select>
                  </div>
               </div>
            )}

            {/* Main Content - Full Width */}
            <div className="w-full">
               {/* Full-Width Seamless Card */}
               <div className="bg-white border-b border-secondary-200">
                  {/* Hero Section Inside Card */}
                  <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
                     {/* Greeting - Centered */}
                     <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
                           {getGreeting()},{" "}
                           {user.name?.split(" ")[0] || "there"}
                        </h1>
                        <p className="text-sm sm:text-base text-secondary-600">
                           How can we help you today?
                        </p>
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
                              placeholder="Search tasks..."
                              className="h-12 sm:h-14 pl-10 sm:pl-12 pr-24 sm:pr-28 text-sm sm:text-base border-secondary-300 focus-visible:ring-2 focus-visible:ring-primary-500"
                              aria-label="Search tasks"
                           />
                           <button
                              type="submit"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 sm:h-10 px-4 sm:px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm sm:text-base font-medium transition-colors flex items-center gap-2"
                           >
                              <Search className="w-4 h-4" />
                              <span>Search</span>
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
                  <div >
                     <div className="w-full mx-auto">
                        <DynamicActionCard
                           data={data}
                           user={user}
                           overrideState={
                              selectedCardState === "auto"
                                 ? undefined
                                 : selectedCardState
                           }
                        />
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
