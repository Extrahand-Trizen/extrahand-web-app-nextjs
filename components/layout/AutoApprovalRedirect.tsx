"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { useAuth } from "@/lib/auth/context";
import { useUserStore } from "@/lib/state/userStore";

/**
 * Global protected-route redirect:
 * If poster has a task waiting for approval, navigate directly to that task track page.
 * Each review submission is auto-redirected only once.
 * A resubmission for the same task (after requested changes) gets a new attempt key,
 * so poster is redirected again for that new approval cycle.
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

      // Track handled submission attempts: { taskId, attemptKey }
      // attemptKey is based on updatedAt so each resubmit is treated as a new cycle.
      const getHandledAttempts = (): { taskId: string; attemptKey: string }[] => {
         try {
            const raw = window.localStorage.getItem("approval_redirect_handled_attempts");
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
         } catch {
            return [];
         }
      };

      const isAttemptHandled = (taskId: string, attemptKey: string): boolean => {
         const handled = getHandledAttempts();
         return handled.some((h: any) => h.taskId === taskId && h.attemptKey === attemptKey);
      };

      const markAttemptAsHandled = (taskId: string, attemptKey: string): void => {
         try {
            const existing = getHandledAttempts();
            const alreadyExists = existing.some(
               (h: any) => h.taskId === taskId && h.attemptKey === attemptKey
            );
            if (alreadyExists) return;

            const next = [...existing, { taskId, attemptKey }];
            window.localStorage.setItem("approval_redirect_handled_attempts", JSON.stringify(next));
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

            const attemptKey = String((pendingTask as any)?.updatedAt || "unknown_attempt");

            // Check if this submission attempt was already redirected
            if (isAttemptHandled(pendingTask._id, attemptKey)) {
               return;
            }

            const target = `/tasks/${pendingTask._id}/track?pendingApproval=1`;
            const isOnTaskTrack = pathname === `/tasks/${pendingTask._id}/track`;
            const hasPendingParam = searchParams.get("pendingApproval") === "1";

            // If already in approval context, mark handled and stop future redirects.
            if (isOnTaskTrack && hasPendingParam) {
               markAttemptAsHandled(pendingTask._id, attemptKey);
               return;
            }

            // Redirect from anywhere else to approval page and mark handled once redirected.
            markAttemptAsHandled(pendingTask._id, attemptKey);
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
