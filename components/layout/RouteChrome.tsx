"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LandingTopBar } from "@/components/layout/LandingTopBar";
import { LandingFooter } from "@/components/layout/LandingFooter";

type RouteChromeVariant = "public" | "protected";

const HOMEPAGE_INTERACTIVE_SELECTOR =
   'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

interface RouteChromeProps {
   children: ReactNode;
   variant: RouteChromeVariant;
}

export function RouteChrome({ children, variant }: RouteChromeProps) {
   const pathname = usePathname();

   useEffect(() => {
      if (variant !== "public" || pathname !== "/") return;

      let interactiveStep: HTMLElement | null = null;

      const handleTabKey = (event: KeyboardEvent) => {
         if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) {
            return;
         }

         const focusedElement =
            document.activeElement instanceof HTMLElement
               ? document.activeElement
               : null;
         if (
            focusedElement?.closest(
               '[role="dialog"], input, textarea, select, [contenteditable="true"]'
            )
         ) {
            return;
         }

         const steps = Array.from(
            document.querySelectorAll<HTMLElement>("[data-home-tab-step]")
         );
         if (steps.length === 0) return;

         const focusedStep = focusedElement?.closest<HTMLElement>(
            "[data-home-tab-step]"
         );
         const focusStep = (step: HTMLElement | undefined) => {
            if (!step) return;
            interactiveStep = null;
            step.focus({ preventScroll: true });
            step.scrollIntoView({
               behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
               block: "start",
            });
         };

         if (event.key === "Escape" && interactiveStep && focusedStep === interactiveStep) {
            event.preventDefault();
            focusStep(interactiveStep);
            return;
         }

         if (event.key === "Enter" && focusedStep === focusedElement) {
            const controls = Array.from(
               focusedStep.querySelectorAll<HTMLElement>(
                  HOMEPAGE_INTERACTIVE_SELECTOR
               )
            ).filter((control) => control.getClientRects().length > 0);
            if (controls.length > 0) {
               event.preventDefault();
               interactiveStep = focusedStep;
               controls[0].focus();
            }
            return;
         }

         if (event.key !== "Tab") return;

         const currentStep = focusedStep
            ? steps.indexOf(focusedStep)
            : steps.reduce((lastVisibleStep, step, index) => {
                 const scrollTop = Math.max(
                    window.scrollY,
                    document.documentElement.scrollTop,
                    document.body.scrollTop
                 );
                 return step.getBoundingClientRect().top + scrollTop <= scrollTop + 120
                    ? index
                    : lastVisibleStep;
              }, -1);
         if (currentStep < 0) return;

         const activeControl = focusedElement?.closest<HTMLElement>(
            HOMEPAGE_INTERACTIVE_SELECTOR
         );
         if (interactiveStep && focusedStep === interactiveStep && activeControl) {
            const controls = Array.from(
               interactiveStep.querySelectorAll<HTMLElement>(
                  HOMEPAGE_INTERACTIVE_SELECTOR
               )
            ).filter((control) => control.getClientRects().length > 0);
            const controlIndex = controls.indexOf(activeControl);
            if (
               (!event.shiftKey && controlIndex < controls.length - 1) ||
               (event.shiftKey && controlIndex > 0)
            ) {
               return;
            }
         }

         if (currentStep === steps.length - 1 && !event.shiftKey) {
            interactiveStep = null;
            return;
         }

         const nextStep = currentStep + (event.shiftKey ? -1 : 1);
         if (nextStep < 0 || nextStep >= steps.length) return;

         event.preventDefault();
         focusStep(steps[nextStep]);
      };

      window.addEventListener("keydown", handleTabKey, true);
      return () => window.removeEventListener("keydown", handleTabKey, true);
   }, [pathname, variant]);

   if (variant === "public" && (pathname === "/ad" || pathname.startsWith("/ad/"))) {
      return <>{children}</>;
   }

   if (variant === "public") {
      return (
         <div
            suppressHydrationWarning
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
         >
            <LandingTopBar />
            <main
               style={{
                  flex: 1,
                  minHeight: "calc(100vh - 110px)",
                  position: "relative",
               }}
            >
               <div className="w-full mx-auto">{children}</div>
            </main>
            {pathname === "/" ? (
               <div
                  aria-label="Homepage footer"
                  data-home-tab-step
                  role="region"
                  tabIndex={-1}
               >
                  <LandingFooter />
               </div>
            ) : (
               <LandingFooter />
            )}
         </div>
      );
   }

   return (
      <div suppressHydrationWarning>
         <LandingTopBar />
         <main className="min-h-[calc(100vh - 110px)]">
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
}
