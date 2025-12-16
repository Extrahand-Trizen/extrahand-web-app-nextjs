"use client";

/**
 * Profile Page - Redesigned
 * Professional, trustworthy profile and account management
 * Clean, restrained design following marketplace best practices
 */

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProfileSection } from "@/types/profile";
import {
   ProfileSidebar,
   ProfileNavList,
   ProfileOverview,
   PublicProfile,
   ProfileEditForm,
   VerificationSection,
   PaymentsSection,
   NotificationsSection,
   SecuritySection,
   PreferencesSection,
} from "@/components/profile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";

function ProfilePageContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const {
      currentUser,
      userData,
      loading: authLoading,
      refreshUserData,
   } = useAuth();

   // Hardcoded preview user (development only) — used when no authenticated user is present
   const HARDCODED_USER = {
      id: "dev-user-1",
      name: "Anita Kapoor",
      displayName: "Anita K.",
      firstName: "Anita",
      lastName: "Kapoor",
      email: "anita.kapoor@example.com",
      phone: "+91 98765 43210",
      avatarUrl:
         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a1e7d7f3d5c6b0f5f9b2c3a4d5e6f7a",
      bio: "Friendly, reliable helper — I specialise in handyman tasks, deliveries, and event setup. I pride myself on punctuality and clear communication.",
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      rating: 4.8,
      reviewsCount: 122,
      completedTasks: 540,
      skills: ["Handyman", "Assembly", "Delivery"],
      hourlyRate: 350,
      verifications: {
         email: true,
         phone: true,
         id: true,
         address: false,
         backgroundCheck: false,
      },
      paymentMethods: [],
      payoutMethods: [],
      preferences: {
         preferredCategories: ["Delivery", "Home Services"],
         availability: { monday: true, tuesday: true },
         serviceRadius: 15,
         language: "en",
         currency: "INR",
         timezone: "Asia/Kolkata",
      },
      notifications: {
         email: { taskUpdates: true, newMessages: true, marketing: false },
         push: { taskUpdates: true, newMessages: true },
         inApp: { taskUpdates: true, newMessages: true },
      },
      security: { twoFactorEnabled: false },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
   };

   const isPreview = !currentUser;
   const effectiveUser = userData ?? HARDCODED_USER;

   const [isMobileView, setIsMobileView] = useState(false);
   const [activeSection, setActiveSection] =
      useState<ProfileSection>("overview");
   const [showMobileNav, setShowMobileNav] = useState(false);

   // Handle URL-based section navigation
   useEffect(() => {
      const section = searchParams.get("section") as ProfileSection;
      if (section && isValidSection(section)) {
         setActiveSection(section);
      }
   }, [searchParams]);

   // Responsive handling
   useEffect(() => {
      if (typeof window === "undefined") return;

      const checkScreenSize = () => {
         setIsMobileView(window.innerWidth < 1024);
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
   }, []);

   const handleSectionChange = useCallback((section: ProfileSection) => {
      setActiveSection(section);
      setShowMobileNav(false);
      // Update URL without navigation
      const url = new URL(window.location.href);
      url.searchParams.set("section", section);
      window.history.pushState({}, "", url.toString());
   }, []);

   const handleBack = useCallback(() => {
      if (activeSection !== "overview") {
         handleSectionChange("overview");
      } else {
         router.back();
      }
   }, [activeSection, handleSectionChange, router]);

   // Mock save handlers - these would connect to your API
   const handleSaveProfile = async (data: any) => {
      console.log("Saving profile:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refreshUserData();
   };

   const handleVerify = async (type: string) => {
      console.log("Starting verification:", type);
      // Would navigate to verification flow
      alert(`Starting ${type} verification...`);
   };

   const handleSaveNotifications = async (prefs: any) => {
      console.log("Saving notifications:", prefs);
      await new Promise((resolve) => setTimeout(resolve, 1000));
   };

   const handleSavePreferences = async (prefs: any) => {
      console.log("Saving preferences:", prefs);
      await new Promise((resolve) => setTimeout(resolve, 1000));
   };

   const handleChangePassword = async (
      oldPassword: string,
      newPassword: string
   ) => {
      console.log("Changing password...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
   };

   const handleRevokeSession = async (sessionId: string) => {
      console.log("Revoking session:", sessionId);
      await new Promise((resolve) => setTimeout(resolve, 500));
   };

   const handleRevokeAllSessions = async () => {
      console.log("Revoking all sessions...");
      await new Promise((resolve) => setTimeout(resolve, 500));
   };

   const handleUpdatePrivacy = async (settings: any) => {
      console.log("Updating privacy:", settings);
      await new Promise((resolve) => setTimeout(resolve, 500));
   };

   const handleDeleteAccount = async () => {
      console.log("Deleting account...");
      router.push("/");
   };

   // Show loading if auth is loading
   if (authLoading) {
      return (
         <div className="flex items-center justify-center py-20">
            <div className="text-center">
               <LoadingSpinner size="lg" />
               <p className="mt-4 text-gray-600 text-sm">
                  Loading your profile...
               </p>
            </div>
         </div>
      );
   }

   // Mobile layout
   if (isMobileView) {
      return (
         <div className="bg-gray-50 min-h-screen">
            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
               <div className="flex items-center justify-between px-4 py-3">
                  <button
                     onClick={handleBack}
                     className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                     <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h1 className="text-base font-semibold text-gray-900">
                     {getSectionTitle(activeSection)}
                  </h1>
                  <button
                     onClick={() => setShowMobileNav(!showMobileNav)}
                     className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                     {showMobileNav ? (
                        <X className="w-5 h-5 text-gray-600" />
                     ) : (
                        <Menu className="w-5 h-5 text-gray-600" />
                     )}
                  </button>
               </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {showMobileNav && (
               <div className="fixed inset-0 z-40 bg-white pt-14">
                  <ProfileNavList onSectionChange={handleSectionChange} />
               </div>
            )}

            {/* Mobile Content */}
            <div className="px-4 py-6 pb-20">
               {renderSection(activeSection, {
                  user: effectiveUser,
                  onNavigate: handleSectionChange,
                  onSaveProfile: handleSaveProfile,
                  onVerify: handleVerify,
                  onSaveNotifications: handleSaveNotifications,
                  onSavePreferences: handleSavePreferences,
                  onChangePassword: handleChangePassword,
                  onRevokeSession: handleRevokeSession,
                  onRevokeAllSessions: handleRevokeAllSessions,
                  onUpdatePrivacy: handleUpdatePrivacy,
                  onDeleteAccount: handleDeleteAccount,
               })}
            </div>
         </div>
      );
   }

   // Desktop layout
   return (
      <div className="bg-gray-50 max-w-7xl mx-auto">
         <div className="flex">
            {/* Sidebar */}
            <ProfileSidebar
               activeSection={activeSection}
               onSectionChange={handleSectionChange}
               className="hidden lg:block sticky top-0 h-screen"
            />

            {/* Content Area */}
            <main className="flex-1 min-h-screen">
               <div className="max-w-4xl mx-auto px-6 py-8">
                  {/* Breadcrumb */}
                  {activeSection !== "overview" && (
                     <button
                        onClick={() => handleSectionChange("overview")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                     >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Overview
                     </button>
                  )}

                  {/* Section Content */}
                  {renderSection(activeSection, {
                     user: effectiveUser,
                     onNavigate: handleSectionChange,
                     onSaveProfile: handleSaveProfile,
                     onVerify: handleVerify,
                     onSaveNotifications: handleSaveNotifications,
                     onSavePreferences: handleSavePreferences,
                     onChangePassword: handleChangePassword,
                     onRevokeSession: handleRevokeSession,
                     onRevokeAllSessions: handleRevokeAllSessions,
                     onUpdatePrivacy: handleUpdatePrivacy,
                     onDeleteAccount: handleDeleteAccount,
                  })}
               </div>
            </main>
         </div>
      </div>
   );
}

// Wrap with Suspense for useSearchParams
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

// Helper functions
function isValidSection(section: string): section is ProfileSection {
   const validSections: ProfileSection[] = [
      "overview",
      "public-profile",
      "edit-profile",
      "preferences",
      "verifications",
      "payments",
      "notifications",
      "security",
      "privacy",
   ];
   return validSections.includes(section as ProfileSection);
}

function getSectionTitle(section: ProfileSection): string {
   const titles: Record<ProfileSection, string> = {
      overview: "Account",
      "public-profile": "Public Profile",
      "edit-profile": "Edit Profile",
      preferences: "Preferences",
      verifications: "Verifications",
      payments: "Payments",
      notifications: "Notifications",
      security: "Security",
      privacy: "Privacy",
   };
   return titles[section];
}

interface SectionProps {
   user: any;
   onNavigate: (section: ProfileSection) => void;
   onSaveProfile: (data: any) => Promise<void>;
   onVerify: (type: string) => Promise<void>;
   onSaveNotifications: (prefs: any) => Promise<void>;
   onSavePreferences: (prefs: any) => Promise<void>;
   onChangePassword: (
      oldPassword: string,
      newPassword: string
   ) => Promise<void>;
   onRevokeSession: (sessionId: string) => Promise<void>;
   onRevokeAllSessions: () => Promise<void>;
   onUpdatePrivacy: (settings: any) => Promise<void>;
   onDeleteAccount: () => Promise<void>;
}

function renderSection(section: ProfileSection, props: SectionProps) {
   const {
      user,
      onNavigate,
      onSaveProfile,
      onVerify,
      onSaveNotifications,
      onSavePreferences,
      onChangePassword,
      onRevokeSession,
      onRevokeAllSessions,
      onUpdatePrivacy,
      onDeleteAccount,
   } = props;

   switch (section) {
      case "overview":
         return <ProfileOverview user={user} onNavigate={onNavigate} />;

      case "public-profile":
         return (
            <PublicProfile
               user={user}
               isOwnProfile
               reviews={[]}
               workHistory={[]}
            />
         );

      case "edit-profile":
         return (
            <ProfileEditForm
               user={user}
               onSave={onSaveProfile}
               onCancel={() => onNavigate("overview")}
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
               onSave={onSavePreferences}
            />
         );

      case "verifications":
         return <VerificationSection user={user} onVerify={onVerify} />;

      case "payments":
         return (
            <PaymentsSection
               paymentMethods={[]}
               payoutMethods={[]}
               transactions={[]}
               onAddPaymentMethod={() => alert("Add payment method")}
               onAddPayoutMethod={() => alert("Add payout method")}
               onRemovePaymentMethod={(id) =>
                  console.log("Remove payment:", id)
               }
               onRemovePayoutMethod={(id) => console.log("Remove payout:", id)}
               onSetDefaultPayment={(id) =>
                  console.log("Set default payment:", id)
               }
               onSetDefaultPayout={(id) =>
                  console.log("Set default payout:", id)
               }
            />
         );

      case "notifications":
         return (
            <NotificationsSection
               preferences={{
                  email: {
                     taskUpdates: true,
                     newMessages: true,
                     marketing: false,
                     accountAlerts: true,
                     weeklyDigest: true,
                  },
                  push: {
                     taskUpdates: true,
                     newMessages: true,
                     marketing: false,
                     accountAlerts: true,
                  },
                  inApp: {
                     taskUpdates: true,
                     newMessages: true,
                     systemAlerts: true,
                  },
                  sms: {
                     taskUpdates: false,
                     accountAlerts: true,
                  },
               }}
               onSave={onSaveNotifications}
            />
         );

      case "security":
      case "privacy":
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
                        location: "Mumbai, India",
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
               onChangePassword={onChangePassword}
               onRevokeSession={onRevokeSession}
               onRevokeAllSessions={onRevokeAllSessions}
               onUpdatePrivacy={onUpdatePrivacy}
               onDeleteAccount={onDeleteAccount}
            />
         );

      default:
         return <ProfileOverview user={user} onNavigate={onNavigate} />;
   }
}
