/**
 * Phone Authentication utilities
 * Handles OTP sending and verification
 */

import { setupRecaptcha, signInWithPhone, verifyOTP } from "./firebase";

type SendResult = {
   confirmation?: any;
   success: boolean;
   error?: string;
   code?: string;
};
type VerifyResult = {
   user?: any;
   success: boolean;
   error?: string;
   code?: string;
};

async function webSend(phone: string): Promise<SendResult> {
   try {
      // Ensure we're in browser environment
      if (typeof window === "undefined" || typeof document === "undefined") {
         throw new Error(
            "Phone authentication is only available in browser environment"
         );
      }

      const containerId = "recaptcha-container";

      // Ensure container exists and is visible
      let container = document.getElementById(containerId);
      if (!container) {
         container = document.createElement("div");
         container.id = containerId;
         if (container.style) {
            container.style.cssText =
               "position:fixed;bottom:8px;left:8px;z-index:9999;width:0;height:0;overflow:hidden;";
         }
         if (document.body) {
            document.body.appendChild(container);
         } else {
            // Wait for body to be available
            await new Promise<void>((resolve) => {
               if (document.body) {
                  resolve();
                  return;
               }
               const observer = new MutationObserver(() => {
                  if (document.body) {
                     observer.disconnect();
                     resolve();
                  }
               });
               observer.observe(document.documentElement, { childList: true });

               // Timeout after 5 seconds
               setTimeout(() => {
                  observer.disconnect();
                  resolve();
               }, 5000);
            });
            if (document.body) {
               document.body.appendChild(container);
            } else {
               throw new Error(
                  "Unable to create reCAPTCHA container: document.body not available"
               );
            }
         }
      } else {
         // Container exists - CRITICAL: Clear it completely before reusing
         // This prevents "reCAPTCHA has already been rendered" error
         container.innerHTML = "";

         // Remove and recreate to ensure clean state
         const parent = container.parentNode;
         if (parent) {
            parent.removeChild(container);
         }

         // Create fresh container
         container = document.createElement("div");
         container.id = containerId;
         if (container.style) {
            container.style.cssText =
               "position:fixed;bottom:8px;left:8px;z-index:9999;width:0;height:0;overflow:hidden;";
         }
         if (document.body) {
            document.body.appendChild(container);
         }
      }

      console.log("Setting up reCAPTCHA with container:", containerId);

      // Clear any existing reCAPTCHA widgets globally
      if (
         (window as any).grecaptcha &&
         typeof (window as any).grecaptcha.reset === "function"
      ) {
         try {
            (window as any).grecaptcha.reset();
         } catch (e) {
            console.log("No existing reCAPTCHA to reset");
         }
      }

      const verifier = setupRecaptcha(containerId, {
         size: "invisible",
         callback: () => {
            console.log("reCAPTCHA callback triggered");
         },
         "expired-callback": () => {
            console.log("reCAPTCHA expired");
         },
         "error-callback": (error: any) => {
            console.error("reCAPTCHA error:", error);
         },
      });

      console.log("Rendering reCAPTCHA...");

      try {
         // @ts-ignore
         if (verifier.render && typeof verifier.render === "function") {
            await verifier.render();
            console.log("✅ reCAPTCHA rendered successfully");
         }
      } catch (renderError: any) {
         // If already rendered error, remove container completely and recreate
         if (renderError?.message?.includes("already been rendered")) {
            console.log(
               "⚠️ reCAPTCHA already rendered, removing container and recreating..."
            );

            // Remove container completely
            const existingContainer = document.getElementById(containerId);
            if (existingContainer && existingContainer.parentNode) {
               existingContainer.parentNode.removeChild(existingContainer);
            }

            // Wait a bit
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Create new container
            const newContainer = document.createElement("div");
            newContainer.id = containerId;
            if (newContainer.style) {
               newContainer.style.cssText =
                  "position:fixed;bottom:8px;left:8px;z-index:9999;width:0;height:0;overflow:hidden;";
            }
            if (document.body) {
               document.body.appendChild(newContainer);
            }

            // Create new verifier with new container
            const newVerifier = setupRecaptcha(containerId, {
               size: "invisible",
               callback: () => {
                  console.log("reCAPTCHA callback triggered");
               },
               "expired-callback": () => {
                  console.log("reCAPTCHA expired");
               },
               "error-callback": (error: any) => {
                  console.error("reCAPTCHA error:", error);
               },
            });

            // Render new verifier
            // @ts-ignore
            if (newVerifier.render) {
               await newVerifier.render();
            }

            // Use new verifier for phone auth
            console.log("Sending OTP for phone:", phone);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const res: any = await signInWithPhone(phone, newVerifier);
            return handlePhoneAuthResponse(res);
         } else {
            throw renderError;
         }
      }

      console.log("Sending OTP for phone:", phone);

      // Add a small delay to ensure reCAPTCHA is fully ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res: any = await signInWithPhone(phone, verifier);
      return handlePhoneAuthResponse(res);
   } catch (e: any) {
      console.error("webSend error:", e);
      const errorMessage = e?.message || "Failed to send OTP";
      const errorCode = e?.code || "auth/unknown-error";

      // Check if it's a reCAPTCHA configuration error
      if (
         errorCode === "auth/invalid-app-credential" ||
         errorMessage.includes("reCAPTCHA")
      ) {
         return {
            success: false,
            error: `reCAPTCHA configuration issue. Please check Firebase console settings.\n\nError: ${errorMessage}`,
            code: errorCode,
         };
      }

      return { success: false, error: errorMessage, code: errorCode };
   }
}

