export const CONSENT_COOKIE_NAME = "extrahand_cookie_consent";
export const CONSENT_STORAGE_KEY = "extrahand_cookie_consent";
export const CONSENT_CHANGE_EVENT = "extrahand-consent-change";
export const OPEN_CONSENT_PREFERENCES_EVENT = "extrahand-open-consent-preferences";

export type ConsentCategory = "analytics" | "maps";

export interface ConsentPreferences {
   analytics: boolean;
   maps: boolean;
   version: number;
   updatedAt: string;
}

const CONSENT_VERSION = 1;

const defaultPreferences = (): ConsentPreferences => ({
   analytics: false,
   maps: false,
   version: CONSENT_VERSION,
   updatedAt: new Date().toISOString(),
});

const isBrowser = (): boolean => typeof window !== "undefined";

const isLocalhost = (): boolean => {
   if (!isBrowser()) return false;
   const host = window.location.hostname;
   return host === "localhost" || host === "127.0.0.1";
};

const safeParse = (value: string | null): ConsentPreferences | null => {
   if (!value) return null;

   try {
      const parsed = JSON.parse(value) as Partial<ConsentPreferences>;
      return {
         analytics: Boolean(parsed.analytics),
         maps: Boolean(parsed.maps),
         version: Number(parsed.version) || CONSENT_VERSION,
         updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
   } catch {
      return null;
   }
};

const readCookie = (name: string): string | null => {
   if (!isBrowser()) return null;

   const entry = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`));

   return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : null;
};

const writeCookie = (name: string, value: string): void => {
   if (!isBrowser()) return;

   const maxAge = 60 * 60 * 24 * 365;
   document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
};

const emitConsentChange = (): void => {
   if (!isBrowser()) return;

   window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
};

export const getConsentPreferences = (): ConsentPreferences | null => {
   if (!isBrowser()) return null;

   if (isLocalhost()) {
      return safeParse(window.sessionStorage.getItem(CONSENT_STORAGE_KEY));
   }

   return (
      safeParse(window.localStorage.getItem(CONSENT_STORAGE_KEY)) ||
      safeParse(readCookie(CONSENT_COOKIE_NAME))
   );
};

export const hasConsentDecision = (): boolean => Boolean(getConsentPreferences());

export const hasConsentFor = (category: ConsentCategory): boolean => {
   const preferences = getConsentPreferences();
   return Boolean(preferences?.[category]);
};

export const saveConsentPreferences = (
   preferences: Pick<ConsentPreferences, "analytics" | "maps">
): ConsentPreferences => {
   const nextPreferences: ConsentPreferences = {
      analytics: Boolean(preferences.analytics),
      maps: Boolean(preferences.maps),
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
   };

   if (isBrowser()) {
      const serialized = JSON.stringify(nextPreferences);

      if (isLocalhost()) {
         window.sessionStorage.setItem(CONSENT_STORAGE_KEY, serialized);
         window.localStorage.removeItem(CONSENT_STORAGE_KEY);
         document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
      } else {
         window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
         writeCookie(CONSENT_COOKIE_NAME, serialized);
      }

      emitConsentChange();
   }

   return nextPreferences;
};

export const updateConsentPreference = (
   category: ConsentCategory,
   value: boolean
): ConsentPreferences => {
   const current = getConsentPreferences() || defaultPreferences();
   const nextPreferences: ConsentPreferences = {
      ...current,
      [category]: Boolean(value),
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
   };

   if (isBrowser()) {
      const serialized = JSON.stringify(nextPreferences);

      if (isLocalhost()) {
         window.sessionStorage.setItem(CONSENT_STORAGE_KEY, serialized);
         window.localStorage.removeItem(CONSENT_STORAGE_KEY);
         document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
      } else {
         window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
         writeCookie(CONSENT_COOKIE_NAME, serialized);
      }

      emitConsentChange();
   }

   return nextPreferences;
};

export const clearConsentPreferences = (): void => {
   if (!isBrowser()) return;

   window.sessionStorage.removeItem(CONSENT_STORAGE_KEY);
   window.localStorage.removeItem(CONSENT_STORAGE_KEY);
   document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
   emitConsentChange();
};