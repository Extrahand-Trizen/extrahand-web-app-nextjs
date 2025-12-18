/**
 * useDashboardData Hook
 * Returns mock dashboard data for development
 * Replace with actual API calls when backend is ready
 */

import { useState, useCallback } from "react";
import { mockDashboardData } from "@/lib/data/mockDashboard";
import type { DashboardData } from "@/types/dashboard";

interface UseDashboardDataReturn {
   data: DashboardData;
   loading: boolean;
   error: Error | null;
   refresh: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
   const [loading, setLoading] = useState(false);

   const refresh = useCallback(async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
   }, []);

   return {
      data: mockDashboardData,
      loading,
      error: null,
      refresh,
   };
}



