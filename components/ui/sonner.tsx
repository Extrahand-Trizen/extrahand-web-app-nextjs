"use client";

import {
   CircleCheckIcon,
   InfoIcon,
   Loader2Icon,
   OctagonXIcon,
   TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
   const { theme = "system" } = useTheme();

   return (
      <Sonner
         theme={theme as ToasterProps["theme"]}
         className="toaster group fixed top-2 right-2 z-[9999] flex flex-col gap-1 pointer-events-none max-w-[90vw]"
         position="top-right"
         expand={false}
         richColors={false}
         // Global close button on all toasts
         closeButton
         icons={{
            success: <CircleCheckIcon className="size-5 stroke-[2.5]" />,
            info: <InfoIcon className="size-5 stroke-[2.5]" />,
            warning: <TriangleAlertIcon className="size-5 stroke-[2.5]" />,
            error: <OctagonXIcon className="size-5 stroke-[2.5]" />,
            loading: (
               <Loader2Icon className="size-5 animate-spin stroke-[2.5]" />
            ),
         }}
         toastOptions={{
            unstyled: false,
            classNames: {
               toast: "group-[.toaster]:bg-white group-[.toaster]:border-l-4 group-[.toaster]:shadow-md group-[.toaster]:rounded group-[.toaster]:px-2 group-[.toaster]:py-1 sm:group-[.toaster]:p-2.5 sm:group-[.toaster]:gap-1.5 group-[.toaster]:gap-1 group-[.toaster]:backdrop-blur-sm max-w-[260px] sm:max-w-sm group-[.toaster]:min-w-0",
               title: "sm:group-[.toast]:text-[13px] group-[.toast]:text-[10px] group-[.toast]:font-semibold group-[.toast]:text-gray-900 group-[.toast]:leading-tight",
               description:
                  "sm:group-[.toast]:text-[12px] group-[.toast]:text-[9px] group-[.toast]:text-gray-600 group-[.toast]:mt-0 group-[.toast]:leading-tight font-normal",
               actionButton:
                  "group-[.toast]:bg-primary-500 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded sm:group-[.toast]:px-2 sm:group-[.toast]:py-1 group-[.toast]:px-1 group-[.toast]:py-0.5 sm:group-[.toast]:text-xs group-[.toast]:text-[8px] hover:group-[.toast]:bg-primary-600 whitespace-nowrap",
               cancelButton:
                  "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:font-medium group-[.toast]:rounded sm:group-[.toast]:px-2 sm:group-[.toast]:py-1 group-[.toast]:px-1 group-[.toast]:py-0.5 sm:group-[.toast]:text-xs group-[.toast]:text-[8px] hover:group-[.toast]:bg-gray-200",
               closeButton:
                  "group-[.toast]:bg-white group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:text-gray-400 hover:group-[.toast]:text-gray-600 hover:group-[.toast]:bg-gray-50 group-[.toast]:rounded group-[.toast]:w-3.5 group-[.toast]:h-3.5 group-[.toast]:p-0 group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:flex-shrink-0",
               success:
                  "group-[.toaster]:border-l-emerald-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50/80 group-[.toaster]:to-white",
               error: "group-[.toaster]:border-l-rose-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-rose-50/80 group-[.toaster]:to-white",
               warning:
                  "group-[.toaster]:border-l-amber-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50/80 group-[.toaster]:to-white",
               info: "group-[.toaster]:border-l-blue-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50/80 group-[.toaster]:to-white",
               loading:
                  "group-[.toaster]:border-l-primary-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-primary-50/80 group-[.toaster]:to-white",
               icon: "group-[.toast]:mt-0 group-[.toast]:w-3 group-[.toast]:h-3 group-[.toast]:flex-shrink-0",
            },
         }}
         {...props}
      />
   );
};

export { Toaster };
