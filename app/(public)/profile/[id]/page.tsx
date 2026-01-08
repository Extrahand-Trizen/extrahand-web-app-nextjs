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
import { ArrowLeft, MessageCircle, Flag, Share2 } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Review, WorkHistoryItem } from "@/types/profile";
import Link from "next/link";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { reviewsApi } from "@/lib/api/endpoints/reviews";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

export default function UserProfilePage() {
   const router = useRouter();
   const params = useParams();
   const userId = params.id as string;
   const { userData } = useAuth();

   const [user, setUser] = useState<UserProfile | null>(null);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [error, setError] = useState<string | null>(null);
   
   const isOwnProfile = userData?.uid === userId || userData?._id === userId;

   useEffect(() => {
      async function fetchUser() {
         try {
            setLoading(true);
            setError(null);

            // Fetch user profile (public access, no auth required)
            console.log("🔍 Fetching public profile for user:", userId);
            const profileData = await profilesApi.getPublicProfile(userId);
            console.log("✅ Profile fetched:", profileData);
            
            setUser(profileData as UserProfile);
         } catch (err: any) {
            console.error("❌ Failed to load profile:", err);
            setError(err.message || "Failed to load profile");
            toast.error("Failed to load profile", {
               description: err.message || "This user profile may not exist.",
            });
         } finally {
            setLoading(false);
         }
      }

      if (userId) {
         fetchUser();
      }
   }, [userId]);

   // Extract reviews from profile response (already included by backend)
   useEffect(() => {
      if (user && (user as any).reviews) {
         console.log('📦 Using reviews from profile response:', (user as any).reviews.length);
         const profileReviews = (user as any).reviews;
         
         // Map to Review format if needed
         const mappedReviews: Review[] = profileReviews.map((review: any) => ({
            id: review._id,
            taskId: review.taskId,
            taskTitle: review.taskTitle || review.title || "Task",
            reviewerId: review.reviewerId || review.reviewerUid,
            reviewerName: review.reviewerName || "User",
            reviewerPhoto: review.reviewerPhoto,
            rating: review.rating,
            comment: review.comment || "",
            createdAt: new Date(review.createdAt),
            role: "poster" as const,
         }));
         
         setReviews(mappedReviews);
         setLoadingReviews(false);
      } else {
         console.log('ℹ️ No reviews in profile response');
         setReviews([]);
         setLoadingReviews(false);
      }
      
      // Extract work history from profile response
      if (user && (user as any).workHistory) {
         console.log('📦 Using work history from profile response:', (user as any).workHistory.length);
         const profileWorkHistory = (user as any).workHistory;
         
         // Map to WorkHistoryItem format
         const mappedWorkHistory: WorkHistoryItem[] = profileWorkHistory.map((item: any) => ({
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

   const handleShare = async () => {
      const url = window.location.href;
      
      if (navigator.share) {
         try {
            await navigator.share({
               title: `${user?.name}'s Profile on ExtraHand`,
               text: `Check out ${user?.name}'s profile on ExtraHand`,
               url: url,
            });
         } catch (err) {
            console.log("Share cancelled");
         }
      } else {
         // Fallback: Copy to clipboard
         try {
            await navigator.clipboard.writeText(url);
            toast.success("Profile link copied to clipboard!");
         } catch (err) {
            toast.error("Failed to copy link");
         }
      }
   };

   if (loading) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center">
               <LoadingSpinner size="lg" />
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
                     Profile not found
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
         {/* Top Bar with Actions */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
               <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>
               <div className="flex items-center gap-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleShare}
                     className="text-gray-600"
                  >
                     <Share2 className="w-4 h-4" />
                     <span className="hidden md:inline ml-2">Share</span>
                  </Button>
                  {!isOwnProfile && (
                     <>
                        <Link href={`/chat`}>
                           <Button variant="default" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                           </Button>
                        </Link>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="text-gray-400 hover:text-red-600"
                        >
                           <Flag className="w-4 h-4" />
                        </Button>
                     </>
                  )}
                  {isOwnProfile && (
                     <Link href="/profile?section=edit-profile">
                        <Button variant="outline" size="sm">
                           Edit Profile
                        </Button>
                     </Link>
                  )}
               </div>
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
