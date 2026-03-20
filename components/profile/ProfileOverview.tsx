"use client";

/**
 * Profile Overview Section - Complete Mobile Responsive
 * Summary view of account status, stats, and quick actions
 */

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Star,
   CheckCircle2,
   AlertCircle,
   Clock,
   ArrowRight,
   Shield,
   Briefcase,
   MapPin,
   Award,
   Share2,
   Plus,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { ProfileSection } from "@/types/profile";
import { ShareModal } from "@/components/shared/ShareModal";
import { toast } from "sonner";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { postTaskCategories } from "@/lib/data/categories";

interface ProfileOverviewProps {
   user: UserProfile;
   onNavigate: (section: ProfileSection) => void;
   loading?: boolean;
}

export function ProfileOverview({ user, onNavigate, loading }: ProfileOverviewProps) {
   const [shareOpen, setShareOpen] = useState(false);
   const [skillsModalOpen, setSkillsModalOpen] = useState(false);
   const [aboutModalOpen, setAboutModalOpen] = useState(false);
   const [savingSkills, setSavingSkills] = useState(false);
   const [savingAbout, setSavingAbout] = useState(false);
   const [skillInput, setSkillInput] = useState("");
   const [skillsInputFocused, setSkillsInputFocused] = useState(false);
   const [aboutInput, setAboutInput] = useState(
      user.business?.description || user.bio || ""
   );
   const [selectedSkills, setSelectedSkills] = useState<string[]>(
      (user.skills?.list || []).map((item) => item.name).filter(Boolean)
   );

   const avatarSrc = React.useMemo(() => {
      if (!user.photoURL) return undefined;
      const rawVersion = user.updatedAt ? new Date(user.updatedAt).getTime() : Date.now();
      const separator = user.photoURL.includes("?") ? "&" : "?";
      return `${user.photoURL}${separator}v=${rawVersion}`;
   }, [user.photoURL, user.updatedAt]);

   const suggestedSkills = useMemo(() => {
      const query = skillInput.trim().toLowerCase();
      return postTaskCategories
         .map((item) => item.label)
         .filter((name) => {
            if (!query) return false;
            return name.toLowerCase().includes(query);
         })
         .filter(
            (name) =>
               !selectedSkills.some(
                  (selected) => selected.toLowerCase() === name.toLowerCase()
               )
         )
         .slice(0, 8);
   }, [selectedSkills, skillInput]);

   const handleSkillsModalOpenChange = (open: boolean) => {
      setSkillsModalOpen(open);
      if (open) {
         setSelectedSkills(
            (user.skills?.list || []).map((item) => item.name).filter(Boolean)
         );
      } else {
         setSkillInput("");
         setSkillsInputFocused(false);
      }
   };

   // Generate the public profile URL
   const getProfileUrl = () => {
      if (typeof window !== "undefined") {
         const userId = user.uid || user._id;
         return `${window.location.origin}/profile/${userId}`;
      }
      return "";
   };

   const handleShare = async () => {
      const url = getProfileUrl();

      if (navigator.share) {
         try {
            await navigator.share({
               title: `${user.name}'s Profile on ExtraHand`,
               text: `Check out ${user.name}'s profile on ExtraHand`,
               url: url,
            });
         } catch (err) {
            console.log("Share cancelled");
         }
      } else {
         setShareOpen(true);
      }
   };

   const completionPercentage = calculateCompletionPercentage(user);
   const verificationItems = getVerificationStatus(user);
   const verifiedCount = verificationItems.filter(
      (v) => v.status === "verified"
   ).length;

   if (loading) {
      return <ProfileOverviewSkeleton />;
   }

   const hasSkills = selectedSkills.length > 0;
   const hasAbout = aboutInput.trim().length > 0;
   const aadhaarDone = Boolean(user.isAadhaarVerified);
   const hasPhoto = Boolean(user.photoURL);
   const hasPendingSetup = !hasSkills || !hasAbout || !aadhaarDone || !hasPhoto;

   const addSkill = (skillName: string) => {
      const clean = skillName.trim();
      if (!clean) return;
      if (selectedSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
         setSkillInput("");
         return;
      }
      setSelectedSkills((prev) => [...prev, clean]);
      setSkillInput("");
   };

   const removeSkill = (skillName: string) => {
      setSelectedSkills((prev) => prev.filter((s) => s !== skillName));
   };

   const saveSkills = async () => {
      const pendingInput = skillInput.trim();
      const normalizedSkills =
         pendingInput.length > 0 &&
         !selectedSkills.some(
            (skill) => skill.toLowerCase() === pendingInput.toLowerCase()
         )
            ? [...selectedSkills, pendingInput]
            : selectedSkills;

      if (normalizedSkills.length === 0) {
         toast.error("Please add at least one skill");
         return;
      }

      setSavingSkills(true);
      try {
         await profilesApi.upsertProfile({
            skills: {
               list: normalizedSkills.map((name) => ({ name })),
            },
         });

         setSelectedSkills(normalizedSkills);
         setSkillInput("");
         toast.success("Skills saved successfully");
         setSkillsModalOpen(false);
      } catch (error) {
         console.error("Failed to save skills", error);
         toast.error("Failed to save skills");
      } finally {
         setSavingSkills(false);
      }
   };

   const saveAbout = async () => {
      if (!aboutInput.trim()) {
         toast.error("Please add about you");
         return;
      }

      setSavingAbout(true);
      try {
         await profilesApi.upsertProfile({
            bio: aboutInput.trim(),
            business: { description: aboutInput.trim() },
         });
         toast.success("About you saved successfully");
         setAboutModalOpen(false);
      } catch (error) {
         console.error("Failed to save about", error);
         toast.error("Failed to save about you");
      } finally {
         setSavingAbout(false);
      }
   };

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header Card */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
               <Avatar className="w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                  <AvatarImage
                     src={avatarSrc}
                     alt={user.name}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg sm:text-xl font-medium">
                     {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
               </Avatar>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                        {user.name}
                     </h1>
                     {user.verificationBadge &&
                        user.verificationBadge !== "none" && (
                           <Badge
                              variant="secondary"
                              className={cn(
                                 "capitalize text-[10px] sm:text-xs shrink-0",
                                 user.verificationBadge === "trusted" &&
                                    "bg-green-100 text-green-700",
                                 user.verificationBadge === "verified" &&
                                    "bg-blue-100 text-blue-700",
                                 user.verificationBadge === "basic" &&
                                    "bg-gray-100 text-gray-700"
                              )}
                           >
                              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                              {user.verificationBadge}
                           </Badge>
                        )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500 flex-wrap">
                     {user.location?.city && (
                        <span className="flex items-center gap-1">
                           <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                           {user.location.city}
                        </span>
                     )}
                     <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {user.roles?.includes("tasker") &&
                        user.roles?.includes("poster")
                           ? "Tasker & Poster"
                           : user.roles?.includes("tasker")
                           ? "Tasker"
                           : "Poster"}
                     </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("public-profile")}
                        className="text-xs h-8 px-3"
                     >
                        View Profile
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("edit-profile")}
                        className="text-xs h-8 px-3"
                     >
                        Edit
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="text-xs h-8 px-3"
                     >
                        <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                        <span className="hidden sm:inline">Share</span>
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Profile Setup Actions */}
         {hasPendingSetup && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-4">
               <h3 className="text-sm sm:text-base font-semibold text-gray-900">Profile Setup</h3>

               {!hasSkills && (
                  <SetupItem
                     title="Skills"
                     description="Add skills to get matched with relevant tasks"
                     cta="Add skills"
                     onClick={() => setSkillsModalOpen(true)}
                  />
               )}

               {!aadhaarDone && (
                  <SetupItem
                     title="Aadhar Verification"
                     description="Verify your identity to apply for tasks and build trust with clients"
                     cta="Verify now"
                     onClick={() => {
                        if (typeof window !== "undefined") {
                           window.location.href = "/profile/verify/aadhaar";
                        }
                     }}
                  />
               )}

               {!hasPhoto && (
                  <SetupItem
                     title="Profile Photo"
                     description="Upload your profile photo to build trust and get more responses"
                     cta="Upload now"
                     onClick={() => onNavigate("edit-profile")}
                  />
               )}

               {!hasAbout && (
                  <SetupItem
                     title="About you"
                     description="Tell clients what you can do and why they should choose you"
                     cta="Add about you"
                     onClick={() => setAboutModalOpen(true)}
                  />
               )}
            </div>
         )}

         {/* Stats Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
               label="Rating"
               value={user.rating?.toFixed(1) || "0.0"}
               icon={<Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />}
               subtext={`${user.totalReviews || 0} reviews`}
            />
            <StatCard
               label="Completed"
               value={String(user.completedTasks || 0)}
               icon={
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
            />
            <StatCard
               label="Total"
               value={String(user.totalTasks || 0)}
               icon={
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
            />
            <StatCard
               label="Verified"
               value={`${verifiedCount}/${verificationItems.length}`}
               icon={
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
               onClick={() => onNavigate("verifications")}
            />
         </div>

         {/* Quick Actions */}
         <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
               <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  Quick Actions
               </h3>
            </div>
            <div className="divide-y divide-gray-100">
               <QuickActionItem
                  icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Complete Verifications"
                  description={
                     verifiedCount === verificationItems.length
                        ? "All verifications complete"
                        : `${verificationItems.length - verifiedCount} pending`
                  }
                  status={
                     verifiedCount === verificationItems.length
                        ? "complete"
                        : "pending"
                  }
                  onClick={() => onNavigate("verifications")}
               />
               <QuickActionItem
                  icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="View Badges"
                  description="Check your reputation and badges"
                  onClick={() => onNavigate("badges")}
               />
               <QuickActionItem
                  icon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Update Preferences"
                  description="Set your task categories and availability"
                  onClick={() => onNavigate("preferences")}
               />
               <QuickActionItem
                  icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Review Notifications"
                  description="Manage your communication settings"
                  onClick={() => onNavigate("notifications")}
               />
            </div>
         </div>

         {/* Account Status */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-4">
               Account Status
            </h3>
            <div className="space-y-3">
               <StatusRow
                  label="Account Status"
                  value="Active"
                  status="success"
               />
               <StatusRow
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                  status="neutral"
               />
               <StatusRow
                  label="Last Updated"
                  value={formatDate(user.updatedAt)}
                  status="neutral"
               />
            </div>
         </div>

         {/* Share Modal */}
         <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title="Profile"
            description={`Share ${user.name}'s profile`}
            url={getProfileUrl()}
            shareText={`Check out ${user.name}'s profile on ExtraHand!`}
         />

         {/* Skills Modal */}
         <Dialog open={skillsModalOpen} onOpenChange={handleSkillsModalOpenChange}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>Choose your skills to start earning</DialogTitle>
               </DialogHeader>

               <div className="space-y-4">
                  <div>
                     <Input
                        value={skillInput}
                        placeholder="Type a skill"
                        onChange={(e) => setSkillInput(e.target.value)}
                        onFocus={() => setSkillsInputFocused(true)}
                        onBlur={() => {
                           setTimeout(() => setSkillsInputFocused(false), 120);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill(skillInput);
                           }
                        }}
                     />
                     {skillsInputFocused && skillInput.trim().length > 0 && suggestedSkills.length > 0 && (
                        <div className="mt-2 rounded-md border border-gray-200 bg-white max-h-44 overflow-auto">
                           {suggestedSkills.map((skill) => (
                              <button
                                 key={skill}
                                 type="button"
                                 className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                 onPointerDown={(e) => {
                                    e.preventDefault();
                                    addSkill(skill);
                                 }}
                              >
                                 {skill}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                     {selectedSkills.map((skill) => (
                        <span
                           key={skill}
                           className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700"
                        >
                           {skill}
                           <button
                              type="button"
                              className="text-primary-700 hover:text-primary-900"
                              onClick={() => removeSkill(skill)}
                           >
                              ×
                           </button>
                        </span>
                     ))}
                  </div>

                  <div className="flex justify-end">
                     <Button
                        onClick={saveSkills}
                        disabled={savingSkills}
                        style={{
                           backgroundColor: "#f9b233",
                           color: "#222",
                        }}
                     >
                        {savingSkills ? "Saving..." : "Save"}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         {/* About You Modal */}
         <Dialog open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
            <DialogContent className="max-w-xl">
               <DialogHeader>
                  <DialogTitle>About you</DialogTitle>
               </DialogHeader>

               <div className="space-y-4">
                  <Textarea
                     value={aboutInput}
                     placeholder="Tell clients what you can do and why they should choose you"
                     rows={6}
                     onChange={(e) => setAboutInput(e.target.value)}
                  />

                  <div className="flex justify-end">
                     <Button
                        onClick={saveAbout}
                        disabled={savingAbout}
                        style={{
                           backgroundColor: "#f9b233",
                           color: "#222",
                        }}
                     >
                        {savingAbout ? "Saving..." : "Save"}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}

interface SetupItemProps {
   title: string;
   description: string;
   valuePreview?: string;
   cta: string;
   onClick: () => void;
}

function SetupItem({ title, description, valuePreview, cta, onClick }: SetupItemProps) {
   return (
      <div className="rounded-lg border border-gray-100 p-3 sm:p-4">
         <div className="flex items-start justify-between gap-3">
            <div>
               <p className="text-sm sm:text-base font-semibold text-gray-900">{title}</p>
               <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
               {valuePreview && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{valuePreview}</p>
               )}
            </div>
            <button
               type="button"
               onClick={onClick}
               className="shrink-0 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700"
            >
               {cta}
            </button>
         </div>
      </div>
   );
}

// Lightweight skeleton for initial profile load
function ProfileOverviewSkeleton() {
   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header skeleton */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 animate-pulse" />
               <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 sm:h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-2 mt-3">
                     <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                     <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                     <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
               </div>
            </div>
         </div>

         {/* Profile completion skeleton */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
               <div className="space-y-1">
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-40 bg-gray-100 rounded animate-pulse" />
               </div>
               <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-gray-100 rounded animate-pulse" />
         </div>

         {/* Stats grid skeleton */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
               <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 space-y-2"
               >
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
               </div>
            ))}
         </div>
      </div>
   );
}

// Helper Components
interface StatCardProps {
   label: string;
   value: string;
   icon: React.ReactNode;
   subtext?: string;
   onClick?: () => void;
}

function StatCard({ label, value, icon, subtext, onClick }: StatCardProps) {
   const Component = onClick ? "button" : "div";
   return (
      <Component
         onClick={onClick}
         className={cn(
            "bg-white rounded-lg border border-gray-200 p-3 sm:p-4",
            onClick &&
               "hover:border-gray-300 transition-colors cursor-pointer text-left"
         )}
      >
         <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            {icon}
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
               {label}
            </span>
         </div>
         <p className="text-lg sm:text-2xl font-semibold text-gray-900">
            {value}
         </p>
         {subtext && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
               {subtext}
            </p>
         )}
      </Component>
   );
}

