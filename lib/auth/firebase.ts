/**
 * Firebase initialization and configuration
 * Matches task-connect-relay Firebase setup
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   updateProfile,
   GoogleAuthProvider,
   signInWithPopup,
   RecaptchaVerifier,
   signInWithPhoneNumber,
   Auth,
} from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { FIREBASE_CONFIG } from "@/lib/config";

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
   // Only initialize if not already initialized
   if (getApps().length === 0) {
      app = initializeApp(FIREBASE_CONFIG);
   } else {
      app = getApps()[0];
   }

   auth = getAuth(app);

   // Initialize Analytics (only in browser environment)
   try {
      analytics = getAnalytics(app);
   } catch (e) {
      // Analytics not available
      console.warn("Analytics initialization failed:", e);
   }
} else {
   // Server-side: create minimal app instance
   if (getApps().length === 0) {
      app = initializeApp(FIREBASE_CONFIG);
   } else {
      app = getApps()[0];
   }
   auth = getAuth(app);
}

export { app, auth, analytics };

// Email/Password Sign Up
export const signUpWithEmail = async (
   email: string,
   password: string,
   userData: { name: string; role?: string; location?: any }
) => {
   try {
      const userCredential = await createUserWithEmailAndPassword(
         auth,
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
   try {
      const userCredential = await signInWithEmailAndPassword(
         auth,
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
   try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

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
   try {
      await signOut(auth);
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
   try {
      console.log("🔍 Attempting phone auth with:", {
         phoneNumber,
         projectId: FIREBASE_CONFIG.projectId,
         authDomain: FIREBASE_CONFIG.authDomain,
      });

      const confirmationResult = await signInWithPhoneNumber(
         auth,
         phoneNumber,
         recaptchaVerifier
      );
      console.log("✅ Phone auth successful");
      return { confirmationResult, success: true };
   } catch (error: any) {
      const errorCode = error?.code || "auth/unknown-error";
      const errorMessage = error?.message || "Failed to send OTP";

      console.error("❌ Phone auth failed:", {
         code: errorCode,
         message: errorMessage,
         error: error,
      });

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

      const verifier = new RecaptchaVerifier(auth, containerId, {
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
      await sendPasswordResetEmail(auth, email);
      return { success: true };
   } catch (error: any) {
      return { success: false, code: error.code, error: error.message };
   }
};

export default app;
