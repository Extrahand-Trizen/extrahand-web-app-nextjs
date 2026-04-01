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
            setStats(statsResponse.data);
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

   // Calculate metrics using backend stats
   const completionRate = actualStats.totalTasks > 0
      ? Math.round((actualStats.completedTasks / actualStats.totalTasks) * 100)
      : 0;

   const availability = getAvailabilityInfo(user);
   const responseTimeLabel = normalizeResponseTimeLabel(availability?.responseTime);

   const headline = buildHeadline(user);
   const ratingNode = buildRatingLabel({
      rating: actualStats.rating,
      totalReviews: actualStats.totalReviews,
   });
   const meetCardRatingNode = buildMeetCardRatingLabel({
      rating: actualStats.rating,
      totalReviews: actualStats.totalReviews,
   });

   return (
      <div className="max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
            {/* Left column: Meet card (not sticky) */}
            <div className="md:self-start">
               <PublicProfileMeetCard
                  user={user}
                  isAvailable={availability.isAvailable}
                  headline={headline}
                  badge={badge?.currentBadge || null}
                  ratingLabel={meetCardRatingNode}
               />
            </div>

            {/* Right column: main content */}
            <div className="space-y-6 min-w-0">
               <PublicProfileAbout user={user} />

               {/* Reviews: carousel + see all */}
               <PublicProfileReviews
                  reviews={reviews}
                  userName={user.name}
                  memberSince={user.createdAt}
               />

               <PublicProfileTrustMetrics
                  completedTasks={actualStats.completedTasks ?? 0}
                  completionRatePercent={completionRate}
                  responseTimeLabel={responseTimeLabel}
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

function buildHeadline(user: UserProfile): string {
   const years = (user.skills?.list ?? [])
      .map((s) => s.yearsOfExperience)
      .filter((y): y is number => typeof y === "number" && y > 0);
   const maxYears = years.length > 0 ? Math.max(...years) : null;
   const topSkills = (user.skills?.list ?? []).map((s) => s.name).filter(Boolean).slice(0, 3);
   const city = user.location?.city || user.location?.state || "";

   if (topSkills.length > 0) {
      const skillsLabel = topSkills.join(" | ");
      const yearsLabel = maxYears ? ` | ${maxYears}+ Years Experience` : "";
      return `${skillsLabel}${yearsLabel}${city ? ` • ${city}` : ""}`;
   }

   if (city) return `Helping with home tasks in ${city}`;
   return "Helping with home tasks";
}

function normalizeResponseTimeLabel(label?: string | null): string | null {
   if (!label) return null;
   const trimmed = label.trim();
   if (!trimmed) return null;
   const lowered = trimmed.toLowerCase();
   if (lowered === "n/a" || lowered === "na" || lowered === "not available") return null;
   return trimmed;
}

export default PublicProfile;
