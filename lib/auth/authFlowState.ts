/**
 * Auth Flow State
 * Coordinates auth state between OTP flow and AuthContext
 * 
 * This prevents the race condition where onAuthStateChanged tries to call
 * api.me() before the /complete endpoint has set the auth cookies.
 * 
 * Flow:
 * 1. OTP form sets flag before Firebase verification
 * 2. onAuthStateChanged fires but skips api.me() because flag is set
 * 3. /complete finishes and sets cookies
 * 4. OTP form directly calls refreshUserData() to get profile
 * 5. OTP form clears the flag
 * 
 * For page refreshes (session restoration), the flag is false, so
 * onAuthStateChanged will call api.me() normally.
 */

// Flag to indicate OTP authentication is in progress
let otpAuthInProgress = false;

/**
 * Set whether OTP auth is in progress
 * Call with true before Firebase OTP verification
 * Call with false after profile is loaded or on error
 */
export function setOTPAuthInProgress(inProgress: boolean): void {
  otpAuthInProgress = inProgress;
  if (typeof window !== 'undefined') {
    console.log(`🔐 OTP Auth in progress: ${inProgress}`);
  }
}

/**
 * Check if OTP auth is in progress
 * Used by AuthContext to skip premature api.me() calls
 */
export function isOTPAuthInProgress(): boolean {
  return otpAuthInProgress;
}
