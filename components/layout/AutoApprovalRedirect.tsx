"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { useAuth } from "@/lib/auth/context";
import type { TaskQueryParams } from "@/types/api";

/**
 * Global protected-route redirect:
 * If poster has a task waiting for approval, navigate directly to that task track page.
 */
export function AutoApprovalRedirect() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const { currentUser, loading } = useAuth();

   useEffect(() => {
      if (loading || !currentUser?.uid) return;

      // Avoid checking when already on a track page with explicit pending approval context.
      const onPendingApprovalView =
         pathname.startsWith("/tasks/") &&
         pathname.endsWith("/track") &&
         (searchParams.get("pendingApproval") === "1" || searchParams.get("action") === "approve");

      if (onPendingApprovalView) return;

      let cancelled = false;

      const run = async () => {
         try {
            const query: TaskQueryParams = {
               posterUid: currentUser.uid,
               status: "review",
               limit: 1,
               sort: "-updatedAt",
            };

            const response = await tasksApi.getTasks(query);

            const pendingTask = response.tasks?.[0];
            if (!pendingTask?._id || cancelled) return;

            const target = `/tasks/${pendingTask._id}/track?pendingApproval=1`;
            if (`${pathname}?${searchParams.toString()}` !== target && pathname !== `/tasks/${pendingTask._id}/track`) {
               router.replace(target);
            }
         } catch {
            // Best-effort UX improvement only; do nothing on error.
         }
      };

      run();

      return () => {
         cancelled = true;
      };
   }, [loading, currentUser?.uid, pathname, searchParams, router]);

   return null;
}
