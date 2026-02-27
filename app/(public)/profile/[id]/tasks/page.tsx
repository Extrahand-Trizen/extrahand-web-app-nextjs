"use client";

/**
 * Public User Portfolio/Tasks Page
 * Display all tasks posted by a user
 * Accessible at /profile/[id]/tasks
 */

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
   ArrowLeft,
   Share2,
   MapPin,
   Star,
   Briefcase,
   CheckCircle2,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { Task } from "@/types/task";
import Link from "next/link";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { ShareModal } from "@/components/shared/ShareModal";

export default function UserPortfolioPage() {
   const router = useRouter();
   const params = useParams();
   const userId = params.id as string;
   const { userData } = useAuth();

   const [user, setUser] = useState<UserProfile | null>(null);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadingTasks, setLoadingTasks] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [shareOpen, setShareOpen] = useState(false);

   const isOwnProfile = userData?.uid === userId || userData?._id === userId;

   useEffect(() => {
      async function fetchData() {
         try {
            setLoading(true);
            setError(null);

            // Fetch user profile
            const profileData = await profilesApi.getPublicProfile(userId);
            setUser(profileData as UserProfile);

            // Fetch user's tasks (public view)
            setLoadingTasks(true);
            const tasksResponse = await tasksApi.getPublicTasks({
               requesterId: userId,
               limit: 50,
            });

            if (tasksResponse.success) {
               setTasks(tasksResponse.tasks || []);
            } else {
               setTasks([]);
            }
         } catch (err: any) {
            console.error("❌ Failed to load portfolio:", err);
            setError(err.message || "Failed to load portfolio");
            toast.error("Failed to load portfolio", {
               description: err.message || "Please try again.",
            });
         } finally {
            setLoading(false);
            setLoadingTasks(false);
         }
      }

      if (userId) {
         fetchData();
      }
   }, [userId]);

   const handleShare = async () => {
      const url = window.location.href;

      if (navigator.share) {
         try {
            await navigator.share({
               title: `${user?.name}'s Tasks Portfolio on ExtraHand`,
               text: `Check out ${user?.name}'s completed tasks on ExtraHand`,
               url: url,
            });
         } catch (err) {
            console.log("Share cancelled");
         }
      } else {
         setShareOpen(true);
      }
   };

   if (loading) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header skeleton */}
            <div className="bg-white border-b border-gray-200">
               <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
               </div>
            </div>

            {/* Content skeleton */}
            <main className="flex-1 py-8">
               <div className="max-w-7xl mx-auto px-4 space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                     <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1 space-y-2">
                           <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                           <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                           <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                     </div>
                     <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                     </div>
                  </div>
               </div>
            </main>
         </div>
      );
   }

   if (error || !user) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                     Portfolio not found
                  </h2>
                  <p className="text-gray-500 mb-4">
                     {error || "This user's portfolio doesn't exist."}
                  </p>
                  <Button onClick={() => router.back()}>Go Back</Button>
               </div>
            </div>
         </div>
      );
   }

   const completedTasks = tasks.filter(
      (task) => task.status === "completed" || task.status === "closed"
   );
   const activeTasks = tasks.filter(
      (task) => task.status === "active" || task.status === "open"
   );

   return (
      <div className="flex flex-col min-h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
               <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>
               <h1 className="text-lg font-semibold text-gray-900">
                  {user.name}'s Tasks Portfolio
               </h1>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-600"
               >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Share</span>
               </Button>
            </div>
         </div>

         {/* Main Content */}
         <main className="flex-1 py-8">
            <div className="max-w-7xl mx-auto px-4">
               {/* User Info Card */}
               <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <div className="flex items-start justify-between gap-6">
                     <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                           {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                           <h2 className="text-2xl font-bold text-gray-900">
                              {user.name}
                           </h2>
                           <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              {user.location && (
                                 <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {user.location.city || user.location.state}
                                 </div>
                              )}
                              {user.rating && (
                                 <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>
                                       {user.rating.toFixed(1)}
                                       {user.totalReviews && (
                                          <span className="text-gray-500">
                                             ({user.totalReviews})
                                          </span>
                                       )}
                                    </span>
                                 </div>
                              )}
                           </div>
                           {user.bio && (
                              <p className="mt-3 text-gray-700">{user.bio}</p>
                           )}
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                           <div className="text-2xl font-bold text-gray-900">
                              {tasks.length}
                           </div>
                           <div className="text-xs text-gray-500">
                              Total Tasks
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-bold text-green-600">
                              {completedTasks.length}
                           </div>
                           <div className="text-xs text-gray-500">
                              Completed
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-bold text-blue-600">
                              {activeTasks.length}
                           </div>
                           <div className="text-xs text-gray-500">Active</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Tasks Sections */}
               {tasks.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                     <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No tasks yet
                     </h3>
                     <p className="text-gray-500">
                        This user hasn't posted any tasks yet.
                     </p>
                  </div>
               ) : (
                  <div className="space-y-8">
                     {/* Completed Tasks */}
                     {completedTasks.length > 0 && (
                        <div>
                           <div className="flex items-center gap-2 mb-4">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Completed Tasks ({completedTasks.length})
                              </h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {completedTasks.map((task) => (
                                 <TaskCard
                                    key={task._id}
                                    task={task}
                                    userName={user.name}
                                 />
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Active Tasks */}
                     {activeTasks.length > 0 && (
                        <div>
                           <div className="flex items-center gap-2 mb-4">
                              <Briefcase className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Active Tasks ({activeTasks.length})
                              </h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {activeTasks.map((task) => (
                                 <TaskCard
                                    key={task._id}
                                    task={task}
                                    userName={user.name}
                                 />
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </main>

         {/* Share Modal */}
         <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title="Tasks Portfolio"
            description={`Share ${user.name}'s task portfolio`}
            url={typeof window !== "undefined" ? window.location.href : ""}
            shareText={`Check out ${user.name}'s tasks portfolio on ExtraHand!`}
         />
      </div>
   );
}

interface TaskCardProps {
   task: Task;
   userName: string;
}

function TaskCard({ task, userName }: TaskCardProps) {
   const [shareOpen, setShareOpen] = useState(false);

   const handleShareTask = () => {
      setShareOpen(true);
   };

   return (
      <>
         <Link href={`/tasks/${task._id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer h-full group">
               {/* Header */}
               <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                     {task.title}
                  </h4>
                  <button
                     onClick={(e) => {
                        e.preventDefault();
                        handleShareTask();
                     }}
                     className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  >
                     <Share2 className="w-4 h-4" />
                  </button>
               </div>

               {/* Category & Budget */}
               <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                     {task.category}
                  </span>
                  {task.budget && (
                     <span className="text-gray-600 font-semibold">
                        ₹{task.budget.toLocaleString()}
                     </span>
                  )}
               </div>

               {/* Description */}
               <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {task.description}
               </p>

               {/* Location */}
               {task.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                     <MapPin className="w-3 h-3" />
                     {task.location.city || task.location}
                  </div>
               )}

               {/* Status Badge */}
               <div className="flex items-center gap-2">
                  <span
                     className={`text-xs font-medium px-2 py-1 rounded ${
                        task.status === "completed" ||
                        task.status === "closed"
                           ? "bg-green-50 text-green-700"
                           : "bg-yellow-50 text-yellow-700"
                     }`}
                  >
                     {task.status === "completed" || task.status === "closed"
                        ? "Completed"
                        : "Active"}
                  </span>
               </div>
            </div>
         </Link>

         {/* Share Modal */}
         <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title="Task"
            description={task.title}
            url={`${typeof window !== "undefined" ? window.location.origin : ""}/tasks/${task._id}`}
            shareText={`Check out this task: "${task.title}" posted by ${userName} on ExtraHand!`}
         />
      </>
   );
}
