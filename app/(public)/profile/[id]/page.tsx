"use client";

/**
 * Public Profile Page
 * View another user's profile (or your own public view)
 */

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PublicProfile } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Review, WorkHistoryItem } from "@/types/profile";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { buildPublicProfileHandle, parsePublicProfileHandle } from "@/lib/utils/profileHandle";


export default function UserProfilePage() {
   const router = useRouter();
   const params = useParams();
   const handle = params.id as string;
   const { userId } = parsePublicProfileHandle(handle);
   const { userData } = useAuth();

   const [user, setUser] = useState<UserProfile | null>(null);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [errorTitle, setErrorTitle] = useState<string>("Profile not found");

   const isOwnProfile = userData?.uid === userId || userData?._id === userId;

   useEffect(() => {
      async function fetchUser() {
         try {
            setLoading(true);
            setError(null);
            setErrorTitle("Profile not found");

            // Fetch user profile (public access, no auth required)
            console.log("🔍 Fetching public profile for user:", userId);
            const profileData = await profilesApi.getPublicProfile(userId);
            console.log("✅ Profile fetched:", profileData);

            const loaded = profileData as UserProfile;
            setUser(loaded);

            // Redirect old UID URLs to canonical handle URL (collision-free).
            const canonicalId = loaded.uid || loaded._id;
            if (canonicalId && handle === canonicalId) {
               const canonicalHandle = buildPublicProfileHandle(loaded.name, canonicalId);
               router.replace(`/profile/${canonicalHandle}`);
            }
         } catch (err: any) {
            console.error("❌ Failed to load profile:", err);
            const errorMessage =
               err?.data?.message ||
               err?.message ||
               "Failed to load profile";
            const messageLower = String(errorMessage).toLowerCase();
            const isPrivateProfile =
               err?.status === 403 ||
               err?.data?.code === "PROFILE_PRIVATE" ||
               messageLower.includes("profile is private") ||
               messageLower.includes("visible only to");

            if (isPrivateProfile) {
               setErrorTitle("Private account");
               setError(errorMessage);
               return;
            }

            setError(errorMessage);
            toast.error("Failed to load profile", {
               description: errorMessage || "This user profile may not exist.",
            });
         } finally {
            setLoading(false);
         }
      }

      if (userId) {
         fetchUser();
      }
   }, [userId, handle, router]);

   // Extract reviews from profile response (already included by backend)
   useEffect(() => {
      if (user && (user as any).reviews) {
         console.log('📦 Using reviews from profile response:', (user as any).reviews.length);
         const profileReviews = (user as any).reviews;

         // Map to Review format with safe fallbacks so we still show valid ratings.
         const mappedReviews: Review[] = profileReviews
            .filter((review: any) => Number(review?.rating) > 0)
            .map((review: any, index: number) => ({
               id:
                  review._id ||
                  review.id ||
                  `${review.taskId || review.reviewerId || "review"}-${index}`,
               taskId: review.taskId || "",
               taskTitle: review.taskTitle || review.title || "Task",
               reviewerId:
                  review.reviewerId ||
                  review.reviewerUid ||
                  review.reviewer?.id ||
                  "unknown",
               reviewerName:
                  (typeof review.reviewerName === "string" && review.reviewerName.trim()) ||
                  (typeof review.reviewer?.name === "string" && review.reviewer.name.trim()) ||
                  "Verified user",
               reviewerPhoto:
                  review.reviewerPhoto ||
                  review.reviewer?.photoURL ||
                  review.reviewer?.photo,
               rating: Number(review.rating) || 0,
               comment: typeof review.comment === "string" ? review.comment : "",
               createdAt: new Date(review.createdAt || review.updatedAt || Date.now()),
               role: "poster" as const,
            }))
            .filter((review) => review.rating > 0);

         setReviews(mappedReviews);
         setLoadingReviews(false);
      } else {
         console.log('ℹ️ No reviews in profile response');
         setReviews([]);
         setLoadingReviews(false);
      }

      // Extract work history from profile response - filter out dummy/empty entries
      if (user && (user as any).workHistory) {
         console.log('📦 Using work history from profile response:', (user as any).workHistory.length);
         const profileWorkHistory = (user as any).workHistory;

         // Map to WorkHistoryItem format - filter out entries without valid data
         const mappedWorkHistory: WorkHistoryItem[] = profileWorkHistory
            .filter((item: any) => item.title && item.title.trim() !== '' && item.completedAt)
            .map((item: any) => ({
               id: item._id,
               taskTitle: item.title,
               category: item.category,
               completedDate: new Date(item.completedAt),
               earnings: item.budget,
            }));

         setWorkHistory(mappedWorkHistory);
      } else {
         console.log('ℹ️ No work history in profile response');
         setWorkHistory([]);
      }
   }, [user]);



   if (loading) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Top bar skeleton */}
            <div className="bg-white border-b border-gray-200">
               <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
               </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 py-6">
               <div className="max-w-7xl mx-auto px-4 space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex gap-4">
                     <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                     <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-3">
                     <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                     <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                     <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                     <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (error || !user) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                     {errorTitle}
                  </h2>
                  <p className="text-gray-500 mb-4">
                     {error || "This user profile doesn't exist or has been removed."}
                  </p>
                  <Button onClick={() => router.back()}>Go Back</Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-screen bg-gray-50">
         {/* Top Navigation */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
               <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>
            </div>
         </div>

         {/* Profile Content */}
         <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4">
               <PublicProfile
                  user={user}
                  isOwnProfile={isOwnProfile}
                  reviews={reviews}
                  workHistory={workHistory}
               />

               {loadingReviews && (
                  <div className="mt-4 flex items-center justify-center">
                     <LoadingSpinner size="sm" />
                     <span className="ml-2 text-sm text-gray-500">
                        Loading reviews...
                     </span>
                  </div>
               )}
            </div>
         </main>

      </div>
   );
}
