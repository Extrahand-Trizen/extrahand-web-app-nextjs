/**
 * Dev-only: LOCAL_TEST dummy signin/signup (no Firebase/reCAPTCHA).
 * When NEXT_PUBLIC_LOCAL_TEST=true and on localhost: phone +91 9876543210, OTP 123456.
 */

const DUMMY_PHONE_LAST10 = "9876543210";
export const DUMMY_OTP = "123456";

function getLocalTestEnabled(): boolean {
   if (typeof process === "undefined") return false;
   const v = process.env.NEXT_PUBLIC_LOCAL_TEST;
   return v === "true" || v === "1";
}

export function isLocalhost(): boolean {
   if (typeof window === "undefined") return false;
   const h = window.location.hostname;
   return h === "localhost" || h === "127.0.0.1";
}

/** True when LOCAL_TEST is on and we're on localhost (dummy flow allowed). */
export function isLocalTestMode(): boolean {
   return getLocalTestEnabled() && isLocalhost();
}

export function isTestPhone(phone: string): boolean {
   if (!phone) return false;
   const digits = phone.replace(/\D/g, "");
   const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
   return last10 === DUMMY_PHONE_LAST10;
}

/** Use dummy OTP flow (skip Firebase send/verify) when in local test mode and phone matches. */
export function useDevOtp(): boolean {
   return isLocalTestMode();
}
