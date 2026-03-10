"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { useAuth } from "@/lib/auth/context";
import { useUserStore } from "@/lib/state/userStore";
import type { TaskQueryParams } from "@/types/api";

/**
 * Global protected-route redirect:
 * If poster has a task waiting for approval, navigate directly to that task track page.
 */
export function AutoApprovalRedirect() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const { currentUser, userData, loading } = useAuth();
   const storeUser = useUserStore((state) => state.user);

   const actorUid = userData?.uid || currentUser?.uid || storeUser?.uid;

   useEffect(() => {
      if (loading || !actorUid) return;

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
               posterUid: actorUid,
               status: "review",
               limit: 1,
               sort: "-updatedAt",
            };

            const response = await tasksApi.getTasks(query);

            const pendingTask = response.tasks?.[0];
            if (!pendingTask?._id || cancelled) return;

            const target = `/tasks/${pendingTask._id}/track?pendingApproval=1`;
            const isOnTaskTrack = pathname === `/tasks/${pendingTask._id}/track`;
            const hasPendingParam = searchParams.get("pendingApproval") === "1";

            // Redirect from anywhere immediately; if already on the same track page, enforce pendingApproval context.
            if (!isOnTaskTrack || !hasPendingParam) {
               router.replace(target);
            }
         } catch {
            // Best-effort UX improvement only; do nothing on error.
         }
      };

      // Immediate check on mount/route change.
      run();

      // Keep checking while user stays on the same page.
      const intervalId = window.setInterval(run, 5000);

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
   }, [loading, actorUid, pathname, searchParams, router]);

   return null;
}
