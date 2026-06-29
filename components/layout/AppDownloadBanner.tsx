"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openAppOrStore } from "@/lib/openAppBridge";

const STORAGE_KEY = "extrahand-app-banner-dismissed";

export function isAppDownloadBannerDismissed(): boolean {
   if (typeof window === "undefined") return false;
   return localStorage.getItem(STORAGE_KEY) === "true";
}

export function dismissAppDownloadBanner(): void {
   localStorage.setItem(STORAGE_KEY, "true");
}

type AppDownloadBannerProps = {
   onDismiss: () => void;
};

export function AppDownloadBanner({ onDismiss }: AppDownloadBannerProps) {
   const handleOpenApp = () => {
      openAppOrStore();
   };

   return (
      <>
         <div
            className={cn(
               "fixed top-0 left-0 right-0 z-40",
               "bg-white/95 backdrop-blur-md border-b border-secondary-100 shadow-sm"
            )}
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-14 md:h-16 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-secondary-100 bg-white shadow-sm">
                        <Image
                           src="/assets/images/logo.webp"
                           alt="ExtraHand"
                           width={24}
                           height={24}
                           className="size-6"
                           unoptimized
                           priority
                        />
                     </div>
                     <div className="min-w-0 leading-tight">
                        <p className="text-sm font-semibold text-secondary-900 truncate">
                           Get the ExtraHand app
                        </p>
                        <p className="hidden sm:block text-xs text-secondary-500 truncate">
                           For the best experience on mobile
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                     <Button
                        type="button"
                        size="sm"
                        onClick={handleOpenApp}
                        className="h-8 rounded-lg bg-secondary-900 px-3.5 text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-secondary-800 sm:h-9 sm:px-4 sm:text-sm"
                     >
                        Open App
                     </Button>
                     <button
                        type="button"
                        onClick={onDismiss}
                        className="flex size-8 items-center justify-center rounded-full text-secondary-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700"
                        aria-label="Close app download banner"
                     >
                        <X className="size-4" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div className="h-16" aria-hidden />
      </>
   );
}
