/**
 * Public Profile View
 * What others see when viewing a user's profile
 */

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { Review, WorkHistoryItem } from "@/types/profile";
import {
   getAvailabilityInfo,
} from "@/lib/utils/profileMetrics";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { getUserBadge } from "@/lib/api/badge";
import { buildRatingLabel } from "@/components/profile/public/PublicProfileHero";
import { PublicProfileSkills } from "@/components/profile/public/PublicProfileSkills";
import { PublicProfileTrustMetrics } from "@/components/profile/public/PublicProfileTrustMetrics";
import { PublicProfileVerifications } from "@/components/profile/public/PublicProfileVerifications";
import { PublicProfileReviews } from "@/components/profile/public/PublicProfileReviews";
import { PublicProfileWorkProof } from "@/components/profile/public/PublicProfileWorkProof";
import { PublicProfileMeetCard, buildMeetCardRatingLabel } from "@/components/profile/public/PublicProfileMeetCard";
import { PublicProfileAbout } from "@/components/profile/public/PublicProfileAbout";
import { PublicProfilePerformanceBreakdown } from "@/components/profile/public/PublicProfilePerformanceBreakdown";
import { PublicProfilePortfolio } from "@/components/profile/public/PublicProfilePortfolio";

interface PublicProfileProps {
   user: UserProfile;
   reviews?: Review[];
   workHistory?: WorkHistoryItem[];
   isOwnProfile?: boolean;
}

export function PublicProfile({
   user,
   reviews = [],
   workHistory = [],
   isOwnProfile = false,
}: PublicProfileProps) {
   // Fetch stats from backend
   const [stats, setStats] = useState<{
      totalTasks: number;
      completedTasks: number;
      postedTasks: number;
      totalReviews: number;
      rating: number;
   } | null>(null);
   
   // Fetch badge info
   const [badge, setBadge] = useState<{ currentBadge: string; uid: string } | null>(null);

   useEffect(() => {
      async function fetchBadge() {
         try {
            const lookupId = user.uid || user._id;
            if (!lookupId) return;

            console.log("Fetching badge for user:", lookupId);
            const badgeData = await getUserBadge(lookupId);
            console.log("✅ Badge fetched:", badgeData);
            setBadge(badgeData);
         } catch (error: any) {
            console.warn("⚠️ Failed to fetch badge:", error.message);
         }
      }

      fetchBadge();
   }, [user.uid, user._id]);

   useEffect(() => {
      async function fetchStats() {
         try {
            const userId = user._id || user.uid;
            if (!userId) return;

            console.log("📊 Fetching stats for user:", userId);
            const statsResponse = await profilesApi.getProfileStats(userId);
            console.log("✅ Stats fetched:", statsResponse);
            const normalizedStats = normalizeProfileStatsPayload(statsResponse);

            if (normalizedStats) {
               setStats(normalizedStats);
            } else {
               setStats({
                  totalTasks: user.totalTasks || 0,
                  completedTasks: user.completedTasks || 0,
                  postedTasks: 0,
                  totalReviews: user.totalReviews || 0,
                  rating: user.rating || 0,
               });
            }
         } catch (error: any) {
            console.warn("⚠️ Failed to fetch stats:", error.message);
            // Use fallback from user profile
            setStats({
               totalTasks: user.totalTasks || 0,
               completedTasks: user.completedTasks || 0,
               postedTasks: 0,
               totalReviews: user.totalReviews || 0,
               rating: user.rating || 0,
            });
         }
      }

      fetchStats();
   }, [user._id, user.uid, user.totalTasks, user.completedTasks, user.totalReviews, user.rating]);

   // Use backend stats if available, otherwise fall back to user profile data
   const actualStats = stats || {
      totalTasks: user.totalTasks || 0,
      completedTasks: user.completedTasks || 0,
      postedTasks: 0,
      totalReviews: user.totalReviews || 0,
      rating: user.rating || 0,
   };

   const completedTasks = Math.max(
      toSafeNumber(actualStats.completedTasks),
      toSafeNumber(user.completedTasks),
      Array.isArray(workHistory) ? workHistory.length : 0
   );

   const totalTasks = Math.max(
      toSafeNumber(actualStats.totalTasks),
      toSafeNumber(user.totalTasks),
      completedTasks
   );

   // Calculate metrics using backend stats
   const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const availability = getAvailabilityInfo(user);

   const professionLabel = getNormalizedProfession(user.profession);
   const meetCardRatingNode = buildMeetCardRatingLabel({
      rating: actualStats.rating,
      totalReviews: actualStats.totalReviews,
   });
   const hasReviews = reviews.length > 0 || (actualStats.totalReviews ?? 0) > 0;

   return (
      <div className="max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[420px_1fr] gap-6 lg:gap-8">
            {/* Left column: Meet card (not sticky) */}
            <div className="md:self-start">
               <PublicProfileMeetCard
                  user={user}
                  isAvailable={availability.isAvailable}
                  professionLabel={professionLabel}
                  badge={badge?.currentBadge || null}
                  ratingLabel={meetCardRatingNode}
                  hasReviews={hasReviews}
               />
            </div>

            {/* Right column: main content */}
            <div className="space-y-6 min-w-0">
               <PublicProfilePortfolio user={user} />

               <PublicProfileAbout user={user} />

               <PublicProfileTrustMetrics
                  completedTasks={completedTasks}
                  completionRatePercent={completionRate}
                  avgRating={actualStats.rating ?? 0}
               />

               <PublicProfilePerformanceBreakdown
                  reviews={reviews}
                  completedTasks={completedTasks}
               />

               {/* Reviews: carousel + see all */}
               <PublicProfileReviews
                  reviews={reviews}
                  userName={user.name}
                  memberSince={user.createdAt}
                  totalReviews={actualStats.totalReviews ?? 0}
                  avgRating={actualStats.rating ?? 0}
               />

               <PublicProfileSkills user={user} />

               <PublicProfileWorkProof workHistory={workHistory} />

               {/* Verifications last (per profile structure preference) */}
               <PublicProfileVerifications user={user} />
            </div>
         </div>
      </div>
   );
}

function getNormalizedProfession(profession?: string): string {
   const clean = (profession || "").trim();
   if (!clean) return "";

   return clean
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
}

function toSafeNumber(value: unknown): number {
   const parsed = Number(value);
   return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeProfileStatsPayload(payload: any): {
   totalTasks: number;
   completedTasks: number;
   postedTasks: number;
   totalReviews: number;
   rating: number;
} | null {
   const candidate = payload?.data?.data || payload?.data || payload;
   if (!candidate || typeof candidate !== "object") {
      return null;
   }

   return {
      totalTasks: Number(candidate.totalTasks || 0),
      completedTasks: Number(candidate.completedTasks || 0),
      postedTasks: Number(candidate.postedTasks || 0),
      totalReviews: Number(candidate.totalReviews || 0),
      rating: Number(candidate.rating || 0),
   };
}

export default PublicProfile;
