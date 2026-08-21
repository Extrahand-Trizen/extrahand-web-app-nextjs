/**
 * Mixpanel Analytics Service — ExtraHand Website (web)
 *
 * Web adaptation of `src/services/mixpanel.ts` from the Helper Mobile App.
 * Same Mixpanel project (shared token), same event names, same identity flow:
 *   sign-up / login → identify(uid) + people.set()
 *   logout          → reset()
 *
 * Platform super properties: app = "web", platform = "web"
 * (mobile app uses app = "helper", platform = "android" | "ios")
 *
 * Anonymous visitors are tracked under Mixpanel's auto-generated distinct_id
 * and merged on identify(). Initialization is NOT consent-gated: like the
 * mobile app (and the GA4 gtag script injected by the root layout), Mixpanel
 * loads on every page so the analytics funnels are not skipped for visitors
 * who land anywhere other than the consent banner paths.
 */

import { useUserStore } from '@/lib/state/userStore';
import {
  buildMixpanelPeopleProperties,
  clearMixpanelIdentitySession,
  markMixpanelUserIdentified,
  resolveMixpanelRole,
  resolveMixpanelUserId,
  shouldIdentifyMixpanelUser,
  type MixpanelProfileLike,
} from './mixpanelIdentity';

type MixpanelBrowser = typeof import('mixpanel-browser').default;

// ─── Token ───────────────────────────────────────────────────────────────────

// Shared with the Helper Mobile App project token so funnel data joins across
// platforms. Override via NEXT_PUBLIC_MIXPANEL_TOKEN in .env.
const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'a4fbb9d01d29edad734ab23d1159437f';

// ─── Singleton & Lazy Loader ─────────────────────────────────────────────────

let initialized = false;
let mixpanelInstance: MixpanelBrowser | null = null;
let mixpanelPromise: Promise<MixpanelBrowser | null> | null = null;

export async function getMixpanel(): Promise<MixpanelBrowser | null> {
  if (mixpanelInstance) return mixpanelInstance;
  if (typeof window === 'undefined') return null;
  if (!mixpanelPromise) {
    mixpanelPromise = import('mixpanel-browser')
      .then((mod) => {
        mixpanelInstance = (mod.default || mod) as MixpanelBrowser;
        return mixpanelInstance;
      })
      .catch((error) => {
        console.warn('⚠️ [Mixpanel] Failed to load mixpanel-browser:', error);
        return null;
      });
  }
  return mixpanelPromise;
}

/** Current active role for event properties: "tasker" | "poster" | "partner" | "guest" */
export function getCurrentRole(): 'tasker' | 'poster' | 'partner' | 'guest' {
  try {
    const user = useUserStore.getState().user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const normalized = roles.map((r: unknown) => String(r).toLowerCase());
    if (normalized.includes('partner')) return 'partner';
    if (normalized.includes('tasker')) return 'tasker';
    if (normalized.includes('poster') || normalized.includes('requester')) return 'poster';
    return 'guest';
  } catch {
    return 'guest';
  }
}

/**
 * Initialize Mixpanel. Safe to call multiple times — subsequent calls are
 * no-ops. Only ever runs on the client.
 */
export async function initMixpanel(): Promise<void> {
  if (initialized) return;
  if (typeof window === 'undefined') return;

  const mp = await getMixpanel();
  if (!mp) return;

  try {
    mp.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== 'production',
      track_pageview: false, // page views are tracked manually via AnalyticsPageView
      persistence: 'localStorage',
      ignore_dnt: true,
    });
    // Super properties attached to every event automatically
    mp.register({
      platform: 'web',
      app: 'web',
    });
    initialized = true;
    console.log('✅ [Mixpanel] Initialized successfully');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] Initialization failed:', error);
  }
}

/** Internal safe accessor — ensures Mixpanel is initialized and returned. */
async function getInitializedMp(): Promise<MixpanelBrowser | null> {
  if (typeof window === 'undefined') return null;
  if (!initialized) {
    await initMixpanel();
  }
  return mixpanelInstance;
}

// ─── Identity ────────────────────────────────────────────────────────────────

/**
 * Identify the user. Call after a successful login or sign-up (session restore
 * is handled automatically by AuthProvider).
 * @param uid Firebase UID (fallback distinct_id)
 * @param profile Optional user profile fields for the People record
 */
