"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

type UserStats = {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
};

type DashboardState = {
  stats: UserStats | null;
  statsLoading: boolean;
  statsError: string | null;
  lastFetchedAt: number | null;
  fetchStats: (options?: { force?: boolean }) => Promise<UserStats | null>;
};

// Simple shared cache for dashboard stats so that home/tasks style
// pages can show counts instantly after the first fetch.
export const useDashboardStore = create<DashboardState>()((set, get) => ({
  stats: null,
  statsLoading: false,
  statsError: null,
  lastFetchedAt: null,

  async fetchStats(options) {
    const { statsLoading, lastFetchedAt } = get();

    // Avoid overlapping requests
    if (statsLoading) return get().stats;

    // Basic staleness check (e.g. 60 seconds)
    const now = Date.now();
    const STALE_MS = 60_000;
    if (!options?.force && lastFetchedAt && now - lastFetchedAt < STALE_MS) {
      return get().stats;
    }

    try {
      set({ statsLoading: true, statsError: null });
      const data = await api.getUserStats();

      const stats: UserStats = {
        totalTasks: data.totalTasks ?? 0,
        openTasks: data.openTasks ?? 0,
        completedTasks: data.completedTasks ?? 0,
        totalApplications: data.totalApplications ?? 0,
        pendingApplications: data.pendingApplications ?? 0,
        acceptedApplications: data.acceptedApplications ?? 0,
      };

      set({
        stats,
        statsLoading: false,
        statsError: null,
        lastFetchedAt: now,
      });

      return stats;
    } catch (error: any) {
      set({
        statsLoading: false,
        statsError:
          typeof error?.message === "string"
            ? error.message
            : "Failed to load dashboard stats",
      });
      return null;
    }
  },
}));

