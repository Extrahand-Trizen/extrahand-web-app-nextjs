"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { OnboardingState } from "@/types/user";

export type UserProfile = {
   uid: string;
   name?: string;
   email?: string;
   phone?: string;
   roles?: string[];
   location?: any;
};

type UserState = {
   user: UserProfile | null;
   token: string | null;
   tokenExpiresAt: number | null;
   sessionId: string | null;
   isAuthenticated: boolean;
   onboarding: OnboardingState | null;
   lastUpdated: number | null;

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
};

export const useUserStore = create<UserState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         tokenExpiresAt: null,
         sessionId: null,
         isAuthenticated: false,
         onboarding: null,
         lastUpdated: null,

         login: ({ user, token, tokenExpiresAt, sessionId }) => {
            set((state) => ({
               user: user ?? state.user,
               token: token ?? state.token,
               tokenExpiresAt: tokenExpiresAt ?? state.tokenExpiresAt,
               sessionId: sessionId ?? state.sessionId,
               isAuthenticated: true,
               lastUpdated: Date.now(),
            }));
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
            });
            try {
               document.cookie = `extrahand_auth=; Path=/; Max-Age=0; SameSite=Lax`;
            } catch {}
         },

         setOnboarding: (state) =>
            set({ onboarding: state, lastUpdated: Date.now() }),

         patchUser: (patch) =>
            set({
               user: { ...(get().user ?? {}), ...patch } as UserProfile,
               lastUpdated: Date.now(),
            }),

         hydrateFromSession: () => {
            if (typeof window === "undefined") return;
            try {
               const raw = localStorage.getItem("extrahand_session");
               if (!raw) return;
               const session = JSON.parse(raw);
               const expiryRaw = session?.accessTokenExpiresAt;
               const normalizedExpiry =
                  typeof expiryRaw === "string"
                     ? Number(expiryRaw)
                     : typeof expiryRaw === "number"
                     ? expiryRaw
                     : null;
               set({
                  isAuthenticated: Boolean(session?.isAuthenticated),
                  token: session?.accessToken ?? null,
                  tokenExpiresAt: Number.isFinite(normalizedExpiry ?? NaN)
                     ? normalizedExpiry
                     : null,
                  sessionId: session?.sessionId ?? null,
                  onboarding: session?.onboardingState ?? get().onboarding,
                  lastUpdated: Date.now(),
               });
            } catch {}
         },
      }),
      {
         name: "extrahand_user_store",
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
            user: state.user,
            token: state.token,
            tokenExpiresAt: state.tokenExpiresAt,
            sessionId: state.sessionId,
            isAuthenticated: state.isAuthenticated,
            onboarding: state.onboarding,
            lastUpdated: state.lastUpdated,
         }),
      }
   )
);
