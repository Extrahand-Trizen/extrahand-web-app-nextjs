"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProfileSection } from "@/types/profile";
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

const MOCK_USER: UserProfile = {
   _id: "dev-user-1",
   uid: "dev-user-1",
   userType: "business",
   name: "Anita Kapoor",
   email: "anita.kapoor@example.com",
   phone: "+91 98765 43210",
   photoURL:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
   roles: ["tasker"],
   location: {
      type: "Point",
      coordinates: [72.8777, 19.076],
      city: "Mumbai",
      state: "Maharashtra",
   },
   rating: 4.8,
   totalReviews: 122,
   totalTasks: 150,
   completedTasks: 142,
   isVerified: true,
   isAadhaarVerified: true,
   isEmailVerified: true,
   isBankVerified: true,
   isPanVerified: false,
   isPhoneVerified: true,
   isActive: true,
   verificationBadge: "verified",
   skills: {
      list: [
         { name: "Handyman", verified: true },
         { name: "Assembly", verified: true },
         { name: "Delivery", verified: false },
      ],
   },
   business: {
      description:
         "Professional home services provider with 5+ years of experience. Specializing in handyman tasks, assembly, and delivery services across Mumbai.",
   },
   createdAt: new Date("2023-01-15"),
   updatedAt: new Date(),
};

const MOCK_REVIEWS = [
   {
      id: "1",
      taskId: "t1",
      taskTitle: "Furniture Assembly",
      reviewerId: "u1",
      reviewerName: "Raj P.",
      rating: 5,
      comment: "Excellent work! Very professional and quick.",
      createdAt: new Date("2024-11-20"),
      role: "poster" as const,
   },
   {
      id: "2",
      taskId: "t2",
      taskTitle: "Home Repair",
      reviewerId: "u2",
      reviewerName: "Priya S.",
      rating: 5,
      comment: "Fixed everything perfectly. Highly recommend!",
      createdAt: new Date("2024-11-15"),
      role: "poster" as const,
   },
   {
      id: "3",
      taskId: "t3",
      taskTitle: "Package Delivery",
      reviewerId: "u3",
      reviewerName: "Amit K.",
      rating: 4,
      comment: "Good service, on time delivery.",
      createdAt: new Date("2024-11-10"),
      role: "poster" as const,
   },
];

const MOCK_WORK_HISTORY = [
   {
      id: "1",
      taskId: "t1",
      title: "Furniture Assembly",
      category: "Home Services",
      completedAt: new Date("2024-11-20"),
      amount: 800,
      rating: 5,
      role: "tasker" as const,
   },
   {
      id: "2",
      taskId: "t2",
      title: "Home Repair",
      category: "Home Services",
      completedAt: new Date("2024-11-15"),
      amount: 1200,
      rating: 5,
      role: "tasker" as const,
   },
   {
      id: "3",
      taskId: "t3",
      title: "Package Delivery",
      category: "Delivery",
      completedAt: new Date("2024-11-10"),
      amount: 300,
      rating: 4,
      role: "tasker" as const,
   },
];

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
   const { userData, loading: authLoading, refreshUserData } = useAuth();
   const user = (userData ?? MOCK_USER) as UserProfile;
   const [isMobile, setIsMobile] = useState(false);
   const [section, setSection] = useState<ProfileSection>("overview");
   const [navOpen, setNavOpen] = useState(false);

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

   const props = {
      user,
      onNavigate: goTo,
      onSaveProfile: async () => {
         await refreshUserData();
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
      onSaveNotifications: async () => {},
      onSavePreferences: async () => {},
      onChangePassword: async () => {},
      onRevokeSession: async () => {},
      onRevokeAllSessions: async () => {},
      onUpdatePrivacy: async () => {},
      onDeleteAccount: async () => {
         router.push("/");
      },
   };

   if (authLoading)
      return (
         <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
         </div>
      );

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
   onNavigate: (s: ProfileSection) => void;
   onSaveProfile: () => Promise<void>;
   onVerify: (t: string) => Promise<void>;
   onSaveNotifications: () => Promise<void>;
   onSavePreferences: () => Promise<void>;
   onChangePassword: () => Promise<void>;
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
               reviews={MOCK_REVIEWS}
               workHistory={MOCK_WORK_HISTORY}
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
         return (
            <AddressesSection
               onDeleteAddress={console.log}
               onSetDefault={console.log}
               onSaveAddress={console.log}
            />
         );
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
               onChangePassword={p.onChangePassword}
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
      default:
         return <ProfileOverview user={p.user} onNavigate={p.onNavigate} />;
   }
}
