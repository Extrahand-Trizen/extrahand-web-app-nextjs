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
import { ArrowLeft, MessageCircle, Flag } from "lucide-react";
import { UserProfile } from "@/types/user";
import Link from "next/link";

export default function UserProfilePage() {
   const router = useRouter();
   const params = useParams();
   const userId = params.id as string;

   const [user, setUser] = useState<UserProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function fetchUser() {
         try {
            setLoading(true);
            // Mock fetch - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock user data
            const mockUser: UserProfile = {
               _id: userId,
               uid: userId,
               name: "John Doe",
               email: "john@example.com",
               phone: "9876543210",
               roles: ["tasker"],
               userType: "individual",
               rating: 4.8,
               totalReviews: 23,
               totalTasks: 45,
               completedTasks: 42,
               isVerified: true,
               isAadhaarVerified: true,
               isEmailVerified: true,
               isBankVerified: true,
               isPanVerified: false,
               isPhoneVerified: true,
               isActive: true,
               verificationBadge: "verified",
               location: {
                  type: "Point",
                  coordinates: [72.8777, 19.076],
                  city: "Mumbai",
                  state: "Maharashtra",
               },
               skills: {
                  list: [
                     { name: "Cleaning", verified: true },
                     { name: "Home Repairs", verified: false },
                     { name: "Electrical", verified: true },
                  ],
               },
               business: {
                  description:
                     "Professional home services provider with 5+ years of experience. Specializing in deep cleaning, minor repairs, and electrical work.",
               },
               createdAt: new Date("2023-01-15"),
               updatedAt: new Date(),
            };

            setUser(mockUser);
         } catch (err) {
            setError("Failed to load profile");
         } finally {
            setLoading(false);
         }
      }

      if (userId) {
         fetchUser();
      }
   }, [userId]);

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
                     This user profile doesn&apos;t exist or has been removed.
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
         <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
               <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>
               <div className="flex items-center gap-2">
                     <Link href={`/chat`}>
                  <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                  </Button>
                     </Link>
                  <Button variant="ghost" size="icon" className="text-gray-400">
                     <Flag className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>

         {/* Profile Content */}
         <main className="flex-1 py-6">
            <div className="max-w-4xl mx-auto px-4">
               <PublicProfile
                  user={user}
                  isOwnProfile={false}
                  reviews={[
                     {
                        id: "1",
                        taskId: "task1",
                        taskTitle: "Deep Cleaning Service",
                        reviewerId: "user1",
                        reviewerName: "Sarah M.",
                        rating: 5,
                        comment:
                           "Excellent work! John was punctual, thorough, and very professional. My apartment has never been cleaner.",
                        createdAt: new Date("2024-11-20"),
                        role: "poster",
                     },
                     {
                        id: "2",
                        taskId: "task2",
                        taskTitle: "Electrical Repair",
                        reviewerId: "user2",
                        reviewerName: "Raj K.",
                        rating: 5,
                        comment:
                           "Fixed my electrical issue quickly and explained what was wrong. Very knowledgeable.",
                        createdAt: new Date("2024-11-15"),
                        role: "poster",
                     },
                     {
                        id: "3",
                        taskId: "task3",
                        taskTitle: "Home Cleaning",
                        reviewerId: "user3",
                        reviewerName: "Priya S.",
                        rating: 4,
                        comment: "Good service overall. Would recommend.",
                        createdAt: new Date("2024-11-10"),
                        role: "poster",
                     },
                  ]}
                  workHistory={[
                     {
                        id: "1",
                        taskId: "task1",
                        title: "Deep Cleaning Service",
                        category: "Cleaning",
                        completedAt: new Date("2024-11-20"),
                        amount: 1500,
                        rating: 5,
                        role: "tasker",
                     },
                     {
                        id: "2",
                        taskId: "task2",
                        title: "Electrical Repair",
                        category: "Home Services",
                        completedAt: new Date("2024-11-15"),
                        amount: 800,
                        rating: 5,
                        role: "tasker",
                     },
                     {
                        id: "3",
                        taskId: "task3",
                        title: "Home Cleaning",
                        category: "Cleaning",
                        completedAt: new Date("2024-11-10"),
                        amount: 1200,
                        rating: 4,
                        role: "tasker",
                     },
                  ]}
               />
            </div>
         </main>
      </div>
   );
}
