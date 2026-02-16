/**
 * Consent Types
 * Types for user consent, notifications, and preferences management
 * Based on backend Consent schema from user service
 */

// ============================================
// Essential Consent Types
// ============================================

export interface EssentialConsents {
   /** Data processing consent - Required, cannot be revoked */
   dataProcessing: {
      granted: boolean;
      grantedAt: Date;
      version: string;
   };
   /** Account creation consent - Required, cannot be revoked */
   accountCreation: {
      granted: boolean;
      grantedAt: Date;
      version: string;
   };
}

// ============================================
// Functional Consent Types
// ============================================

export interface FunctionalConsents {
   /** Location services consent */
   locationServices: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      scope: LocationScope[];
   };
   /** Notifications consent */
   notifications: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      channels: NotificationChannelSettings;
   };
   /** Profile public visibility consent */
   profilePublic: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      visibilityLevel: ProfileVisibilityLevel;
   };
}

export type LocationScope = "task_matching" | "navigation" | "analytics";

export type ProfileVisibilityLevel =
   | "public"
   | "registered_users"
   | "connections_only";

// ============================================
// Notification Channel Settings
// ============================================

export interface NotificationChannelSettings {
   push: NotificationChannel;
   sms: NotificationChannel;
   email: NotificationChannel;
   inApp: NotificationChannel;
}

export interface NotificationChannel {
   enabled: boolean;
   categories: NotificationCategory[];
}

export type NotificationCategory =
   | "task_updates" // Task status changes, offers, messages
   | "payments" // Payment confirmations, refunds
   | "promotions" // Deals, offers, discounts
   | "reminders" // Task reminders, deadlines
   | "system" // Security alerts, account updates
   | "marketing" // Newsletters, product updates
   | "transactional" // Critical confirmations
   | "task_reminders" // Task-specific reminders
   | "keyword_task_alerts" // Keyword matches
   | "recommended_task_alerts"; // Recommended tasks

// ============================================
// Marketing Consent Types
// ============================================

export interface MarketingConsents {
   /** Email marketing consent */
   emailMarketing: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      categories: MarketingCategory[];
   };
   /** SMS marketing consent */
   smsMarketing: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      categories: MarketingCategory[];
   };
   /** Push notification marketing consent */
   pushMarketing: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
      categories: MarketingCategory[];
   };
}

export type MarketingCategory =
   | "promotions"
   | "newsletters"
   | "updates"
   | "partner_offers";

// ============================================
// Analytics Consent Types
// ============================================

export interface AnalyticsConsents {
   /** Usage analytics consent */
   usageAnalytics: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
   };
   /** Performance monitoring consent */
   performanceMonitoring: {
      granted: boolean;
      grantedAt?: Date;
      revokedAt?: Date;
   };
}

// ============================================
// Third-Party Service Consent Types
// ============================================

export interface ThirdPartyConsents {
   /** Verification services consent (Aadhaar, Bank, etc.) */
   verificationServices: {
      granted: boolean;
      grantedAt?: Date;
      providers: VerificationProvider[];
   };
   /** Payment processing consent */
   paymentProcessing: {
      granted: boolean;
      grantedAt?: Date;
      providers: PaymentProvider[];
   };
}

export type VerificationProvider = "cashfree" | "signzy" | "karza";

export type PaymentProvider = "razorpay" | "cashfree" | "paytm";

// ============================================
// Communication Preferences
// ============================================

export interface CommunicationPreferences {
   /** Preferred language for communications */
   preferredLanguage: SupportedLanguage;
   /** Preferred communication channel */
   preferredChannel: CommunicationChannel;
   /** Notification frequency preferences */
   frequency: FrequencySettings;
}

export type SupportedLanguage =
   | "en"
   | "hi"
   | "ta"
   | "te"
   | "kn"
   | "ml"
   | "mr"
   | "bn"
   | "gu"
   | "pa";

export type CommunicationChannel = "email" | "sms" | "push" | "whatsapp";

export interface FrequencySettings {
   /** Daily digest preference */
   dailyDigest: boolean;
   /** Quiet hours settings */
   quietHours: {
      enabled: boolean;
      start: string; // 24hr format "HH:mm"
      end: string; // 24hr format "HH:mm"
      timezone: string;
   };
   /** Maximum notifications per day (0 = unlimited) */
   maxPerDay: number;
}

// ============================================
// Combined Consent Document Type
// ============================================

