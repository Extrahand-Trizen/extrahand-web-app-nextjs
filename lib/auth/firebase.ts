/**
 * Firebase initialization and configuration
 * Matches task-connect-relay Firebase setup
 */

import type { FirebaseApp } from "firebase/app";
import type { Auth, RecaptchaVerifier } from "firebase/auth";
import { FIREBASE_CONFIG } from "@/lib/config";
import { getScriptTier } from "@/lib/thirdParty/scriptPolicy";

// Initialize Firebase only when config is present. Local development may not have
// the Firebase public keys populated yet, and the app should still render the page.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
const isFirebaseConfigured = Boolean(
   FIREBASE_CONFIG.apiKey &&
   FIREBASE_CONFIG.authDomain &&
   FIREBASE_CONFIG.projectId
);

export function ensureFirebaseApp(): FirebaseApp | null {
   if (app) return app;
   if (!isFirebaseConfigured) return null;

   try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { initializeApp, getApps } = require("firebase/app");
      if (getApps().length === 0) {
         app = initializeApp(FIREBASE_CONFIG);
      } else {
         app = getApps()[0];
      }
      return app;
   } catch {
      return null;
   }
}

/** Call this only when auth is needed. getAuth() injects firebaseapp.com/__/auth/iframe.js. */
export function ensureFirebaseAuth(): Auth | null {
   if (auth) return auth;
   const firebaseApp = ensureFirebaseApp();
   if (!firebaseApp) return null;

   try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAuth } = require("firebase/auth");
      auth = getAuth(firebaseApp);

      if (typeof window !== "undefined" && getScriptTier(window.location.pathname) !== "marketing") {
         void import("./firebase-analytics").then(({ initializeAnalyticsIfConsented }) => {
            initializeAnalyticsIfConsented(firebaseApp);
         });
      }

      return auth;
   } catch {
      return null;
   }
}

if (!isFirebaseConfigured) {
   console.warn(
      "Firebase auth is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID to enable sign-in."
   );
}

export { app, auth };

// Email/Password Sign Up
export const signUpWithEmail = async (
   email: string,
   password: string,
   userData: { name: string; role?: string; location?: any }
) => {
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      return {
         error: "Firebase is not configured in this environment.",
         code: "config/missing",
         success: false,
      };
   }

   try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const userCredential = await createUserWithEmailAndPassword(
         currentAuth,
         email,
         password
      );
      const user = userCredential.user;

      // Update user profile (displayName)
      try {
         await updateProfile(user, { displayName: userData.name });
      } catch (error) {
         console.warn("Failed to update profile:", error);
      }

      return { user, success: true };
   } catch (error: any) {
      return { error: error.message, code: error.code, success: false };
   }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      return {
         error: "Firebase is not configured in this environment.",
         code: "config/missing",
         success: false,
      };
   }

   try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const userCredential = await signInWithEmailAndPassword(
         currentAuth,
         email,
         password
      );
      return {
         user: userCredential.user,
         userData: null, // Will be fetched by AuthContext from backend API
         success: true,
      };
   } catch (error: any) {
      console.error("❌ Sign in failed:", error.code, error.message);
      return { error: error.message, code: error.code, success: false };
   }
};

// Google Sign In
export const signInWithGoogle = async () => {
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      return {
         error: "Firebase is not configured in this environment.",
         code: "config/missing",
         success: false,
      };
   }

   try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(currentAuth, provider);

      return {
         user: result.user,
         userData: null, // Will be fetched by AuthContext from backend API
         success: true,
      };
   } catch (error: any) {
      return { error: error.message, code: error.code, success: false };
   }
};

// Sign Out
export const signOutUser = async () => {
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      return { success: true };
   }

   try {
      const { signOut } = await import("firebase/auth");
      await signOut(currentAuth);
      return { success: true };
   } catch (error: any) {
      return { error: error.message, code: error.code, success: false };
   }
};

