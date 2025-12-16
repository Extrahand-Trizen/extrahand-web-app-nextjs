"use client";

/**
 * Profile Navigation Sidebar
 * Left navigation for desktop, bottom tabs for mobile
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
   User,
   Eye,
   EyeOff,
   Edit3,
   Settings,
   Shield,
   CreditCard,
   Bell,
   Lock,
   ChevronRight,
} from "lucide-react";
import { ProfileSection } from "@/types/profile";

interface ProfileNavItem {
   id: ProfileSection;
   label: string;
   icon: React.ReactNode;
   description?: string;
}

const navItems: ProfileNavItem[] = [
   {
      id: "overview",
      label: "Overview",
      icon: <User className="w-5 h-5" />,
      description: "Account summary",
   },
   {
      id: "public-profile",
      label: "Public Profile",
      icon: <Eye className="w-5 h-5" />,
      description: "What others see",
   },
   {
      id: "edit-profile",
      label: "Edit Profile",
      icon: <Edit3 className="w-5 h-5" />,
      description: "Update your info",
   },
   {
      id: "preferences",
      label: "Preferences",
      icon: <Settings className="w-5 h-5" />,
      description: "Task preferences",
   },
   {
      id: "privacy",
      label: "Privacy",
      icon: <EyeOff className="w-5 h-5" />,
      description: "Control visibility & data",
   },
   {
      id: "verifications",
      label: "Verifications",
      icon: <Shield className="w-5 h-5" />,
      description: "Trust & identity",
   },
   {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Cards & payouts",
   },
   {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      description: "Communication",
   },
   {
      id: "security",
      label: "Security",
      icon: <Lock className="w-5 h-5" />,
      description: "Account security",
   },
];

interface ProfileSidebarProps {
   activeSection: ProfileSection;
   onSectionChange: (section: ProfileSection) => void;
   className?: string;
}

export function ProfileSidebar({
   activeSection,
   onSectionChange,
   className,
}: ProfileSidebarProps) {
   return (
      <nav className={cn("w-64 bg-white border-r border-gray-200", className)}>
         <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
               Account
            </h2>
            <p className="text-sm text-gray-500">
               Manage your profile and settings
            </p>
         </div>

         <div className="px-2 pb-4">
            {navItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                     "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-0.5",
                     activeSection === item.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
               >
                  <span
                     className={cn(
                        "shrink-0",
                        activeSection === item.id
                           ? "text-gray-900"
                           : "text-gray-400"
                     )}
                  >
                     {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">
                        {item.label}
                     </p>
                  </div>
                  {activeSection === item.id && (
                     <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
               </button>
            ))}
         </div>
      </nav>
   );
}

// Mobile bottom navigation variant
export function ProfileMobileNav({
   activeSection,
   onSectionChange,
}: ProfileSidebarProps) {
   const mobileItems = navItems.slice(0, 5); // Show only essential items on mobile

   return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
         <div className="flex justify-around">
            {mobileItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                     "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                     activeSection === item.id
                        ? "text-gray-900"
                        : "text-gray-400"
                  )}
               >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
               </button>
            ))}
         </div>
      </div>
   );
}

// List-based navigation for mobile (alternative)
interface ProfileNavListProps {
   onSectionChange: (section: ProfileSection) => void;
}

export function ProfileNavList({ onSectionChange }: ProfileNavListProps) {
   return (
      <div className="bg-white divide-y divide-gray-100">
         {navItems.map((item) => (
            <button
               key={item.id}
               onClick={() => onSectionChange(item.id)}
               className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
            >
               <span className="text-gray-400 flex-shrink-0">{item.icon}</span>
               <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">
                     {item.label}
                  </p>
                  {item.description && (
                     <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                     </p>
                  )}
               </div>
               <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </button>
         ))}
      </div>
   );
}

export { navItems };
