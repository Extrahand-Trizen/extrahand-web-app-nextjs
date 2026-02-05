"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProfileSection, Review, WorkHistoryItem } from "@/types/profile";
import { UserProfile } from "@/types/user";
import {
   ProfileSidebar,
   ProfileNavList,
   ProfileOverview,
   PublicProfile,
   ProfileEditForm,
   VerificationSection,
   PaymentsSection,
   AddressesSection,
   NotificationsSection,
   SecuritySection,
   PreferencesSection,
   PrivacySection,
} from "@/components/profile";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/types/consent";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { ArrowLeft, Menu } from "lucide-react";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { reviewsApi } from "@/lib/api/endpoints/reviews";
import { toast } from "sonner";
import { privacyApi } from "@/lib/api/endpoints/privacy";

const VALID_SECTIONS: ProfileSection[] = [
   "overview",
   "public-profile",
   "edit-profile",
   "preferences",
   "verifications",
   "payments",
   "addresses",
   "notifications",
   "security",
   "privacy",
];
const SECTION_TITLES: Record<ProfileSection, string> = {
   overview: "Account",
   "public-profile": "Public Profile",
   "edit-profile": "Edit Profile",
   preferences: "Preferences",
   verifications: "Verifications",
   payments: "Payments",
   addresses: "Addresses",
   notifications: "Notifications",
   security: "Security",
   privacy: "Privacy",
};

function ProfilePageContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { userData, loading: authLoading, refreshUserData, logout } = useAuth();
   
   const [user, setUser] = useState<UserProfile | null>(userData);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
   const [loadingProfile, setLoadingProfile] = useState(false);
   const [profileError, setProfileError] = useState<string | null>(null);
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const [section, setSection] = useState<ProfileSection>("overview");
   const [navOpen, setNavOpen] = useState(false);

   // Fetch profile data on mount
   useEffect(() => {
      const fetchProfileData = async () => {
         if (!userData?.uid) return;
         
         setLoadingProfile(true);
         setProfileError(null);
         try {
            const profileData = await profilesApi.me();
            setUser(profileData as UserProfile);
         } catch (error: any) {
            console.error("Failed to fetch profile:", error);
            setProfileError(error.message || "Failed to load profile data");
         } finally {
            setLoadingProfile(false);
         }
      };

      if (userData) {
         setUser(userData);
         fetchProfileData();
      }
   }, [userData, toast]);

   // Fetch reviews
   useEffect(() => {
      const fetchReviews = async () => {
         if (!user?.uid) return;
         
         setLoadingReviews(true);
         try {
            console.log("🔍 Fetching reviews for user:", user.uid);
            const response = await reviewsApi.getUserReviews(user.uid, { limit: 10 });
            
            // Check if response has reviews array
            if (!response || !response.data || !Array.isArray(response.data)) {
               console.log("No reviews found or invalid response format");
               setReviews([]);
               return;
            }
            
            // Map API reviews to profile review format
            const mappedReviews: Review[] = response.data.map((review: any) => ({
               id: review._id,
               taskId: review.taskId,
               taskTitle: review.taskTitle || "Task",
               reviewerId: review.reviewerUid,
               reviewerName: review.reviewerName || "User",
               reviewerPhoto: review.reviewerPhoto,
               rating: review.rating,
               comment: review.comment || "",
               createdAt: new Date(review.createdAt),
               role: "poster" as const, // Assuming reviews are from posters
            }));
            
            console.log("✅ Reviews loaded:", mappedReviews.length);
            setReviews(mappedReviews);
         } catch (error: any) {
            console.error("❌ Failed to fetch reviews (non-critical):", error.message || error);
            // Silently fail - reviews are not critical for profile page to work
            setReviews([]);
         } finally {
            setLoadingReviews(false);
         }
      };

      if (user?.uid) {
         fetchReviews();
      }
   }, [user?.uid]);

   // Extract work history from profile data
   useEffect(() => {
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

   useEffect(() => {
      const s = searchParams.get("section") as ProfileSection;
      if (s && VALID_SECTIONS.includes(s)) setSection(s);
   }, [searchParams]);

   useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 1024);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
   }, []);

   const goTo = useCallback((s: ProfileSection) => {
      setSection(s);
      setNavOpen(false);
      window.history.pushState({}, "", `?section=${s}`);
   }, []);

   const handleSaveProfile = async (data: Partial<UserProfile>) => {
      try {
         await profilesApi.upsertProfile(data);
         toast.success("Profile updated successfully");
         await refreshUserData();
         
         // Refresh profile data
         const updatedProfile = await profilesApi.me();
         setUser(updatedProfile as UserProfile);
      } catch (error: any) {
         console.error("Failed to update profile:", error);
         toast.error("Failed to update profile", {
            description: error.message || "Please try again later.",
         });
         throw error;
      }
   };

   const props = {
      user: user!,
      reviews,
      workHistory,
      loadingReviews,
      onNavigate: goTo,
      onSaveProfile: handleSaveProfile,
      onVerify: async (t: string) => {
         router.push(
            {
               phone: "/profile/verify/phone",
               email: "/profile/verify/email",
               aadhaar: "/profile/verify/aadhaar",
               bank: "/profile/verify/bank",
            }[t] || "/profile/verify"
         );
      },
      onSaveNotifications: async () => {
         // TODO: Implement when notification settings API is available
         toast.info("Notification settings will be saved once backend API is ready");
      },
      onSavePreferences: async () => {
         // TODO: Implement when preferences API is available
         toast.info("Preferences will be saved once backend API is ready");
      },
      onRevokeSession: async () => {
         // TODO: Implement session revocation
         toast.info("Session management feature coming soon");
      },
      onRevokeAllSessions: async () => {
         // TODO: Implement revoke all sessions
         toast.info("Session management feature coming soon");
      },
      onUpdatePrivacy: async (settings?: any) => {
         try {
            // Privacy settings are handled within PrivacySection component
            // This is called when SecuritySection saves privacy settings
            toast.success("Privacy settings updated successfully");
            await refreshUserData();
         } catch (error: any) {
            console.error("Failed to update privacy settings:", error);
            toast.error(error.message || "Failed to update privacy settings");
         }
      },
      onDeleteAccount: async (reason?: string) => {
         //Account deletion is handled within PrivacySection component
         // This is a fallback handler
         try {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
               await privacyApi.requestDeletion(true, reason);
               toast.success("Account deletion requested. You have 30 days to cancel.");
               // Logout after deletion request
               await logout();
            }
         } catch (error: any) {
            console.error("Failed to request account deletion:", error);
            toast.error(error.message || "Failed to request account deletion");
         }
      },
   };

   if (authLoading || loadingProfile || (!user && !profileError)) {
      return (
         <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   if (!user) {
      return (
         <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   if (isMobile) {
      return (
         <div className="bg-gray-50 min-h-screen">
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
               <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="border-b border-gray-200 p-4">
                     <SheetTitle className="text-left">Account</SheetTitle>
                     <p className="text-sm text-gray-500">
                        Manage your profile
                     </p>
                  </SheetHeader>
                  <ProfileNavList
                     onSectionChange={(s) => {
                        goTo(s);
                        setNavOpen(false);
                     }}
                  />
               </SheetContent>
            </Sheet>
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
               <div className="flex items-center gap-3 px-4 py-3">
                  <button
                     onClick={() =>
                        section !== "overview"
                           ? goTo("overview")
                           : setNavOpen(true)
                     }
                     className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                  >
                     {section !== "overview" ? (
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                     ) : (
                        <Menu className="w-5 h-5 text-gray-600" />
                     )}
                  </button>
                  <h1 className="text-base font-semibold text-gray-900 flex-1">
                     {SECTION_TITLES[section]}
                  </h1>
                  {section !== "overview" && (
                     <button
                        onClick={() => setNavOpen(true)}
                        className="p-2 -mr-2 hover:bg-gray-100 rounded-lg"
                     >
                        <Menu className="w-5 h-5 text-gray-600" />
                     </button>
                  )}
               </div>
            </div>
            <div className="px-4 py-6 pb-20">
               {renderSection(section, props)}
            </div>
         </div>
      );
   }

   return (
      <div className="bg-gray-50 max-w-7xl mx-auto">
         <div className="flex">
            <ProfileSidebar
               activeSection={section}
               onSectionChange={goTo}
               className="hidden lg:block sticky top-0"
            />
            <main className="flex-1 min-h-screen">
               <div className="max-w-4xl mx-auto py-8">
                  {section !== "overview" && (
                     <button
                        onClick={() => goTo("overview")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
                     >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Overview
                     </button>
                  )}
                  {renderSection(section, props)}
               </div>
            </main>
         </div>
      </div>
   );
}

export default function ProfilePage() {
   return (
      <Suspense
         fallback={
            <div className="flex items-center justify-center py-20">
               <LoadingSpinner size="lg" />
            </div>
         }
      >
         <ProfilePageContent />
      </Suspense>
   );
}

interface Props {
   user: UserProfile;
   reviews?: Review[];
   workHistory?: WorkHistoryItem[];
   loadingReviews?: boolean;
   onNavigate: (s: ProfileSection) => void;
   onSaveProfile: (data?: Partial<UserProfile>) => Promise<void>;
   onVerify: (t: string) => Promise<void>;
   onSaveNotifications: () => Promise<void>;
   onSavePreferences: () => Promise<void>;
   onRevokeSession: () => Promise<void>;
   onRevokeAllSessions: () => Promise<void>;
   onUpdatePrivacy: () => Promise<void>;
   onDeleteAccount: () => Promise<void>;
}

function renderSection(s: ProfileSection, p: Props) {
   switch (s) {
      case "overview":
         return <ProfileOverview user={p.user} onNavigate={p.onNavigate} />;
      case "public-profile":
         return (
            <PublicProfile
               user={p.user}
               isOwnProfile
               reviews={p.reviews || []}
               workHistory={p.workHistory || []}
            />
         );
      case "edit-profile":
         return (
            <ProfileEditForm
               user={p.user}
               onSave={p.onSaveProfile}
               onCancel={() => p.onNavigate("overview")}
            />
         );
      case "preferences":
         return (
            <PreferencesSection
               preferences={{
                  preferredCategories: [],
                  availability: {},
                  serviceRadius: 10,
                  language: "en",
                  currency: "INR",
                  timezone: "Asia/Kolkata",
               }}
               onSave={p.onSavePreferences}
            />
         );
      case "verifications":
         return <VerificationSection user={p.user} onVerify={p.onVerify} />;
      case "payments":
         return (
            <PaymentsSection
               onRemovePaymentMethod={console.log}
               onRemovePayoutMethod={console.log}
               onSetDefaultPayment={console.log}
               onSetDefaultPayout={console.log}
               onSavePaymentMethod={console.log}
               onSavePayoutMethod={console.log}
            />
         );
      case "addresses":
         return <AddressesSection />;
      case "notifications":
         return (
            <NotificationsSection
               settings={DEFAULT_NOTIFICATION_SETTINGS}
               frequencySettings={{
                  dailyDigest: false,
                  quietHours: {
                     enabled: false,
                     start: "22:00",
                     end: "08:00",
                     timezone: "Asia/Kolkata",
                  },
                  maxPerDay: 0,
               }}
               preferredChannel="push"
               onSave={p.onSaveNotifications}
            />
         );
      case "security":
         return (
            <SecuritySection
               security={{
                  passwordLastChanged: undefined,
                  twoFactorEnabled: false,
                  activeSessions: [
                     {
                        id: "current",
                        device: "Windows",
                        browser: "Chrome",
                        location: "Mumbai",
                        ipAddress: "192.168.1.1",
                        lastActive: new Date(),
                        isCurrent: true,
                     },
                  ],
                  loginHistory: [],
               }}
               privacy={{
                  showLastActive: true,
                  showLocation: true,
                  showRating: true,
                  showCompletedTasks: true,
                  allowMessagesFromAll: true,
                  showOnSearch: true,
               }}
               onRevokeSession={p.onRevokeSession}
               onRevokeAllSessions={p.onRevokeAllSessions}
               onUpdatePrivacy={p.onUpdatePrivacy}
               onDeleteAccount={p.onDeleteAccount}
            />
         );
      case "privacy":
         return (
            <PrivacySection
               settings={{
                  profileVisibility: "registered_users",
                  showEarnings: false,
                  showTaskHistory: true,
                  showReviews: true,
                  locationSharing: true,
                  analyticsTracking: true,
               }}
               onSave={p.onUpdatePrivacy}
            />
         );
      // business-verification section removed - now integrated into verifications section
      default:
         return <ProfileOverview user={p.user} onNavigate={p.onNavigate} />;
   }
}
