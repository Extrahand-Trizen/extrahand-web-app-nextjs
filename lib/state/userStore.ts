"use client";

import { create } from "zustand";
import type { OnboardingState } from "@/types/user";
import { profilesApi } from "@/lib/api/endpoints/profiles";

export type UserProfile = {
   _id?: string; // MongoDB ObjectId - used for ownership checks
   uid: string; // Firebase UID
   name?: string;
   email?: string;
   phone?: string;
   roles?: string[];
   location?: any;
   
   // Profile Stats
   totalTasks?: number;
   completedTasks?: number;
   postedTasks?: number;
   rating?: number;
   totalReviews?: number;
};

type UserState = {
   user: UserProfile | null;
   token: string | null;
   tokenExpiresAt: number | null;
   sessionId: string | null;
   isAuthenticated: boolean;
   onboarding: OnboardingState | null;
   lastUpdated: number | null;
   profileLoading: boolean;
   profileError: string | null;

   // Actions
   login: (payload: {
      user?: UserProfile | null;
      token?: string | null;
      tokenExpiresAt?: number | null;
      sessionId?: string | null;
   }) => void;
   logout: () => void;
   setOnboarding: (state: OnboardingState | null) => void;
   patchUser: (patch: Partial<UserProfile>) => void;
   hydrateFromSession: () => void;
   refreshProfile: () => Promise<UserProfile | null>;
};

export const useUserStore = create<UserState>()((set, get) => ({
   user: null,
   token: null,
   tokenExpiresAt: null,
   sessionId: null,
   isAuthenticated: false,
   onboarding: null,
   lastUpdated: null,
   profileLoading: false,
   profileError: null,

   login: ({ user, token, tokenExpiresAt, sessionId }) => {
      set((state) => ({
         user: user ?? state.user,
         // Note: tokens are kept in-memory only; not persisted
         token: token ?? state.token,
         tokenExpiresAt: tokenExpiresAt ?? state.tokenExpiresAt,
         sessionId: sessionId ?? state.sessionId,
         isAuthenticated: true,
         lastUpdated: Date.now(),
      }));
      // Lightweight, non-sensitive cookie for client-only route gating
      try {
         const maxAge = 30 * 24 * 60 * 60; // 30 days
         document.cookie = `extrahand_auth=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
      } catch {}
   },

   logout: () => {
      set({
         user: null,
         token: null,
         tokenExpiresAt: null,
         sessionId: null,
         isAuthenticated: false,
         onboarding: null,
         lastUpdated: Date.now(),
         profileLoading: false,
         profileError: null,
      });
      try {
         document.cookie = `extrahand_auth=; Path=/; Max-Age=0; SameSite=Lax`;
      } catch {}
   },

   setOnboarding: (state) => set({ onboarding: state, lastUpdated: Date.now() }),

   patchUser: (patch) =>
      set({
         user: { ...(get().user ?? {}), ...patch } as UserProfile,
         lastUpdated: Date.now(),
      }),

   // Avoid reading sensitive data from localStorage. Optionally
   // derive auth state from a simple presence cookie set on login.
   hydrateFromSession: () => {
      if (typeof document === "undefined") return;
      try {
         const hasAuthCookie = document.cookie
            .split("; ")
            .some((c) => c.startsWith("extrahand_auth=1"));
         set({ isAuthenticated: hasAuthCookie, lastUpdated: Date.now() });
      } catch {}
   },

   // Centralized helper to fetch and cache the current user's profile.
   // This can be used by the profile page and other parts of the app
   // to ensure they all share the same canonical profile data.
   refreshProfile: async () => {
      // Prevent overlapping requests
      const { profileLoading } = get();
      if (profileLoading) {
         return get().user;
      }

      try {
         set({ profileLoading: true, profileError: null });
         const profile = await profilesApi.me();

         // Reuse login so tokens / flags stay consistent
         get().login({ user: profile });

         set({
            profileLoading: false,
            profileError: null,
            lastUpdated: Date.now(),
         });

         return profile;
      } catch (error: any) {
         const message =
            typeof error?.message === "string"
               ? error.message
               : "Failed to load profile";

         set({
            profileLoading: false,
            profileError: message,
            lastUpdated: Date.now(),
         });

         return null;
      }
   },
}));
