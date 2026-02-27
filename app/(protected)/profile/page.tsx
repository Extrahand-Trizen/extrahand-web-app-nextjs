"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProfileSection, Review, WorkHistoryItem, PaymentMethod, PayoutMethod } from "@/types/profile";
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
import ReferralDashboardSimple from "@/components/profile/ReferralDashboardSimple";
import BadgeDisplaySimple from "@/components/profile/BadgeDisplaySimple";
import {
   DEFAULT_NOTIFICATION_SETTINGS,
   FrequencySettings,
   CommunicationChannel,
   NotificationSettingsState,
} from "@/types/consent";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { ArrowLeft, Menu } from "lucide-react";
import { reviewsApi } from "@/lib/api/endpoints/reviews";
import { toast } from "sonner";
import { privacyApi } from "@/lib/api/endpoints/privacy";
import { notificationPreferencesApi } from "@/lib/api/endpoints/notificationPreferences";
import { useUserStore } from "@/lib/state/userStore";

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
   "referrals",
   "badges",
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
   referrals: "Referral Program",
   badges: "Badges",
};

   const DEFAULT_FREQUENCY: FrequencySettings = {
      dailyDigest: false,
      quietHours: {
         enabled: false,
         start: "22:00",
         end: "08:00",
         timezone: "Asia/Kolkata",
      },
      maxPerDay: 0,
   };

function ProfilePageSkeleton() {
   return (
      <div className="bg-gray-50 max-w-7xl mx-auto">
         <div className="flex">
            {/* Sidebar skeleton */}
            <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white min-h-screen">
               <div className="p-4 border-b border-gray-200">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
               </div>
               <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                     <div
                        key={i}
                        className="h-8 w-full bg-gray-100 rounded-md animate-pulse"
                     />
                  ))}
               </div>
            </aside>

            {/* Main content skeleton */}
            <main className="flex-1 min-h-screen">
               <div className="max-w-4xl mx-auto py-8 px-4 lg:px-8">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="space-y-4">
                     <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                           <div className="flex-1 space-y-2">
                              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                           </div>
                        </div>
                     </div>
                     <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                        <div className="h-2.5 w-full bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                           {Array.from({ length: 4 }).map((_, i) => (
                              <div
                                 key={i}
                                 className="h-16 bg-gray-100 rounded-lg animate-pulse"
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </div>
   );
}

function ProfilePageContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { userData, loading: authLoading, refreshUserData, logout } = useAuth();
   const refreshProfile = useUserStore((state) => state.refreshProfile);

   const [user, setUser] = useState<UserProfile | null>(userData);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
   const [loadingProfile, setLoadingProfile] = useState(false);
   const [profileError, setProfileError] = useState<string | null>(null);
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [notificationSettings, setNotificationSettings] =
      useState<NotificationSettingsState>(DEFAULT_NOTIFICATION_SETTINGS);
   const [notificationFrequency, setNotificationFrequency] =
      useState<FrequencySettings>(DEFAULT_FREQUENCY);
   const [notificationChannel, setNotificationChannel] =
      useState<CommunicationChannel>("push");
   const [isMobile, setIsMobile] = useState(false);
   const [section, setSection] = useState<ProfileSection>("overview");
   const [navOpen, setNavOpen] = useState(false);

   // Payment methods and payout methods state with localStorage persistence
   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
      if (typeof window !== 'undefined') {
         const stored = localStorage.getItem('paymentMethods');
         if (stored) {
            try {
               const parsed = JSON.parse(stored) as PaymentMethod[];
               // Filter out mock/dummy data (IDs: pm1, pm2, pm3)
               const filtered = parsed.filter(pm => !['pm1', 'pm2', 'pm3'].includes(pm.id));
               // Convert date strings back to Date objects
               return filtered.map((pm) => ({
                  ...pm,
                  createdAt: new Date(pm.createdAt)
               }));
            } catch (e) {
               console.error('Failed to parse stored payment methods:', e);
            }
         }
      }
      return [];
   });
   
   const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>(() => {
      if (typeof window !== 'undefined') {
         const stored = localStorage.getItem('payoutMethods');
         if (stored) {
            try {
               const parsed = JSON.parse(stored) as PayoutMethod[];
               // Filter out mock/dummy data (IDs: po1, po2)
               const filtered = parsed.filter(pm => !['po1', 'po2'].includes(pm.id));
               // Convert date strings back to Date objects
               return filtered.map((pm) => ({
                  ...pm,
                  createdAt: new Date(pm.createdAt)
               }));
            } catch (e) {
               console.error('Failed to parse stored payout methods:', e);
            }
         }
      }
      return [];
   });

   // Save payment methods to localStorage whenever they change
   useEffect(() => {
      if (typeof window !== 'undefined' && paymentMethods.length >= 0) {
         localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
      }
   }, [paymentMethods]);

   // Save payout methods to localStorage whenever they change
   useEffect(() => {
      if (typeof window !== 'undefined' && payoutMethods.length >= 0) {
         localStorage.setItem('payoutMethods', JSON.stringify(payoutMethods));
      }
   }, [payoutMethods]);

   // One-time cleanup: Remove any mock/dummy data from localStorage on mount
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const MOCK_PAYMENT_IDS = ['pm1', 'pm2', 'pm3'];
         const MOCK_PAYOUT_IDS = ['po1', 'po2'];
         
         const storedPayments = localStorage.getItem('paymentMethods');
         if (storedPayments) {
            try {
               const parsed = JSON.parse(storedPayments);
               const hasMockData = parsed.some((pm: PaymentMethod) => MOCK_PAYMENT_IDS.includes(pm.id));
               if (hasMockData) {
                  const cleaned = parsed.filter((pm: PaymentMethod) => !MOCK_PAYMENT_IDS.includes(pm.id));
                  localStorage.setItem('paymentMethods', JSON.stringify(cleaned));
                  setPaymentMethods(cleaned.map((pm: PaymentMethod) => ({
                     ...pm,
                     createdAt: new Date(pm.createdAt)
                  })));
               }
            } catch (e) {
               console.error('Error cleaning payment methods:', e);
            }
         }

         const storedPayouts = localStorage.getItem('payoutMethods');
         if (storedPayouts) {
            try {
               const parsed = JSON.parse(storedPayouts);
               const hasMockData = parsed.some((pm: PayoutMethod) => MOCK_PAYOUT_IDS.includes(pm.id));
               if (hasMockData) {
                  const cleaned = parsed.filter((pm: PayoutMethod) => !MOCK_PAYOUT_IDS.includes(pm.id));
                  localStorage.setItem('payoutMethods', JSON.stringify(cleaned));
                  setPayoutMethods(cleaned.map((pm: PayoutMethod) => ({
                     ...pm,
                     createdAt: new Date(pm.createdAt)
                  })));
               }
            } catch (e) {
               console.error('Error cleaning payout methods:', e);
            }
         }
      }
   }, []); // Empty dependency array - runs once on mount

   // Fetch profile data on mount
   useEffect(() => {
      const fetchProfileData = async () => {
         if (!userData?.uid) return;

         setLoadingProfile(true);
         setProfileError(null);
         try {
            const profileData = await refreshProfile();
            if (profileData) {
               setUser(profileData as UserProfile);
            }
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

   const normalizeNotificationSettings = (prefs: any): NotificationSettingsState => ({
      push: {
         enabled: prefs?.push?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.push.enabled,
         taskUpdates: prefs?.push?.taskUpdates ?? DEFAULT_NOTIFICATION_SETTINGS.push.taskUpdates,
         payments: prefs?.push?.payments ?? DEFAULT_NOTIFICATION_SETTINGS.push.payments,
         promotions: prefs?.push?.promotions ?? DEFAULT_NOTIFICATION_SETTINGS.push.promotions,
         system: prefs?.push?.system ?? DEFAULT_NOTIFICATION_SETTINGS.push.system,
         transactional: prefs?.push?.transactional ?? DEFAULT_NOTIFICATION_SETTINGS.push.transactional,
         taskReminders: prefs?.push?.taskReminders ?? DEFAULT_NOTIFICATION_SETTINGS.push.taskReminders,
         keywordTaskAlerts: prefs?.push?.keywordTaskAlerts ?? DEFAULT_NOTIFICATION_SETTINGS.push.keywordTaskAlerts,
         recommendedTaskAlerts:
            prefs?.push?.recommendedTaskAlerts ??
            DEFAULT_NOTIFICATION_SETTINGS.push.recommendedTaskAlerts,
      },
      email: {
         enabled: prefs?.email?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.email.enabled,
         taskUpdates: prefs?.email?.taskUpdates ?? DEFAULT_NOTIFICATION_SETTINGS.email.taskUpdates,
         payments: prefs?.email?.payments ?? DEFAULT_NOTIFICATION_SETTINGS.email.payments,
         promotions: prefs?.email?.promotions ?? DEFAULT_NOTIFICATION_SETTINGS.email.promotions,
         system: prefs?.email?.system ?? DEFAULT_NOTIFICATION_SETTINGS.email.system,
         marketing: prefs?.email?.marketing ?? DEFAULT_NOTIFICATION_SETTINGS.email.marketing,
         transactional: prefs?.email?.transactional ?? DEFAULT_NOTIFICATION_SETTINGS.email.transactional,
         taskReminders: prefs?.email?.taskReminders ?? DEFAULT_NOTIFICATION_SETTINGS.email.taskReminders,
         keywordTaskAlerts: prefs?.email?.keywordTaskAlerts ?? DEFAULT_NOTIFICATION_SETTINGS.email.keywordTaskAlerts,
         recommendedTaskAlerts:
            prefs?.email?.recommendedTaskAlerts ??
            DEFAULT_NOTIFICATION_SETTINGS.email.recommendedTaskAlerts,
      },
      sms: {
         enabled: prefs?.sms?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.sms.enabled,
         taskUpdates: prefs?.sms?.taskUpdates ?? DEFAULT_NOTIFICATION_SETTINGS.sms.taskUpdates,
         payments: prefs?.sms?.payments ?? DEFAULT_NOTIFICATION_SETTINGS.sms.payments,
      },
   });

   const normalizeFrequencySettings = (prefs: any): FrequencySettings => ({
      dailyDigest: prefs?.frequency?.dailyDigest ?? DEFAULT_FREQUENCY.dailyDigest,
      quietHours: {
         enabled: prefs?.frequency?.quietHours?.enabled ?? DEFAULT_FREQUENCY.quietHours.enabled,
         start: prefs?.frequency?.quietHours?.start ?? DEFAULT_FREQUENCY.quietHours.start,
         end: prefs?.frequency?.quietHours?.end ?? DEFAULT_FREQUENCY.quietHours.end,
         timezone: prefs?.frequency?.quietHours?.timezone ?? DEFAULT_FREQUENCY.quietHours.timezone,
      },
      maxPerDay: prefs?.frequency?.maxPerDay ?? DEFAULT_FREQUENCY.maxPerDay,
   });

   useEffect(() => {
      const fetchNotificationPreferences = async () => {
         if (!userData?.uid) return;

         try {
            const response = await notificationPreferencesApi.getPreferences();
            const prefs = response?.data ?? response?.preferences ?? response;
            if (!prefs) return;

            setNotificationSettings(normalizeNotificationSettings(prefs));
            setNotificationFrequency(normalizeFrequencySettings(prefs));
            setNotificationChannel(
               (prefs?.preferredChannel as CommunicationChannel) || "push"
            );
         } catch (error: any) {
            console.error("Failed to fetch notification preferences:", error);
         }
      };

      if (userData?.uid) {
         fetchNotificationPreferences();
      }
   }, [userData?.uid]);

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

            // Map API reviews to profile review format - filter out reviews without real data
            const mappedReviews: Review[] = response.data
               .filter((review: any) => 
                  review.reviewerName && 
                  review.reviewerName.trim() !== "" &&
                  review.rating > 0 &&
                  review.taskTitle
               )
               .map((review: any) => ({
                  id: review._id,
                  taskId: review.taskId,
                  taskTitle: review.taskTitle || "Task",
                  reviewerId: review.reviewerUid,
                  reviewerName: review.reviewerName,
                  reviewerPhoto: review.reviewerPhoto,
                  rating: review.rating,
                  comment: review.comment || "",
                  createdAt: new Date(review.createdAt),
                  role: "poster" as const, // Assuming reviews are from posters
               }));

            console.log("✅ Reviews loaded (with real data only):", mappedReviews.length);
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

   // Extract work history from profile data - filter out dummy/empty entries
   useEffect(() => {
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

   useEffect(() => {
      const s = searchParams.get("section") as ProfileSection;
      if (s && VALID_SECTIONS.includes(s)) {
         setSection(s);
      }
   }, [searchParams]);

   useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 1024);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
   }, []);

   const goTo = useCallback((s: ProfileSection) => {
      setNavOpen(false);
      setSection(s);
      if (typeof window !== 'undefined') {
         const url = new URL(window.location.href);
         url.searchParams.set('section', s);
         window.history.replaceState(null, '', url.toString());
      }
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
      notificationSettings,
      notificationFrequency,
      notificationChannel,
      paymentMethods,
      payoutMethods,
      onRemovePaymentMethod: (id: string) => {
         setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
         toast.success("Payment method removed successfully");
      },
      onRemovePayoutMethod: (id: string) => {
         setPayoutMethods(prev => prev.filter(pm => pm.id !== id));
         toast.success("Payout method removed successfully");
      },
      onSetDefaultPayment: (id: string) => {
         setPaymentMethods(prev => prev.map(pm => ({
            ...pm,
            isDefault: pm.id === id
         })));
         toast.success("Default payment method updated");
      },
      onSetDefaultPayout: (id: string) => {
         setPayoutMethods(prev => prev.map(pm => ({
            ...pm,
            isDefault: pm.id === id
         })));
         toast.success("Default payout method updated");
      },
      onSavePaymentMethod: (data: Partial<PaymentMethod>) => {
         const newMethod: PaymentMethod = {
            id: `pm${Date.now()}`,
            type: data.type || 'card',
            isDefault: paymentMethods.length === 0,
            createdAt: new Date(),
            ...data,
         } as PaymentMethod;
         setPaymentMethods(prev => [...prev, newMethod]);
         toast.success("Payment method added successfully");
      },
      onSavePayoutMethod: (data: Partial<PayoutMethod>) => {
         const newMethod: PayoutMethod = {
            id: `po${Date.now()}`,
            type: data.type || 'bank',
            isDefault: payoutMethods.length === 0,
            isVerified: false,
            createdAt: new Date(),
            ...data,
         } as PayoutMethod;
         setPayoutMethods(prev => [...prev, newMethod]);
         toast.success("Payout method added successfully");
      },
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
      onSaveNotifications: async (
         settings: NotificationSettingsState,
         frequency?: FrequencySettings,
         preferredChannel?: CommunicationChannel
      ) => {
         try {
            const finalFrequency = frequency || DEFAULT_FREQUENCY;
            const finalChannel = preferredChannel || "push";

            await notificationPreferencesApi.updatePreferences({
               push: settings.push,
               email: settings.email,
               sms: settings.sms,
               preferredChannel: finalChannel,
               frequency: finalFrequency,
            });

            setNotificationSettings(settings);
            setNotificationFrequency(finalFrequency);
            setNotificationChannel(finalChannel);

            toast.success("Notification settings updated");
         } catch (error: any) {
            console.error("Failed to update notification settings:", error);
            toast.error("Failed to update notification settings", {
               description: error.message || "Please try again later.",
            });
            throw error;
         }
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

   // While auth is resolving or we truly have no user data yet, show a
   // structured skeleton instead of a blocking full-page spinner so the
   // page feels responsive even during refresh.
   if (authLoading || (!user && !profileError)) {
      return <ProfilePageSkeleton />;
   }

   if (!user) {
      return <ProfilePageSkeleton />;
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
      <Suspense fallback={<ProfilePageSkeleton />}>
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
   notificationSettings: NotificationSettingsState;
   notificationFrequency: FrequencySettings;
   notificationChannel: CommunicationChannel;
   onVerify: (t: string) => Promise<void>;
   onSaveNotifications: (
      settings: NotificationSettingsState,
      frequency?: FrequencySettings,
      preferredChannel?: CommunicationChannel
   ) => Promise<void>;
   onSavePreferences: () => Promise<void>;
   onRevokeSession: () => Promise<void>;
   onRevokeAllSessions: () => Promise<void>;
   onUpdatePrivacy: () => Promise<void>;
   onDeleteAccount: () => Promise<void>;
   paymentMethods: PaymentMethod[];
   payoutMethods: PayoutMethod[];
   onRemovePaymentMethod: (id: string) => void;
   onRemovePayoutMethod: (id: string) => void;
   onSetDefaultPayment: (id: string) => void;
   onSetDefaultPayout: (id: string) => void;
   onSavePaymentMethod: (data: Partial<PaymentMethod>) => void;
   onSavePayoutMethod: (data: Partial<PayoutMethod>) => void;
}

function renderSection(s: ProfileSection, p: Props) {
   switch (s) {
      case "overview":
         return (
            <ProfileOverview
               user={p.user}
               onNavigate={p.onNavigate}
               loading={p.loadingProfile}
            />
         );
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
               paymentMethods={p.paymentMethods}
               payoutMethods={p.payoutMethods}
               onRemovePaymentMethod={p.onRemovePaymentMethod}
               onRemovePayoutMethod={p.onRemovePayoutMethod}
               onSetDefaultPayment={p.onSetDefaultPayment}
               onSetDefaultPayout={p.onSetDefaultPayout}
               onSavePaymentMethod={p.onSavePaymentMethod}
               onSavePayoutMethod={p.onSavePayoutMethod}
            />
         );
      case "addresses":
         return <AddressesSection />;
      case "notifications":
         return (
            <NotificationsSection
               settings={p.notificationSettings}
               frequencySettings={p.notificationFrequency}
               preferredChannel={p.notificationChannel}
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
      case "referrals":
         return (
            <div>
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Program</h2>
               <ReferralDashboardSimple className="mb-12" />
            </div>
         );
      case "badges":
         return (
            <div>
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h2>
               <BadgeDisplaySimple className="mb-12" />
            </div>
         );
      // business-verification section removed - now integrated into verifications section
      default:
         return (
            <ProfileOverview
               user={p.user}
               onNavigate={p.onNavigate}
               loading={p.loadingProfile}
            />
         );
   }
}
