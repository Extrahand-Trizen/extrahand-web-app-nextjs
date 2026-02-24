/**
 * Public Profile View
 * What others see when viewing a user's profile
 */

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Star,
   Shield,
   MapPin,
   Calendar,
   CheckCircle2,
   Briefcase,
   ThumbsUp,
   Award,
   TrendingUp,
   Clock,
   Building2,
   Zap,
   Target,
   MessageCircle,
   BadgeCheck,
   Coins,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { Review, WorkHistoryItem } from "@/types/profile";
import {
   generateAchievements,
   getAvailabilityInfo,
   type Achievement,
} from "@/lib/utils/profileMetrics";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { getUserBadge } from "@/lib/api/badge";
import { UserBadge } from "@/components/ui/user-badge";

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
            const uid = user.uid;
            if (!uid) return;

            console.log("🎖️ Fetching badge for user:", uid);
            const badgeData = await getUserBadge(uid);
            console.log("✅ Badge fetched:", badgeData);
            setBadge(badgeData);
         } catch (error: any) {
            console.warn("⚠️ Failed to fetch badge:", error.message);
         }
      }

      fetchBadge();
   }, [user.uid]);

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

   const successRate = actualStats.totalTasks > 0
      ? Math.round((actualStats.completedTasks / actualStats.totalTasks) * 100)
      : 0;

   // On-time rate: only show when backend provides it; avoid dummy 95%
   const onTimeRate = (stats as any)?.onTimeRate ?? null;

   const achievements = generateAchievements(user);
   const availability = getAvailabilityInfo(user);

   return (
      <div className="max-w-7xl mx-auto space-y-6">
         {/* Profile Header */}
         <Card>
            <CardContent className="p-6">
               <div className="flex items-start gap-5">
                  <div className="relative">
                     <Avatar className="md:w-24 md:h-24 w-20 h-20 shrink-0">
                        <AvatarImage
                           src={user.photoURL || undefined}
                           alt={user.name}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-medium">
                           {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                     </Avatar>
                     {availability.isAvailable && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                           {user.name}
                        </h1>
                        {/* Badge Display */}
                        {badge && (
                           <UserBadge 
                              badge={badge.currentBadge as any} 
                              size="md" 
                              showLabel 
                              clickable 
                           />
                        )}
                        {user.verificationBadge &&
                           user.verificationBadge !== "none" && (
                              <Badge
                                 variant="secondary"
                                 className={cn(
                                    "capitalize text-xs",
                                    user.verificationBadge === "verified" &&
                                    "bg-green-100 text-green-700",
                                    user.verificationBadge === "trusted" &&
                                    "bg-blue-100 text-blue-700",
                                    user.verificationBadge === "basic" &&
                                    "bg-gray-100 text-gray-700"
                                 )}
                              >
                                 <Shield className="size-3 mr-1" />
                                 {user.verificationBadge}
                              </Badge>
                           )}
                        {availability.isAvailable && (
                           <Badge variant="outline" className="text-green-600 border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
                              Available
                           </Badge>
                        )}
                     </div>

                     {/* Rating and Reviews - use actualStats so header matches stat cards and breakdown */}
                     <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                           <Star className="size-5 text-amber-400 fill-amber-400" />
                           <span className="text-base font-semibold text-gray-900">
                              {actualStats.rating != null && actualStats.rating > 0
                                 ? actualStats.rating.toFixed(1)
                                 : "0.0"}
                           </span>
                           <span className="text-sm text-gray-500">
                              ({actualStats.totalReviews ?? 0} reviews)
                           </span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-sm text-gray-600">
                           <strong>{actualStats.completedTasks ?? 0}</strong> tasks completed
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                           <Clock className="size-4" />
                           {availability.responseTime}
                        </div>
                     </div>

                     {/* Location */}
                     {user.location?.city && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                           <MapPin className="size-4" />
                           <span>
                              {user.location.city}
                              {user.location.state
                                 ? `, ${user.location.state}`
                                 : ""}
                           </span>
                        </div>
                     )}

                     {/* Member Since - avoid showing future dates (backend/seed bug) */}
                     <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                        <Calendar className="size-4" />
                        <span>Member since {formatMemberSince(user.createdAt)}</span>
                     </div>

                     {/* User Type Badge */}
                     {user.userType === "business" && user.business?.name && (
                        <Badge variant="outline" className="mt-2">
                           <Building2 className="size-3 mr-1" />
                           {user.business.name}
                        </Badge>
                     )}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* About / Bio Section */}
         {(user.bio || user.business?.description) && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">About</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                     {user.bio || user.business?.description}
                  </p>
               </CardContent>
            </Card>
         )}

         {/* Business Profile Section (if business user) */}
         {user.userType === "business" && user.business && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                     <Building2 className="size-5" />
                     Business Information
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {user.business.name && (
                        <div>
                           <p className="text-xs text-gray-500 mb-1">Business Name</p>
                           <p className="text-sm font-medium">{user.business.name}</p>
                        </div>
                     )}
                     {user.business.description && (
                        <div className="md:col-span-2">
                           <p className="text-xs text-gray-500 mb-1">Description</p>
                           <p className="text-sm">{user.business.description}</p>
                        </div>
                     )}
                     {user.business.verificationStatus && (
                        <div className="md:col-span-2">
                           <p className="text-xs text-gray-500 mb-2">Business Trust Level</p>
                           <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                 <div
                                    className={cn(
                                       "h-2 rounded-full transition-all",
                                       user.business.verificationStatus.level === 0 && "w-0 bg-gray-400",
                                       user.business.verificationStatus.level === 1 && "w-1/3 bg-blue-400",
                                       user.business.verificationStatus.level === 2 && "w-2/3 bg-blue-500",
                                       user.business.verificationStatus.level === 3 && "w-full bg-green-500"
                                    )}
                                 />
                              </div>
                              <Badge
                                 variant="secondary"
                                 className={cn(
                                    "capitalize",
                                    user.business.verificationStatus.level === 3 && "bg-green-100 text-green-700",
                                    user.business.verificationStatus.level === 2 && "bg-blue-100 text-blue-700",
                                    user.business.verificationStatus.level === 1 && "bg-gray-100 text-gray-700"
                                 )}
                              >
                                 {user.business.verificationStatus.badge || "Basic"}
                              </Badge>
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                     {user.business.pan?.isPANVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                           <CheckCircle2 className="size-3.5" />
                           PAN Verified
                        </div>
                     )}
                     {user.business.isGSTVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                           <CheckCircle2 className="size-3.5" />
                           GST Verified
                        </div>
                     )}
                     {user.business.bankAccount?.isVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                           <CheckCircle2 className="size-3.5" />
                           Bank Verified
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Skills & Services */}
         {user.skills?.list && user.skills.list.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">Skills & Services</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-wrap gap-2">
                     {user.skills.list.map((skill, index) => (
                        <Badge
                           key={index}
                           variant="secondary"
                           className="bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
                        >
                           {skill.name}
                           {skill.verified && (
                              <CheckCircle2 className="w-3 h-3 ml-1.5 text-green-500" />
                           )}
                           {skill.yearsOfExperience && (
                              <span className="ml-1.5 text-xs text-gray-500">
                                 • {skill.yearsOfExperience}y
                              </span>
                           )}
                        </Badge>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Statistics Dashboard - Professional Minimal */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-slate-50/50">
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 rounded-full bg-white shadow-sm mb-3">
                     <Target className="size-5 text-slate-700" />
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">{completionRate}%</div>
                  <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">Completion</div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50/50">
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 rounded-full bg-white shadow-sm mb-3">
                     <Zap className="size-5 text-slate-700" />
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">
                     {onTimeRate != null && onTimeRate >= 0 ? `${onTimeRate}%` : "—"}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">On-Time</div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50/50">
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 rounded-full bg-white shadow-sm mb-3">
                     <Star className="size-5 text-slate-700 fill-slate-700" />
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">{actualStats.rating?.toFixed(1) || "0.0"}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">Avg Rating</div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50/50">
               <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 rounded-full bg-white shadow-sm mb-3">
                     <Award className="size-5 text-slate-700" />
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">{successRate}%</div>
                  <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">Success</div>
               </CardContent>
            </Card>
         </div>

         {/* Rating Breakdowns - Professional Grid - Only show if there are actual reviews */}
         {stats && (stats as any).ratingBreakdowns && actualStats.totalReviews > 0 && (
            <div className="mt-8">
               <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Performance Breakdown</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                     {actualStats.totalReviews} {actualStats.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries((stats as any).ratingBreakdowns).map(([key, value]: [string, any]) => {
                     const percentage = (value / 5) * 100;
                     const getIcon = (category: string) => {
                        switch (category) {
                           case 'communication': return MessageCircle;
                           case 'quality': return BadgeCheck;
                           case 'timeliness': return Clock;
                           case 'professionalism': return Briefcase;
                           case 'value': return Coins; // Changed to Coins for better context
                           default: return Star;
                        }
                     };
                     const Icon = getIcon(key);

                     return (
                        <div key={key} className="flex items-center gap-4 group">
                           <div className="p-2 rounded-md bg-slate-50 text-slate-600 group-hover:bg-slate-100 transition-colors">
                              <Icon className="size-4" />
                           </div>
                           <div className="flex-1 space-y-1.5">
                              <div className="flex justify-between items-center text-sm">
                                 <span className="font-medium text-slate-700 capitalize">{key}</span>
                                 <div className="flex items-center gap-1.5">
                                    <Star className="size-3 text-amber-500 fill-amber-500" />
                                    <span className="font-semibold text-slate-900">{value.toFixed(1)}</span>
                                 </div>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div
                                    className="h-full bg-slate-800 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                 />
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {/* Achievements Section */}
         {achievements.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                     <Award className="size-5" />
                     Achievements & Badges
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {achievements.map((achievement) => (
                        <AchievementBadge
                           key={achievement.id}
                           achievement={achievement}
                        />
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Verification Badges */}
         <Card>
            <CardHeader>
               <CardTitle className="text-base">Verifications</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <VerificationBadge label="Phone" verified={!!user.phone} />
                  <VerificationBadge label="Email" verified={!!user.isEmailVerified} />
                  <VerificationBadge
                     label="Identity"
                     verified={user.isAadhaarVerified}
                  />
                  {user.userType === "business" && (
                     <>
                        <VerificationBadge label="PAN" verified={user.business.pan?.isPANVerified} />
                        <VerificationBadge label="Bank" verified={user.isBankVerified} />
                        {user.business?.isGSTVerified && (
                           <VerificationBadge label="GST" verified={true} />
                        )}
                     </>
                  )}
                  {user.userType === "individual" && (
                     <VerificationBadge label="Bank" verified={user.isBankVerified} />
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Reviews Section - Only show if there are real reviews */}
         {reviews.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">
                     Reviews ({reviews.length})
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="relative">
                     <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {reviews.map((review) => (
                           <div key={review.id} className="snap-start shrink-0 w-[280px]">
                              <ReviewItem review={review} />
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Work History */}
         {workHistory.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">
                     Recent Work ({workHistory.length})
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="relative">
                     <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {workHistory.map((item) => (
                           <div key={item.id} className="snap-start shrink-0 w-[280px]">
                              <WorkHistoryItemRow item={item} />
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}

// Helper Components
interface StatCardProps {
   icon: React.ElementType;
   label: string;
   value: string;
   className?: string;
}

function StatCard({ icon: Icon, label, value, className }: StatCardProps) {
   return (
      <Card className={cn("border", className)}>
         <CardContent className="p-4 text-center">
            <Icon className="size-6 mx-auto mb-2 text-gray-600" />
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600 mt-1">{label}</p>
         </CardContent>
      </Card>
   );
}

interface AchievementBadgeProps {
   achievement: Achievement;
}

function AchievementBadge({ achievement }: AchievementBadgeProps) {
   return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3 text-center">
         <div className="text-3xl mb-1">{achievement.icon}</div>
         <p className="text-xs font-medium text-gray-900">{achievement.title}</p>
         <p className="text-[10px] text-gray-500 mt-0.5">
            {achievement.description}
         </p>
      </div>
   );
}

interface VerificationBadgeProps {
   label: string;
   verified: boolean;
}

function VerificationBadge({ label, verified }: VerificationBadgeProps) {
   return (
      <div
         className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg",
            verified ? "bg-green-50" : "bg-gray-50"
         )}
      >
         {verified ? (
            <CheckCircle2 className="size-4 text-green-500" />
         ) : (
            <div className="size-4 rounded-full border-2 border-gray-300" />
         )}
         <span
            className={cn(
               "text-sm",
               verified ? "text-green-700" : "text-gray-500"
            )}
         >
            {label}
         </span>
      </div>
   );
}

interface ReviewItemProps {
   review: Review;
}

function ReviewItem({ review }: ReviewItemProps) {
   return (
      <div className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-colors h-full">
         <div className="flex items-center gap-2 mb-2">
            <Avatar className="size-8 shrink-0">
               <AvatarImage src={review.reviewerPhoto} />
               <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-semibold">
                  {review.reviewerName.charAt(0).toUpperCase()}
               </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-semibold text-gray-900 truncate">
                  {review.reviewerName}
               </p>
               <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                     <Star
                        key={i}
                        className={cn(
                           "size-3",
                           i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                        )}
                     />
                  ))}
                  <span className="text-xs text-gray-600 ml-0.5">{review.rating}.0</span>
               </div>
            </div>
            <span className="text-[10px] text-gray-500 shrink-0">
               {formatDate(review.createdAt)}
            </span>
         </div>
         {review.comment && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
               "{review.comment}"
            </p>
         )}
         <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Briefcase className="size-3" />
            <span className="truncate">{review.taskTitle || "Task"}</span>
         </div>
      </div>
   );
}

interface WorkHistoryItemRowProps {
   item: WorkHistoryItem;
}

function WorkHistoryItemRow({ item }: WorkHistoryItemRowProps) {
   const categoryColors: Record<string, string> = {
      cleaning: "bg-blue-100 text-blue-700",
      repair: "bg-orange-100 text-orange-700",
      delivery: "bg-green-100 text-green-700",
      assembly: "bg-purple-100 text-purple-700",
      gardening: "bg-emerald-100 text-emerald-700",
      petcare: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
   };

   return (
      <div className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-colors h-full">
         <div className="flex items-start gap-2 mb-2">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
               <Briefcase className="size-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {item.taskTitle}
               </p>
            </div>
         </div>
         <div className="flex items-center justify-between gap-2 mb-1.5">
            <Badge
               variant="secondary"
               className={cn(
                  "capitalize text-[10px] px-1.5 py-0.5 h-5",
                  categoryColors[item.category] || categoryColors.other
               )}
            >
               {item.category}
            </Badge>
            {item.earnings ? (
               <span className="text-sm font-bold text-gray-900">
                  ₹{item.earnings.toLocaleString('en-IN')}
               </span>
            ) : null}
         </div>
         <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
               <Calendar className="size-3" />
               {formatDate(item.completedDate)}
            </span>
            {item.rating && (
               <span className="flex items-center gap-0.5">
                  <Star className="size-3 text-amber-400 fill-amber-400" />
                  {item.rating.toFixed(1)}
               </span>
            )}
         </div>
      </div>
   );
}

// Helper functions
function formatDate(date?: Date | string): string {
   if (!date) return "";
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
}

/** Avoid showing future "Member since" dates (e.g. bad backend/seed data). */
function formatMemberSince(date?: Date | string): string {
   if (!date) return "—";
   const d = new Date(date);
   const now = new Date();
   if (d.getTime() > now.getTime()) return "Recently";
   return formatDate(date);
}

export default PublicProfile;
