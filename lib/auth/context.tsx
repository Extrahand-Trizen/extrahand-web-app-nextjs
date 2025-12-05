'use client';

/**
 * Authentication Context
 * Manages user authentication state and profile data
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { api } from '@/lib/api';
import { sessionManager } from './session';
import { UserProfile } from '@/types/user';

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionRestored, setSessionRestored] = useState(false);
  const prevUserRef = useRef<string | null>(null);

  const refreshUserData = useCallback(async () => {
    if (currentUser) {
      try {
        console.log('🔄 Refreshing user data from backend API...');
        const userData = await api.me();
        setUserData(userData);
        
        // Save session data
        sessionManager.saveSession({
          isAuthenticated: true,
          lastRoute: sessionManager.getLastRoute()?.route || 'Landing'
        });
        
        console.log('✅ User data refreshed successfully:', userData);
      } catch (error: any) {
        console.warn('❌ Failed to refresh user data:', error.message);
      }
    }
  }, [currentUser]);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear session data
      sessionManager.clearSession();
      
      // Clear user state
      setCurrentUser(null);
      setUserData(null);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if Firebase signOut fails, clear local session
      sessionManager.clearSession();
      setCurrentUser(null);
      setUserData(null);
    }
  }, []);

  // Restore session on app start (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      setSessionRestored(true);
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const session = sessionManager.getSession();
        console.log('🔍 Restoring session:', session);

        if (session.isAuthenticated && sessionManager.isSessionValid()) {
          console.log('✅ Valid session found, restoring...');
          
          // Check if user is still authenticated with Firebase
          const user = auth.currentUser;
          if (user) {
            setCurrentUser(user);
            try {
              const userData = await api.me();
              setUserData(userData);
              console.log('✅ Session restored successfully');
            } catch (error: any) {
              console.warn('❌ Failed to restore user data:', error.message);
              setUserData(null);
            }
          } else {
            console.log('❌ Firebase user not found, clearing session');
            sessionManager.clearSession();
          }
        } else {
          console.log('❌ No valid session found');
          sessionManager.clearSession();
        }
      } catch (error) {
        console.warn('❌ Error restoring session:', error);
        sessionManager.clearSession();
      } finally {
        setSessionRestored(true);
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!sessionRestored) return;
    if (typeof window === 'undefined') return; // Only run on client

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentUserId = user?.uid || null;
      
      // Only update if user actually changed
      if (currentUserId !== prevUserRef.current) {
        prevUserRef.current = currentUserId;
        
        if (user) {
          setCurrentUser(user);
          
          // Only save session if user changed (not on every auth state change)
          const existingSession = sessionManager.getSession();
          if (!existingSession.isAuthenticated || existingSession.lastActivity === undefined) {
            sessionManager.saveSession({
              isAuthenticated: true,
              lastRoute: sessionManager.getLastRoute()?.route || 'Landing'
            });
          }
          
          try {
            // Fetch user data from backend API
            const userData = await api.me();
            setUserData(userData);
          } catch (error: any) {
            // If API call fails, continue with auth user only
            console.warn('Backend API offline; proceeding without profile data:', error.message);
            setUserData(null);
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
          prevUserRef.current = null;
          
          // Clear session when user logs out
          sessionManager.clearSession();
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [sessionRestored]);

  // Memoize context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    currentUser,
    userData,
    loading,
    refreshUserData,
    logout,
  }), [currentUser, userData, loading, refreshUserData, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