// Helper function to handle phone auth response
function handlePhoneAuthResponse(res: any): SendResult {
   console.log("signInWithPhone result:", res);

   if (res?.success) {
      console.log(
         "OTP sent successfully, confirmation result:",
         res.confirmationResult
      );
      return { confirmation: res.confirmationResult, success: true };
   }

   // Handle specific reCAPTCHA errors (domain not authorized in Firebase Console)
   if (res?.code === "auth/invalid-app-credential") {
      const currentOrigin =
         typeof window !== "undefined" ? window.location.origin : "unknown";
      console.error(
         "Firebase auth/invalid-app-credential: Add this origin to Authorized domains:",
         currentOrigin
      );

      const currentDomain =
         typeof window !== "undefined" ? window.location.hostname : "unknown";
      const currentPort =
         typeof window !== "undefined" ? window.location.port : "";
      const fullOrigin =
         typeof window !== "undefined" ? window.location.origin : "unknown";

      const errorMessage = `Firebase authentication configuration error.

reCAPTCHA was solved successfully, but Firebase rejected the request.

Current origin: ${fullOrigin}
Current domain: ${currentDomain}${currentPort ? `:${currentPort}` : ""}

This usually means:
1. Domain not authorized in Firebase Console
2. API key restrictions blocking the request
3. reCAPTCHA domain verification failed

FIX STEPS:
1. Firebase Console → Authentication → Settings → Authorized domains
   ✓ Add: localhost
   ✓ Add: 127.0.0.1
   ✓ Add: ${currentDomain}${currentPort ? `:${currentPort}` : ""}
   ✓ Add your production domain

2. Google Cloud Console → APIs & Services → Credentials
   ✓ Find your Firebase API key (starts with AIza...)
   ✓ Click on it to edit
   ✓ Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add referrers:
       * localhost:*
       * 127.0.0.1:*
       * ${currentDomain}:*
       * Your production domain:*
   ✓ Save changes

3. Firebase Console → Authentication → Settings → reCAPTCHA
   ✓ Ensure reCAPTCHA v2 is enabled
   ✓ Check that domains are listed

Error Code: ${res?.code}`;

      return {
         success: false,
         error: errorMessage,
         code: res?.code,
      };
   }

   // Handle rate limiting
   if (res?.code === "auth/too-many-requests") {
      console.error("Rate limit exceeded for this phone number.");

      const errorMessage = `Too many OTP requests for this phone number.
      
Please wait 5 minutes before trying again, or use a different phone number for testing.

Error Code: ${res?.code}`;

      return {
         success: false,
         error: errorMessage,
         code: res?.code,
      };
   }

   console.error("Failed to send OTP:", res);
   return {
      success: false,
      error: res?.error || "Failed to send OTP. Please try again.",
      code: res?.code || "auth/unknown-error",
   };
}

async function webVerify(
   confirmation: any,
   code: string
): Promise<VerifyResult> {
   try {
      const res: any = await verifyOTP(confirmation, code);
      if (res?.success) return { user: res.user, success: true };
      return { success: false, error: res?.error, code: res?.code };
   } catch (e: any) {
      return { success: false, error: e?.message, code: e?.code };
   }
}

export async function sendOTP(phone: string): Promise<SendResult> {
   return webSend(phone);
}

export async function confirmOTP(
   confirmation: any,
   code: string
): Promise<VerifyResult> {
   return webVerify(confirmation, code);
}
