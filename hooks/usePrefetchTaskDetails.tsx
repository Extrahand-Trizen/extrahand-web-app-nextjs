"use client";

import React, { useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { taskDetailsQueryKeys } from "@/lib/queryKeys";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { applicationsApi } from "@/lib/api/endpoints/applications";

const PREFETCH_DEBOUNCE_MS = 200;

// Single timeout across all instances so only one prefetch runs at a time
let globalTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Conservative prefetch for task detail page: debounced hover, one at a time.
 * Use on task links/cards so that when the user clicks, data is often already in cache.
 */
export function usePrefetchTaskDetails(taskId: string | null) {
   const queryClient = useQueryClient();

   const prefetch = useCallback(() => {
      if (!taskId) return;
      if (globalTimeout) clearTimeout(globalTimeout);
      globalTimeout = setTimeout(() => {
         globalTimeout = null;
         void queryClient.prefetchQuery({
            queryKey: taskDetailsQueryKeys.task(taskId),
            queryFn: async () => {
               const r = await tasksApi.getTask(taskId);
               return (r as { data?: unknown })?.data ?? r;
            },
            staleTime: 60 * 1000,
         });
         void queryClient.prefetchQuery({
            queryKey: taskDetailsQueryKeys.applications(taskId),
            queryFn: () => applicationsApi.getTaskApplications(taskId),
            staleTime: 60 * 1000,
         });
      }, PREFETCH_DEBOUNCE_MS);
   }, [taskId, queryClient]);

   return { onMouseEnter: prefetch };
}

export type PrefetchTaskWrapperProps = {
   taskId: string;
   children: ReactNode;
   className?: string;
};

/** Wrapper to add hover prefetch to any task link/card. Use in lists where each item has a taskId. */
export const PrefetchTaskWrapper: React.FC<PrefetchTaskWrapperProps> = (props) => {
   const { taskId, children, className } = props;
   const { onMouseEnter } = usePrefetchTaskDetails(taskId);
   return React.createElement("div", { className, onMouseEnter }, children);
};