export async function mixpanelIdentify(
  uid: string,
  profile?: {
    _id?: string | null;
    id?: string | null;
    uid?: string | null;
    name?: string;
    email?: string;
    phone?: string;
    roles?: string[];
    role?: string;
    primaryRole?: string;
    createdAt?: string | Date;
    location?: {
      city?: string | null;
      area?: string | null;
      locality?: string | null;
      state?: string | null;
    } | null;
  },
): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;

  const resolvedUserId = resolveMixpanelUserId(profile as MixpanelProfileLike | undefined, uid);
  if (!resolvedUserId || !shouldIdentifyMixpanelUser(resolvedUserId)) {
    return;
  }

  try {
    mp.identify(resolvedUserId);
    markMixpanelUserIdentified(resolvedUserId);

    const role = resolveMixpanelRole(profile?.roles, profile?.role, profile?.primaryRole);
    const peopleProps: Record<string, unknown> = {
      ...buildMixpanelPeopleProperties(profile as MixpanelProfileLike | undefined, role),
      app: 'web',
      platform: 'web',
      current_role: role.toLowerCase(),
    };

    if (profile?.createdAt) {
      peopleProps.$created = String(profile.createdAt);
    }

    Object.keys(peopleProps).forEach((k) => {
      if (peopleProps[k] === undefined) delete peopleProps[k];
    });

    mp.people.set(peopleProps);
    console.log('✅ [Mixpanel] Identified user:', resolvedUserId);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] identify failed:', error);
  }
}

/**
 * Reset the Mixpanel identity. Call on logout.
 * This clears the distinct_id so the next session starts fresh.
 */
export async function mixpanelReset(): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.reset();
    clearMixpanelIdentitySession();
    console.log('✅ [Mixpanel] Identity reset on logout');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] reset failed:', error);
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

/**
 * EVENT: Screen Viewed
 * Fires on every route change (mirrors mobile app's screen tracking)
 */
export async function trackScreenViewed(screenName: string): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    const role = getCurrentRole();
    mp.track('Screen Viewed', {
      screen_name: screenName,
      role,
    });
    console.log(`✅ [Mixpanel] Tracked Screen Viewed: ${screenName} (Role: ${role})`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Screen Viewed failed:', error);
  }
}

/**
 * EVENT: Switched Role
 * Fires when user switches the active role mode in the navigation (poster/tasker)
 */
export async function trackRoleSwitched(
  fromRole: 'poster' | 'tasker',
  toRole: 'poster' | 'tasker',
): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    // Keep People property current
    mp.people.set({ current_role: toRole });

    mp.track('Switched Role', {
      from_role: fromRole,
      to_role: toRole,
      role: toRole,
    });
    console.log(`✅ [Mixpanel] Tracked Switched Role: ${fromRole} -> ${toRole}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Switched Role failed:', error);
  }
}

/**
 * EVENT: sign_up_completed
 * Fires once when a new website account is created and OTP is verified.
 */
export async function trackSignUpCompleted(params: {
  supplyMode?: string;
  hasReferral?: boolean;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('sign_up_completed', {
      sign_up_method: 'phone_otp',
      supply_mode: params.supplyMode || 'web',
      has_referral: params.hasReferral ?? false,
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: sign_up_completed');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track sign_up_completed failed:', error);
  }
}

/**
 * EVENT: login_completed
 * Fires when an existing user logs in successfully via OTP.
 */
export async function trackLoginCompleted(): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('login_completed', {
      sign_up_method: 'phone_otp',
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: login_completed');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track login_completed failed:', error);
  }
}

/**
 * EVENT: logout_initiated
 * Fires just before the user's session is cleared.
 */
export async function trackLogoutInitiated(): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('logout_initiated', {
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: logout_initiated');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track logout_initiated failed:', error);
  }
}

/**
 * EVENT: task_applied  ← Value Moment
 * Fires when a tasker submits an offer/application for a task.
 * Same event name + props as the Helper Mobile App.
 */
export async function trackTaskApplied(params: {
  taskId?: string;
  taskCategory?: string;
  offerPrice?: number;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    const props: Record<string, unknown> = {
      task_id: params.taskId || 'unknown',
      task_category: params.taskCategory || 'unknown',
      has_offer_price: params.offerPrice != null,
      role: getCurrentRole(),
    };
    if (params.offerPrice != null) {
      props.offer_price = params.offerPrice;
    }
    mp.track('task_applied', props);
    console.log('✅ [Mixpanel] Tracked: task_applied', props);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track task_applied failed:', error);
  }
}

/**
 * EVENT: Task Posted  ← Value Moment (web-only)
 * Fires when a customer successfully posts a new task.
 */
export async function trackTaskPosted(params: {
  taskId?: string;
  taskCategory?: string;
  budgetType?: string;
  budget?: number;
  urgency?: string;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    const props: Record<string, unknown> = {
      task_id: params.taskId || 'unknown',
      task_category: params.taskCategory || 'unknown',
      budget_type: params.budgetType || 'unknown',
      urgency: params.urgency || 'standard',
      role: getCurrentRole(),
    };
    if (params.budget != null) {
      props.budget = params.budget;
    }
    mp.track('Task Posted', props);
    console.log('✅ [Mixpanel] Tracked: Task Posted', props);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Task Posted failed:', error);
  }
}

// ─── Lead Lifecycle Events ────────────────────────────────────────────────────

/**
 * EVENT: Lead Accepted
 * Fires when a poster accepts a helper's offer (task is assigned).
 * booking_id = task id (joins web + mobile app funnels).
 */
export async function trackLeadAccepted(params: {
  booking_id: string;
  time_to_accept_seconds?: number;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    const props: Record<string, unknown> = {
      booking_id: params.booking_id,
      role: getCurrentRole(),
    };
    if (params.time_to_accept_seconds !== undefined) {
      props.time_to_accept_seconds = params.time_to_accept_seconds;
    }
    mp.track('Lead Accepted', props);
    console.log(`✅ [Mixpanel] Tracked Lead Accepted: ${params.booking_id}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] trackLeadAccepted failed:', error);
  }
}

