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
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { api } from "@/lib/api";
import { sessionsApi } from "@/lib/api/endpoints/sessions";
import { sessionManager } from "./session";
import { otpStateManager } from "./otpStateManager";
import { isOTPAuthInProgress } from "./authFlowState";
import { UserProfile } from "@/types/user";
import { useUserStore } from "@/lib/state/userStore";

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
   const [sessionRestored, setSessionRestored] = useState(false);
   const prevUserRef = useRef<string | null>(null);
   const fetchingProfileRef = useRef(false); // Prevent concurrent api.me() calls
   const storeLogin = useUserStore((state) => state.login);
   const storeLogout = useUserStore((state) => state.logout);
   const hydrateFromSession = useUserStore((state) => state.hydrateFromSession);

   const resetLocalSession = useCallback(async () => {
      try {
         await signOut(auth);
      } catch (error) {
         console.warn("signOut skipped", error);
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

         await Promise.allSettled([sessionsApi.logout(), signOut(auth)]);

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

   useEffect(() => {
      hydrateFromSession();
   }, [hydrateFromSession]);

   // Restore session on app start (client-side only)
   useEffect(() => {
      if (typeof window === "undefined") {
         setSessionRestored(true);
         setLoading(false);
         return;
      }

      const restoreSession = async () => {
         try {
            const session = sessionManager.getSession();
            console.log("🔍 Restoring session:", session);

            // Attempt to use Firebase auth state; API calls will validate cookies
            const user = auth.currentUser;
            if (user) {
               setCurrentUser(user);
               
               // Guard against concurrent api.me() calls
               if (fetchingProfileRef.current) {
                  console.log("⏭️ Skipping api.me() in restore - already fetching");
               } else {
                  try {
                     fetchingProfileRef.current = true;
                     const userData = await api.me();
                     setUserData(userData);
                     storeLogin({ user: userData });
                     console.log("✅ Session restored successfully");
                  } catch (error: any) {
                     console.warn(
                        "❌ Failed to restore user data:",
                        error.message
                     );
                     setUserData(null);
                     if (error?.status === 401 || isDeletedProfileError(error)) {
                        await resetLocalSession();
                     }
                  } finally {
                     fetchingProfileRef.current = false;
                  }
               }
            } else {
               // Cookie-only session (e.g. LOCAL_TEST dummy login): only try api.me() if we have the auth cookie
               // Otherwise we'd 401 and trigger redirect to login for every anonymous visitor
               const hasAuthCookie =
                  typeof document !== "undefined" &&
                  document.cookie.split("; ").some((c) => c.startsWith("extrahand_auth=1"));
               if (hasAuthCookie && !fetchingProfileRef.current) {
                  try {
                     fetchingProfileRef.current = true;
                     const userData = await api.me();
                     setUserData(userData);
                     storeLogin({ user: userData });
                     console.log("✅ Session restored from cookies (no Firebase user)");
                  } catch {
                     // No valid cookie session
                  } finally {
                     fetchingProfileRef.current = false;
                  }
               }
            }
         } catch (error) {
            console.warn("❌ Error restoring session:", error);
            await resetLocalSession();
         } finally {
            setSessionRestored(true);
            setLoading(false);
         }
      };

      restoreSession();
   }, [resetLocalSession, storeLogin]);

   useEffect(() => {
      if (!sessionRestored) return;
      if (typeof window === "undefined") return; // Only run on client

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         const currentUserId = user?.uid || null;

         // Only update if user actually changed
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

               // Skip api.me() if OTP auth is in progress (cookies not set yet)
               if (isOTPAuthInProgress()) {
                  console.log("⏭️ Skipping api.me() - OTP auth in progress, waiting for /complete to set cookies");
                  return;
               }

               // Guard against concurrent api.me() calls
               if (fetchingProfileRef.current) {
                  console.log("⏭️ Skipping api.me() - already fetching profile");
                  return;
               }

               try {
                  fetchingProfileRef.current = true;
                  const userData = await api.me();
                  setUserData(userData);
                  storeLogin({ user: userData });
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
               // Cookie-only session: only try api.me() if auth cookie present, to avoid 401 → redirect for anonymous users
               const hasAuthCookie =
                  typeof document !== "undefined" &&
                  document.cookie.split("; ").some((c) => c.startsWith("extrahand_auth=1"));
               if (hasAuthCookie) {
                  try {
                     const userData = await api.me();
                     setUserData(userData);
                     storeLogin({ user: userData });
                  } catch (e: any) {
                     if (e?.status === 401) {
                        prevUserRef.current = null;
                        setUserData(null);
                        sessionManager.clearSession();
                        storeLogout();
                     }
                  }
               }
            }
         }
         setLoading(false);
      });

      return unsubscribe;
   }, [
      hasBackendSession,
      resetLocalSession,
      sessionRestored,
      storeLogin,
      storeLogout,
   ]);

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