export interface UserConsent {
   userId: string;
   essential: EssentialConsents;
   functional: FunctionalConsents;
   marketing: MarketingConsents;
   analytics: AnalyticsConsents;
   thirdParty: ThirdPartyConsents;
   preferences: CommunicationPreferences;
   /** Audit log of consent changes */
   auditLog: ConsentAuditEntry[];
   createdAt: Date;
   updatedAt: Date;
}

export interface ConsentAuditEntry {
   timestamp: Date;
   action: ConsentAction;
   consentType: string;
   previousValue?: boolean;
   newValue: boolean;
   ipAddress?: string;
   userAgent?: string;
}

export type ConsentAction = "granted" | "revoked" | "updated";

// ============================================
// UI State Types for Settings Pages
// ============================================

export interface NotificationSettingsState {
   push: {
      enabled: boolean;
      taskUpdates: boolean;
      payments: boolean;
      promotions: boolean;
      reminders: boolean;
      system: boolean;
      transactional: boolean;
      taskReminders: boolean;
      keywordTaskAlerts: boolean;
      recommendedTaskAlerts: boolean;
   };
   email: {
      enabled: boolean;
      taskUpdates: boolean;
      payments: boolean;
      promotions: boolean;
      reminders: boolean;
      system: boolean;
      marketing: boolean;
      transactional: boolean;
      taskReminders: boolean;
      keywordTaskAlerts: boolean;
      recommendedTaskAlerts: boolean;
   };
   sms: {
      enabled: boolean;
      taskUpdates: boolean;
      payments: boolean;
      reminders: boolean;
   };
}

export interface PrivacySettingsState {
   profileVisibility: ProfileVisibilityLevel;
   showEarnings: boolean;
   showTaskHistory: boolean;
   showReviews: boolean;
   locationSharing: boolean;
   analyticsTracking: boolean;
}

// ============================================
// API Request/Response Types
// ============================================

export interface UpdateConsentRequest {
   consentType: ConsentType;
   granted: boolean;
   /** Additional metadata for specific consent types */
   metadata?: Record<string, unknown>;
}

export type ConsentType =
   | "locationServices"
   | "notifications"
   | "profilePublic"
   | "emailMarketing"
   | "smsMarketing"
   | "pushMarketing"
   | "usageAnalytics"
   | "performanceMonitoring"
   | "verificationServices"
   | "paymentProcessing";

export interface ConsentResponse {
   success: boolean;
   consent: UserConsent;
   message?: string;
}

export interface UpdateNotificationPreferencesRequest {
   channel: keyof NotificationChannelSettings;
   enabled: boolean;
   categories?: NotificationCategory[];
}

export interface UpdateCommunicationPreferencesRequest {
   preferredLanguage?: SupportedLanguage;
   preferredChannel?: CommunicationChannel;
   quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
   };
   dailyDigest?: boolean;
   maxPerDay?: number;
}

// ============================================
// Default Values / Constants
// ============================================

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsState = {
   push: {
      enabled: true,
      taskUpdates: true,
      payments: true,
      promotions: false,
      reminders: true,
      system: true,
      transactional: true,
      taskReminders: true,
      keywordTaskAlerts: true,
      recommendedTaskAlerts: true,
   },
   email: {
      enabled: true,
      taskUpdates: true,
      payments: true,
      promotions: false,
      reminders: false,
      system: true,
      marketing: false,
      transactional: true,
      taskReminders: true,
      keywordTaskAlerts: true,
      recommendedTaskAlerts: true,
   },
   sms: {
      enabled: true,
      taskUpdates: true,
      payments: true,
      reminders: false,
   },
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettingsState = {
   profileVisibility: "registered_users",
   showEarnings: false,
   showTaskHistory: true,
   showReviews: true,
   locationSharing: true,
   analyticsTracking: true,
};

export const SUPPORTED_LANGUAGES: {
   value: SupportedLanguage;
   label: string;
}[] = [
      { value: "en", label: "English" },
      { value: "hi", label: "हिन्दी (Hindi)" },
      { value: "ta", label: "தமிழ் (Tamil)" },
      { value: "te", label: "తెలుగు (Telugu)" },
      { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
      { value: "ml", label: "മലയാളം (Malayalam)" },
      { value: "mr", label: "मराठी (Marathi)" },
      { value: "bn", label: "বাংলা (Bengali)" },
      { value: "gu", label: "ગુજરાતી (Gujarati)" },
      { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
   ];

export const COMMUNICATION_CHANNELS: {
   value: CommunicationChannel;
   label: string;
}[] = [
      { value: "push", label: "Push Notifications" },
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
      { value: "whatsapp", label: "WhatsApp" },
   ];
