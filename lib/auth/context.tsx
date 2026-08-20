"use client";

/**
 * Authentication Context
 * Manages user authentication state and profile data
 */

import React, {
   createContext,
   useContext,
   useEffect,
   useState,
   useCallback,
   useMemo,
   useRef,
} from "react";
import type { User } from "firebase/auth";
import { api } from "@/lib/api";
import { sessionsApi } from "@/lib/api/endpoints/sessions";
import { sessionManager } from "./session";
import { otpStateManager } from "./otpStateManager";
import { isOTPAuthInProgress } from "./authFlowState";
import { UserProfile } from "@/types/user";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/state/userStore";
import { shouldAttachFirebaseAuth, isFirebaseAuthRoute } from "@/lib/thirdParty/scriptPolicy";

interface AuthContextType {
   currentUser: User | null;
   userData: UserProfile | null;
   loading: boolean;
   refreshUserData: () => Promise<void>;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isDeletedProfileError(error: any): boolean {
   const message = String(
      error?.data?.error || error?.message || ""
   ).toLowerCase();

   return (
      message.includes("profile is no longer available") ||
      message.includes("account is already deleted") ||
      message.includes("account deleted")
   );
}

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [userData, setUserData] = useState<UserProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const prevUserRef = useRef<string | null>(null);
   const fetchingProfileRef = useRef(false); // Prevent concurrent api.me() calls
   const pathname = usePathname();
   const storeLogin = useUserStore((state) => state.login);
   const storeLogout = useUserStore((state) => state.logout);
   const hydrateFromSession = useUserStore((state) => state.hydrateFromSession);
   const firebaseAttachedRef = useRef(false);

   const resetLocalSession = useCallback(async () => {
      const { auth: firebaseAuth } = await import("./firebase");
      if (firebaseAuth) {
         try {
            const { signOut } = await import("firebase/auth");
            await signOut(firebaseAuth);
         } catch (error) {
            console.warn("signOut skipped", error);
         }
      }
      // Clear all session data including localStorage, sessionStorage, and cookies
      if (typeof window !== "undefined") {
         sessionManager.clearSession();
         otpStateManager.clearAll();
         
         const sessionStorageKeys = [
            "taskCreationContext",
            "postAuthRedirectTo",
            "pendingReferralCode",
            "pendingPosterLocationText",
         ];
         sessionStorageKeys.forEach((key) => {
            try {
               sessionStorage.removeItem(key);
            } catch (e) {
               console.warn(`Failed to remove sessionStorage key "${key}":`, e);
            }
         });
         
         const cookies = ["extrahand_auth", "extrahand_redirect_to"];
         cookies.forEach((cookieName) => {
            try {
               document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
               document.cookie = `${cookieName}=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
            } catch (e) {
               console.warn(`Failed to clear cookie "${cookieName}":`, e);
            }
         });
      }
      storeLogout();
      setCurrentUser(null);
      setUserData(null);
      prevUserRef.current = null;
   }, [storeLogout]);

   // Helper function to clear all session data (localStorage, sessionStorage, and cookies)
   const clearAllSessionData = useCallback(() => {
      try {
         if (typeof window === "undefined") return;

         // Clear localStorage
         sessionManager.clearSession();
         
         // Clear OTP state
         otpStateManager.clearAll();
         
         // Clear all sessionStorage data to remove temporary auth and task data
         const sessionStorageKeys = [
            "taskCreationContext",
            "postAuthRedirectTo",
            "pendingReferralCode",
            "pendingPosterLocationText",
         ];
         sessionStorageKeys.forEach((key) => {
            try {
               sessionStorage.removeItem(key);
            } catch (e) {
               console.warn(`Failed to remove sessionStorage key "${key}":`, e);
            }
         });

         // Clear all auth cookies with proper path and domain settings
         const cookies = [
            "extrahand_auth",
            "extrahand_redirect_to",
         ];
         cookies.forEach((cookieName) => {
            try {
               // Clear cookie with various path/domain combinations to ensure it's deleted
               document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
               document.cookie = `${cookieName}=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
            } catch (e) {
               console.warn(`Failed to clear cookie "${cookieName}":`, e);
            }
         });

         // Clear Zustand store
         storeLogout();

         console.log("🗑️ All session data cleared (localStorage, sessionStorage, OTP state, cookies)");
      } catch (error) {
         console.error("Error clearing session data:", error);
      }
   }, [storeLogout]);

   // With HttpOnly cookies, we can't inspect tokens in JS. Assume backend session
   // exists after login and let API calls prove otherwise.
   const hasBackendSession = useCallback(() => true, []);

