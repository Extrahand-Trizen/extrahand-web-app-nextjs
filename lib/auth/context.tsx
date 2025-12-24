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
   const storeLogin = useUserStore((state) => state.login);
   const storeLogout = useUserStore((state) => state.logout);
   const hydrateFromSession = useUserStore((state) => state.hydrateFromSession);

   const resetLocalSession = useCallback(async () => {
      try {
         await signOut(auth);
      } catch (error) {
         console.warn("signOut skipped", error);
      }
      sessionManager.clearSession();
      storeLogout();
      setCurrentUser(null);
      setUserData(null);
      prevUserRef.current = null;
   }, [storeLogout]);

   // With HttpOnly cookies, we can't inspect tokens in JS. Assume backend session
   // exists after login and let API calls prove otherwise.
   const hasBackendSession = useCallback(() => true, []);

   const refreshUserData = useCallback(async () => {
      if (currentUser) {
         try {
            console.log("🔄 Refreshing user data from backend API...");
            const userData = await api.me();
            setUserData(userData);
            storeLogin({ user: userData });

            // Save session data
            sessionManager.saveSession({
               isAuthenticated: true,
               lastRoute: sessionManager.getLastRoute()?.route || "Landing",
            });

            console.log("✅ User data refreshed successfully:", userData);
         } catch (error: any) {
            console.warn("❌ Failed to refresh user data:", error.message);
            if (error?.status === 401) {
               resetLocalSession();
            }
         }
      }
   }, [currentUser, hasBackendSession, resetLocalSession, storeLogin]);

   const logout = useCallback(async () => {
      try {
         console.log("🚪 Logging out user...");

         await Promise.allSettled([sessionsApi.logout(), signOut(auth)]);

         // Clear session data
         sessionManager.clearSession();
         storeLogout();

         // Clear user state
         setCurrentUser(null);
         setUserData(null);

         console.log("✅ Logout successful");
      } catch (error) {
         console.error("❌ Logout error:", error);
         // Even if Firebase signOut fails, clear local session
         sessionManager.clearSession();
         storeLogout();
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
               try {
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
                  if (error?.status === 401) {
                     await resetLocalSession();
                  }
               }
            } else {
               console.log(
                  "⏳ Firebase auth not ready yet; waiting for onAuthStateChanged"
               );
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
   }, [resetLocalSession]);

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

               try {
                  const userData = await api.me();
                  setUserData(userData);
                  storeLogin({ user: userData });
               } catch (error: any) {
                  console.warn(
                     "Backend API offline; proceeding without profile data:",
                     error.message
                  );
                  setUserData(null);
                  if (error?.status === 401) {
                     await resetLocalSession();
                     return;
                  }
               }
            } else {
               setCurrentUser(null);
               setUserData(null);
               prevUserRef.current = null;

               sessionManager.clearSession();
               storeLogout();
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
