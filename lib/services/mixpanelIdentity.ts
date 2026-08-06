/**
 * Mixpanel identity helpers — ExtraHand Website (web)
 *
 * Mirrors `src/services/mixpanelIdentity.ts` from the Helper Mobile App so that
 * user resolution, role mapping and People properties stay identical across
 * platforms (same Mixpanel project, app = "web").
 */

export type MixpanelProfileLike = {
  _id?: string | null;
  id?: string | null;
  uid?: string | null;
  name?: string | null;
  email?: string | null;
  emailAddress?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  mobile?: string | null;
  roles?: unknown;
  role?: string | null;
  primaryRole?: string | null;
  location?: {
    city?: string | null;
    area?: string | null;
    locality?: string | null;
    state?: string | null;
  } | null;
  createdAt?: string | Date | null;
};

export type MixpanelRole = 'Customer' | 'Helper' | 'Partner';

let identifiedSessionUserId: string | null = null;

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeUserIdentifier(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized ? normalized : null;
}

export function resolveMixpanelUserId(
  profile: MixpanelProfileLike | null | undefined,
  firebaseUid?: string | null,
): string | null {
  const candidates = [
    profile?._id,
    profile?.id,
    profile?.uid,
    firebaseUid,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeUserIdentifier(candidate);
    if (normalized) return normalized;
  }

  return null;
}

export function resolveMixpanelRole(
  roles?: unknown,
  role?: unknown,
  primaryRole?: unknown,
): MixpanelRole {
  const normalizedRoles = Array.isArray(roles)
    ? roles.map((value) => String(value || '').trim().toLowerCase()).filter(Boolean)
    : [];
  const roleValues = [
    normalizeString(role),
    normalizeString(primaryRole),
    ...normalizedRoles,
  ].filter(Boolean) as string[];

  const normalized = roleValues.map((value) => value.trim().toLowerCase());

  if (normalized.some((value) => value === 'partner')) return 'Partner';
  if (
    normalized.some((value) =>
      ['tasker', 'performer', 'helper', 'both'].includes(value),
    )
  ) {
    return 'Helper';
  }
  if (
    normalized.some((value) =>
      ['poster', 'requester', 'customer', 'both'].includes(value),
    )
  ) {
    return 'Customer';
  }

  return 'Customer';
}

export function buildMixpanelPeopleProperties(
  profile: MixpanelProfileLike | null | undefined,
  role: MixpanelRole,
): Record<string, unknown> {
  const city =
    normalizeString(profile?.location?.city) ||
    normalizeString(profile?.location?.area) ||
    normalizeString(profile?.location?.locality) ||
    normalizeString(profile?.location?.state);

  const props: Record<string, unknown> = {
    $name: normalizeString(profile?.name),
    $email: normalizeString(profile?.email) || normalizeString(profile?.emailAddress),
    phone: normalizeString(profile?.phone) || normalizeString(profile?.phoneNumber) || normalizeString(profile?.mobile),
    role,
    city,
  };

  Object.keys(props).forEach((key) => {
    if (props[key] === null || props[key] === undefined) delete props[key];
  });

  return props;
}

export function shouldIdentifyMixpanelUser(userId: string | null): boolean {
  if (!userId) return false;
  if (!identifiedSessionUserId) return true;
  return identifiedSessionUserId !== userId;
}

export function markMixpanelUserIdentified(userId: string | null): void {
  identifiedSessionUserId = userId;
}

export function clearMixpanelIdentitySession(): void {
  identifiedSessionUserId = null;
}
