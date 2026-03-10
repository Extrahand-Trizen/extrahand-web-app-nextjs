"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { useAuth } from "@/lib/auth/context";
import { useUserStore } from "@/lib/state/userStore";

/**
 * Global protected-route redirect:
 * If poster has a task waiting for approval, navigate directly to that task track page.
 * Each task is auto-redirected only once per browser.
 */
export function AutoApprovalRedirect() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const { currentUser, userData, loading } = useAuth();
   const storeUser = useUserStore((state) => state.user);
   const isAuthenticated = useUserStore((state) => state.isAuthenticated);

   const actorUid = userData?.uid || currentUser?.uid || storeUser?.uid;

   useEffect(() => {
      if (loading) return;

      // Run only for authenticated users; API uses HttpOnly cookie session.
      if (!isAuthenticated && !actorUid) return;

      // Skip auth/onboarding pages.
      const excludedPrefixes = [
         "/login",
         "/signup",
         "/otp-verification",
         "/onboarding",
      ];
      if (excludedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
         return;
      }

      const getHandledTaskIds = (): string[] => {
         try {
            const raw = window.localStorage.getItem("approval_redirect_handled_task_ids");
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
         } catch {
            return [];
         }
      };

      const markTaskAsHandled = (taskId: string): void => {
         try {
            const existing = getHandledTaskIds();
            if (existing.includes(taskId)) return;
            const next = [...existing, taskId];
            window.localStorage.setItem("approval_redirect_handled_task_ids", JSON.stringify(next));
         } catch {
            // Best-effort only.
         }
      };

      let cancelled = false;

      const run = async () => {
         try {
            const response = await tasksApi.getMyTasks({
               status: "review",
               limit: 1,
               sort: "-updatedAt",
            });

            const pendingTask = response.tasks?.[0];
            if (!pendingTask?._id || cancelled) return;

            // Redirect this approval task only once.
            const handledTaskIds = getHandledTaskIds();
            if (handledTaskIds.includes(pendingTask._id)) {
               return;
            }

            const target = `/tasks/${pendingTask._id}/track?pendingApproval=1`;
            const isOnTaskTrack = pathname === `/tasks/${pendingTask._id}/track`;
            const hasPendingParam = searchParams.get("pendingApproval") === "1";

            // If already in approval context, mark handled and stop future redirects.
            if (isOnTaskTrack && hasPendingParam) {
               markTaskAsHandled(pendingTask._id);
               return;
            }

            // Redirect from anywhere else to approval page and mark handled once redirected.
            markTaskAsHandled(pendingTask._id);
            router.replace(target);
         } catch {
            // Best-effort UX improvement only; do nothing on error.
         }
      };

      // Immediate check on mount/route change.
      run();

      // Keep checking while user stays on the same page.
      const intervalId = window.setInterval(run, 2000);

      // Re-check as soon as tab gains focus.
      const handleFocus = () => {
         run();
      };

      const handleVisibility = () => {
         if (document.visibilityState === "visible") {
            run();
         }
      };

      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
         cancelled = true;
         window.clearInterval(intervalId);
         window.removeEventListener("focus", handleFocus);
         document.removeEventListener("visibilitychange", handleVisibility);
      };
   }, [loading, isAuthenticated, actorUid, pathname, searchParams, router]);

   return null;
}