interface QuickActionItemProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   status?: "complete" | "pending" | "warning";
   onClick: () => void;
}

function QuickActionItem({
   icon,
   title,
   description,
   status,
   onClick,
}: QuickActionItemProps) {
   return (
      <button
         onClick={onClick}
         className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
         <span className="text-gray-400 shrink-0">{icon}</span>
         <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
               {title}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
               {description}
            </p>
         </div>
         {status === "complete" && (
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
         )}
         {status === "pending" && (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
         )}
         <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
      </button>
   );
}

interface StatusRowProps {
   label: string;
   value: string;
   status: "success" | "warning" | "error" | "neutral";
}

function StatusRow({ label, value, status }: StatusRowProps) {
   return (
      <div className="flex items-center justify-between">
         <span className="text-xs sm:text-sm text-gray-500">{label}</span>
         <span
            className={cn(
               "text-xs sm:text-sm font-medium",
               status === "success" && "text-green-600",
               status === "warning" && "text-amber-600",
               status === "error" && "text-red-600",
               status === "neutral" && "text-gray-900"
            )}
         >
            {value}
         </span>
      </div>
   );
}

// Helper functions
function calculateCompletionPercentage(user: UserProfile): number {
   const fields = {
      name: !!user.name,
      email: !!user.email,
      phone: !!user.phone,
      location: !!user.location,
      roles: !!user.roles && user.roles.length > 0,
      skills: !!user.skills && user.skills.list && user.skills.list.length > 0,
   };

   const completedFields = Object.values(fields).filter(Boolean).length;
   return Math.round((completedFields / Object.keys(fields).length) * 100);
}

function getVerificationStatus(user: UserProfile) {
   return [
      { type: "phone", status: user.phone ? "verified" : "not_started" },
      { type: "email", status: user.email ? "verified" : "not_started" },
      {
         type: "aadhaar",
         status: user.isAadhaarVerified ? "verified" : "not_started",
      },
   ];
}

function formatDate(date?: Date | string): string {
   if (!date) return "N/A";
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
}

export default ProfileOverview;