/**
 * EVENT: Lead Rejected
 * Fires when a poster rejects a helper's offer.
 */
export async function trackLeadRejected(params: {
  booking_id: string;
  reason?: string;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Lead Rejected', {
      booking_id: params.booking_id,
      reason: params.reason || 'unknown',
      role: getCurrentRole(),
    });
    console.log(`✅ [Mixpanel] Tracked Lead Rejected: ${params.booking_id}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] trackLeadRejected failed:', error);
  }
}

/**
 * EVENT: Job Completed
 * Fires when a task is marked completed (poster approves the work).
 */
export async function trackJobCompleted(params: {
  booking_id: string;
  amount?: number;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    const props: Record<string, unknown> = {
      booking_id: params.booking_id,
      role: getCurrentRole(),
    };
    if (params.amount !== undefined) {
      props.amount = params.amount;
    }
    mp.track('Job Completed', props);
    console.log(`✅ [Mixpanel] Tracked Job Completed: ${params.booking_id}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] trackJobCompleted failed:', error);
  }
}

/**
 * EVENT: Task Proof Submitted (web-only)
 * Fires when a tasker submits completion proof for review.
 */
export async function trackTaskProofSubmitted(params: {
  task_id: string;
  has_proof: boolean;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Task Proof Submitted', {
      task_id: params.task_id,
      has_proof: params.has_proof,
      role: getCurrentRole(),
    });
    console.log(`✅ [Mixpanel] Tracked Task Proof Submitted: ${params.task_id}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] trackTaskProofSubmitted failed:', error);
  }
}

/**
 * EVENT: Review Submitted (web-only)
 * Fires when a review is successfully created for a completed task.
 */
export async function trackReviewSubmitted(params: {
  task_id: string;
  rating: number;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Review Submitted', {
      task_id: params.task_id,
      rating: params.rating,
      role: getCurrentRole(),
    });
    console.log(`✅ [Mixpanel] Tracked Review Submitted: ${params.task_id}`);
  } catch (error) {
    console.warn('⚠️ [Mixpanel] trackReviewSubmitted failed:', error);
  }
}

/**
 * EVENT: Chat Message Sent (web-only)
 * Fires when a user sends a chat message about a task.
 */
export async function trackChatMessageSent(params: {
  task_id?: string;
  chat_id?: string;
  message_type?: string;
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Chat Message Sent', {
      task_id: params.task_id || 'unknown',
      chat_id: params.chat_id || 'unknown',
      message_type: params.message_type || 'text',
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: Chat Message Sent');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Chat Message Sent failed:', error);
  }
}

/**
 * EVENT: Onboarding Completed (web-only)
 * Fires when a new user completes role selection during onboarding.
 */
export async function trackOnboardingCompleted(params: {
  goal?: string;
  userType?: string;
  roles?: string[];
}): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Onboarding Completed', {
      goal: params.goal || 'unknown',
      user_type: params.userType || 'unknown',
      roles: params.roles || [],
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: Onboarding Completed');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Onboarding Completed failed:', error);
  }
}

/**
 * EVENT: Referral Code Applied (web-only)
 * Fires when a referral code is successfully applied after sign-up.
 */
export async function trackReferralCodeApplied(): Promise<void> {
  const mp = await getInitializedMp();
  if (!mp) return;
  try {
    mp.track('Referral Code Applied', {
      role: getCurrentRole(),
    });
    console.log('✅ [Mixpanel] Tracked: Referral Code Applied');
  } catch (error) {
    console.warn('⚠️ [Mixpanel] track Referral Code Applied failed:', error);
  }
}