   const refreshUserData = useCallback(async () => {
      const hasAuthCookie =
         typeof document !== "undefined" &&
         document.cookie.split("; ").some((c) => c.startsWith("extrahand_auth=1"));

      if (currentUser || hasAuthCookie) {
         try {
            console.log("🔄 Refreshing user data from backend API...");
            const userData = await api.me();
            setUserData(userData);
            storeLogin({ user: userData });

            // Ensure the lightweight auth cookie is present so middleware
            // immediately treats the user as authenticated on all routes.
            try {
               if (typeof document !== "undefined") {
                  const hasCookie = document.cookie
                     .split("; ")
                     .some((c) => c.startsWith("extrahand_auth=1"));
                  if (!hasCookie) {
                     const maxAge = 30 * 24 * 60 * 60; // 30 days
                     document.cookie = `extrahand_auth=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
                  }
               }
            } catch {
               // Best-effort only; don't block login on cookie issues
            }

            // Save session data
            sessionManager.saveSession({
               isAuthenticated: true,
               lastRoute: sessionManager.getLastRoute()?.route || "Landing",
            });

            console.log("✅ User data refreshed successfully:", userData);
         } catch (error: any) {
            console.warn("❌ Failed to refresh user data:", error.message);
            if (error?.status === 401 || isDeletedProfileError(error)) {
               resetLocalSession();
            }
         }
      }
   }, [currentUser, hasBackendSession, resetLocalSession, storeLogin]);

   const logout = useCallback(async () => {
      try {
         console.log("🚪 Logging out user...");

         // Mixpanel: log the logout and reset identity so the next session is fresh
         void import("@/lib/services/mixpanel").then((mixpanel) => {
            mixpanel.trackLogoutInitiated();
            mixpanel.mixpanelReset();
         });

         const { auth: firebaseAuth } = await import("./firebase");
         await Promise.allSettled([
            sessionsApi.logout(),
            firebaseAuth
               ? import("firebase/auth").then(({ signOut }) => signOut(firebaseAuth))
               : Promise.resolve(),
         ]);

         // Clear all session and storage data
         clearAllSessionData();

         // Clear user state
         setCurrentUser(null);
         setUserData(null);

         console.log("✅ Logout successful");

         // Force a clean reload so any in-memory state or cached client data
         // is reset and the app boots in a fully signed-out state.
         if (typeof window !== "undefined") {
            window.location.href = "/";
         }
      } catch (error) {
         console.error("❌ Logout error:", error);
         // Even if Firebase signOut fails, clear all local session data
         clearAllSessionData();
         setCurrentUser(null);
         setUserData(null);
      }
   }, [storeLogout]);

   // Mixpanel: identify the user as soon as a signed-in profile is available
   // (covers sign-up, login, session restore and profile refresh). Guarded
   // inside mixpanelIdentify so it fires once per session per user.
   useEffect(() => {
      if (!userData?.uid) return;
      void import("@/lib/services/mixpanel").then(({ mixpanelIdentify }) => {
         mixpanelIdentify(userData.uid, {
            _id: userData._id,
            uid: userData.uid,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            roles: userData.roles as string[] | undefined,
            createdAt: userData.createdAt,
            location: userData.location,
         });
      });
   }, [userData]);

   useEffect(() => {
      hydrateFromSession();
   }, [hydrateFromSession]);

   useEffect(() => {
      if (typeof window === "undefined") {
         setLoading(false);
         return;
      }

      let cancelled = false;

      const restoreFromCookie = async () => {
         const hasAuthCookie = document.cookie
            .split("; ")
            .some((c) => c.startsWith("extrahand_auth=1"));

         if (!hasAuthCookie) {
            setLoading(false);
            return;
         }

         if (fetchingProfileRef.current) {
            setLoading(false);
            return;
         }

         try {
            fetchingProfileRef.current = true;
            const profile = await api.me();
            if (cancelled) return;
            setUserData(profile);
            storeLogin({ user: profile });
         } catch {
            // Cookie present but session invalid
         } finally {
            fetchingProfileRef.current = false;
            if (!cancelled) {
               setLoading(false);
            }
         }
      };

      void restoreFromCookie();
      return () => {
         cancelled = true;
      };
   }, [storeLogin]);

   useEffect(() => {
      if (typeof window === "undefined") return;
      if (firebaseAttachedRef.current) return;

      if (!shouldAttachFirebaseAuth(pathname)) return;

      firebaseAttachedRef.current = true;
      let cancelled = false;
      let unsubscribe: (() => void) | undefined;

      const attachFirebaseListener = () => {
         if (cancelled) return;
         void Promise.all([
            import("./firebase"),
            import("firebase/auth"),
         ]).then(([{ ensureFirebaseAuth }, { onAuthStateChanged }]) => {
            if (cancelled) return;
            const firebaseAuth = ensureFirebaseAuth();
            if (!firebaseAuth) return;

            unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            const currentUserId = user?.uid || null;

            if (currentUserId !== prevUserRef.current) {
               prevUserRef.current = currentUserId;

               if (user) {
                  setCurrentUser(user);

                  const existingSession = sessionManager.getSession();
                  if (
                     !existingSession.isAuthenticated ||
                     existingSession.lastActivity === undefined
                  ) {
                     sessionManager.saveSession({
                        isAuthenticated: true,
                        lastRoute:
                           sessionManager.getLastRoute()?.route || "Landing",
                     });
                  }

                  if (isOTPAuthInProgress()) {
                     return;
                  }

                  if (fetchingProfileRef.current) {
                     return;
                  }

                  try {
                     fetchingProfileRef.current = true;
                     const profile = await api.me();
                     setUserData(profile);
                     storeLogin({ user: profile });
                  } catch (error: any) {
                     console.warn(
                        "Backend API offline; proceeding without profile data:",
                        error.message
                     );
                     setUserData(null);
                     if (error?.status === 401 || isDeletedProfileError(error)) {
                        await resetLocalSession();
                        return;
                     }
                  } finally {
                     fetchingProfileRef.current = false;
                  }
               } else {
                  setCurrentUser(null);
               }
            }
            setLoading(false);
         });
         });
      };

      if (isFirebaseAuthRoute(pathname)) {
         attachFirebaseListener();
      } else if ("requestIdleCallback" in window) {
         window.requestIdleCallback(attachFirebaseListener, { timeout: 8000 });
      } else {
         window.setTimeout(attachFirebaseListener, 4000);
      }
      // Pathname only gates the first attach. Do not unsubscribe on route changes
      // or guests going / → /login would lose the listener, and marketing pages
      // would reload Firebase after login.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pathname, resetLocalSession, storeLogin]);

   // Memoize context value to prevent unnecessary re-renders
   const value: AuthContextType = useMemo(
      () => ({
         currentUser,
         userData,
         loading,
         refreshUserData,
         logout,
      }),
      [currentUser, userData, loading, refreshUserData, logout]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
