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

type PrivacyState = "registered_users" | "connections_only" | null;

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
   const [privacyState, setPrivacyState] = useState<PrivacyState>(null);

   const isOwnProfile = userData?.uid === userId || userData?._id === userId;

   useEffect(() => {
      async function fetchUser() {
         try {
            setLoading(true);
            setError(null);
            setErrorTitle("Profile not found");
            setPrivacyState(null);

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
            const isPrivateProfile =
               err?.status === 403 && err?.data?.code === "PROFILE_PRIVATE";

            if (isPrivateProfile) {
               // Use visibility field from backend to show appropriate message
               const visibility = (err?.data?.visibility ?? "registered_users") as PrivacyState;
               setErrorTitle("Private account");
               // Strip any residual prefix from client wrapper
               const rawMsg: string = err?.data?.message ?? err?.message ?? "This profile is private.";
               setError(rawMsg.replace(/^Public API call failed:\s*/i, ""));
               setPrivacyState(visibility);
               return;  // ← no toast; the privacy screen handles the UI
            }

            // Fallback: detect privacy by message content (e.g. old gateway path)
            const rawMsg: string = err?.data?.message ?? err?.message ?? "";
            const cleanMsg = rawMsg.replace(/^Public API call failed:\s*/i, "");
            const looksPrivate = /private|log in|registered/i.test(cleanMsg);

            if (looksPrivate) {
               setErrorTitle("Private account");
               setError(cleanMsg);
               setPrivacyState("registered_users");
               return;  // ← no toast for this case either
            }

            const errorMessage = cleanMsg || "Failed to load profile";
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
         console.log("📦 Using reviews from profile response:", (user as any).reviews.length);
         const profileReviews = (user as any).reviews;

         const mappedReviews: Review[] = profileReviews
            .filter(
               (review: any) =>
                  review.reviewerName &&
                  review.reviewerName.trim() !== "" &&
                  review.rating > 0 &&
                  review.taskTitle
            )
            .map((review: any) => ({
               id: review._id,
               taskId: review.taskId,
               taskTitle: review.taskTitle || review.title || "Task",
               reviewerId: review.reviewerId || review.reviewerUid,
               reviewerName: review.reviewerName,
               reviewerPhoto: review.reviewerPhoto,
               rating: review.rating,
               comment: review.comment || "",
               createdAt: new Date(review.createdAt),
               role: "poster" as const,
            }));

         setReviews(mappedReviews);
         setLoadingReviews(false);
      } else {
         console.log("ℹ️ No reviews in profile response");
         setReviews([]);
         setLoadingReviews(false);
      }

      if (user && (user as any).workHistory) {
         console.log("📦 Using work history from profile response:", (user as any).workHistory.length);
         const profileWorkHistory = (user as any).workHistory;

         const mappedWorkHistory: WorkHistoryItem[] = profileWorkHistory
            .filter((item: any) => item.title && item.title.trim() !== "" && item.completedAt)
            .map((item: any) => ({
               id: item._id,
               taskTitle: item.title,
               category: item.category,
               completedDate: new Date(item.completedAt),
               earnings: item.budget,
            }));

         setWorkHistory(mappedWorkHistory);
      } else {
         console.log("ℹ️ No work history in profile response");
         setWorkHistory([]);
      }
   }, [user]);

   // ─── Loading skeleton ────────────────────────────────────────────────────
   if (loading) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
               <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
               </div>
            </div>
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

   // ─── Private: registered users only (not logged in) ─────────────────────
   if (privacyState === "registered_users") {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center px-4">
               <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                     <svg
                        className="w-8 h-8 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                     </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                     This account is private
                  </h2>
                  <p className="text-gray-500 mb-6">
                     Log in to view this profile. Only registered users can see this profile.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                     <Button
                        onClick={() => {
                           // Store current profile URL so login redirects back here
                           try {
                              sessionStorage.setItem(
                                 "postAuthRedirectTo",
                                 window.location.pathname + window.location.search
                              );
                           } catch (_) {}
                           router.push("/login");
                        }}
                     >
                        Log in to view
                     </Button>
                     <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // ─── Private: connections only ───────────────────────────────────────────
   if (privacyState === "connections_only") {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center px-4">
               <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                     <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                     </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                     This account is private
                  </h2>
                  <p className="text-gray-500 mb-6">
                     You can only view this profile if you have previously worked with this person.
                  </p>
                  <Button variant="outline" onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   // ─── Generic error / not found ───────────────────────────────────────────
   if (error || !user) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{errorTitle}</h2>
                  <p className="text-gray-500 mb-4">
                     {error || "This user profile doesn't exist or has been removed."}
                  </p>
                  <Button onClick={() => router.back()}>Go Back</Button>
               </div>
            </div>
         </div>
      );
   }

   // ─── Full profile view ───────────────────────────────────────────────────
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
                     <span className="ml-2 text-sm text-gray-500">Loading reviews...</span>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}
