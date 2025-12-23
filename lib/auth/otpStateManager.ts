/**
 * OTP State Manager for Web App
 * Manages OTP session state in localStorage (similar to mobile app's AsyncStorage)
 */

const OTP_SESSION_KEY = 'extrahand_otp_session';
const OTP_INPUT_KEY = '@extrahand_otp_input';
const MAX_SESSION_AGE = 5 * 60 * 1000; // 5 minutes

export interface OTPSession {
  phone: string;
  mode: 'login' | 'signup';
  timestamp: number;
  verificationId?: string; // Optional, if storing Firebase verification ID
}

export interface OTPInput {
  otp: string[]; // Array of 6 strings
}

class OTPStateManager {
  /**
   * Save OTP session to localStorage
   */
  saveOTPSession(session: OTPSession): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
      console.log('💾 [OTPStateManager] Session saved:', session);
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to save session:', error);
    }
  }

  /**
   * Get OTP session from localStorage
   */
  getOTPSession(): OTPSession | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const stored = localStorage.getItem(OTP_SESSION_KEY);
      if (!stored) return null;
      
      const session = JSON.parse(stored) as OTPSession;
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearOTPSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to get session:', error);
      return null;
    }
  }

  /**
   * Clear OTP session from localStorage
   */
  clearOTPSession(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem(OTP_SESSION_KEY);
      console.log('🗑️ [OTPStateManager] Session cleared');
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to clear session:', error);
    }
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(session: OTPSession): boolean {
    const sessionAge = Date.now() - session.timestamp;
    return sessionAge >= MAX_SESSION_AGE;
  }

  /**
   * Save OTP input state
   */
  saveOTPInput(otp: string[]): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem(OTP_INPUT_KEY, JSON.stringify({ otp }));
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to save OTP input:', error);
    }
  }

  /**
   * Get OTP input state
   */
  getOTPInput(): string[] | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const stored = localStorage.getItem(OTP_INPUT_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored) as OTPInput;
      return data.otp;
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to get OTP input:', error);
      return null;
    }
  }

  /**
   * Clear OTP input state
   */
  clearOTPInput(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem(OTP_INPUT_KEY);
    } catch (error) {
      console.warn('⚠️ [OTPStateManager] Failed to clear OTP input:', error);
    }
  }

  /**
   * Clear all OTP-related state
   */
  clearAll(): void {
    this.clearOTPSession();
    this.clearOTPInput();
  }
}

export const otpStateManager = new OTPStateManager();