// Phone Number Sign In (OTP)
export const signInWithPhone = async (
   phoneNumber: string,
   recaptchaVerifier: RecaptchaVerifier
) => {
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      const msg =
         "Firebase config missing: set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env";
      console.error("❌ Phone auth failed:", { code: "config/missing", message: msg });
      return { error: msg, code: "config/missing", success: false };
   }

   try {
      // Fail fast if Firebase config is missing (avoids cryptic errors)
      if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.authDomain) {
         const msg =
            "Firebase config missing: set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in .env";
         console.error("❌ Phone auth failed:", { code: "config/missing", message: msg });
         return { error: msg, code: "config/missing", success: false };
      }

      const currentOrigin =
         typeof window !== "undefined" ? window.location.origin : "unknown";
      console.log("🔍 Attempting phone auth with:", {
         phoneNumber,
         projectId: FIREBASE_CONFIG.projectId,
         authDomain: FIREBASE_CONFIG.authDomain,
         currentOrigin,
      });

      const { signInWithPhoneNumber } = await import("firebase/auth");
      const confirmationResult = await signInWithPhoneNumber(
         currentAuth,
         phoneNumber,
         recaptchaVerifier
      );
      console.log("✅ Phone auth successful");
      return { confirmationResult, success: true };
   } catch (error: any) {
      // Firebase AuthError properties may be non-enumerable; extract explicitly so console shows real values (not {})
      const errorCode = error?.code || "auth/unknown-error";
      const errorMessage = error?.message || "Failed to send OTP";
      const errorName = error?.name;
      const errorStr = error ? String(error) : "unknown";

      console.error("❌ Phone auth failed:", {
         code: errorCode,
         message: errorMessage,
         name: errorName,
         raw: errorStr,
      });

      // Provide helpful error message for invalid-app-credential (domain not in Firebase Authorized domains)
      if (errorCode === "auth/invalid-app-credential") {
         const origin = typeof window !== "undefined" ? window.location.origin : "unknown";
         const fixHint = `Add "${origin}" (and localhost / 127.0.0.1 for dev) in Firebase Console → Authentication → Settings → Authorized domains.`;
         console.error("Firebase auth/invalid-app-credential:", fixHint);
         return {
            error: `This domain is not authorized for sign-in. ${fixHint}`,
            code: errorCode,
            success: false,
         };
      }

      return {
         error: errorMessage,
         code: errorCode,
         success: false,
      };
   }
};

// Verify OTP
export const verifyOTP = async (
   confirmationResult: any,
   verificationCode: string
) => {
   if (!ensureFirebaseAuth()) {
      return {
         error: "Firebase is not configured in this environment.",
         code: "config/missing",
         success: false,
      };
   }

   try {
      const result = await confirmationResult.confirm(verificationCode);

      return {
         user: result.user,
         userData: null, // Will be fetched by AuthContext from backend API
         success: true,
      };
   } catch (error: any) {
      return { error: error.message, code: error.code, success: false };
   }
};

// Setup Recaptcha for Phone Auth
export const setupRecaptcha = (containerId: string, options: any = {}) => {
   console.log("Creating RecaptchaVerifier for container:", containerId);
   const currentAuth = ensureFirebaseAuth();
   if (!currentAuth) {
      throw new Error("Firebase is not configured in this environment.");
   }

   try {
      // Clear any existing reCAPTCHA
      if (
         typeof window !== "undefined" &&
         (window as any).grecaptcha &&
         (window as any).grecaptcha.reset
      ) {
         try {
            (window as any).grecaptcha.reset();
         } catch (e) {
            console.log("No existing reCAPTCHA to reset");
         }
      }

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { RecaptchaVerifier: FirebaseRecaptchaVerifier } = require("firebase/auth");
      const verifier = new FirebaseRecaptchaVerifier(currentAuth, containerId, {
         size: "invisible",
         callback: (response: any) => {
            console.log("✅ reCAPTCHA solved:", response);
            if (options.callback) options.callback(response);
         },
         "expired-callback": () => {
            console.log("⚠️ reCAPTCHA expired");
            if (options["expired-callback"]) options["expired-callback"]();
         },
         "error-callback": (error: any) => {
            console.error("❌ reCAPTCHA error:", error);
            if (options["error-callback"]) options["error-callback"](error);
         },
      });

      console.log("✅ RecaptchaVerifier created successfully");
      return verifier;
   } catch (error) {
      console.error("❌ Failed to create RecaptchaVerifier:", error);
      throw error;
   }
};

// Reset Password
export const resetPassword = async (email: string) => {
   try {
      const currentAuth = ensureFirebaseAuth();
      if (!currentAuth) {
         return { success: false, code: "config/missing", error: "Firebase is not configured." };
      }
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(currentAuth, email);
      return { success: true };
   } catch (error: any) {
      return { success: false, code: error.code, error: error.message };
   }
};

export default app;
