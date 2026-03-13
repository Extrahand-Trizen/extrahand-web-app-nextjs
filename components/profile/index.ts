/**
 * Profile Components Index
 * Export all profile-related components
 */

export {
   ProfileSidebar,
   ProfileMobileNav,
   ProfileNavList,
   navItems,
} from "./ProfileSidebar";
export { ProfileOverview } from "./ProfileOverview";
export { PublicProfile } from "./PublicProfile";
export { ProfileEditForm } from "./ProfileEditForm";
export { VerificationSection } from "./VerificationSection";
export { PaymentsSection, PaymentMethodForm, PayoutMethodForm } from "./PaymentsSection";
export { AddressesSection, AddressForm } from "./AddressesSection";
export { NotificationsSection } from "./NotificationsSection";
export { SecuritySection } from "./SecuritySection";
export { PreferencesSection } from "./PreferencesSection";
export { PrivacySection } from "./PrivacySection";

// Referral and Badge Components
export { default as ReferralDashboard } from "./ReferralDashboard";
export { default as ReferralDashboardSimple } from "./ReferralDashboardSimple";
export { default as BadgeDisplay } from "./BadgeDisplay";
export { default as BadgeDisplaySimple } from "./BadgeDisplaySimple";

// Re-export verification components
export * from "./verification";
