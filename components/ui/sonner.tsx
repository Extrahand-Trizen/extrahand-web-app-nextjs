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
         className="toaster group"
         position="top-right"
         expand={true}
         richColors={false}
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
               toast: "group-[.toaster]:bg-white group-[.toaster]:border-l-4 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:backdrop-blur-sm",
               title: "group-[.toast]:text-[15px] group-[.toast]:font-semibold group-[.toast]:text-gray-900 group-[.toast]:leading-tight",
               description:
                  "group-[.toast]:text-[14px] group-[.toast]:text-gray-700 group-[.toast]:mt-1 group-[.toast]:leading-snug group-[.toast]:font-medium",
               actionButton:
                  "group-[.toast]:bg-primary-500 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm hover:group-[.toast]:bg-primary-600",
               cancelButton:
                  "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm hover:group-[.toast]:bg-gray-200",
               closeButton:
                  "group-[.toast]:bg-white group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:text-gray-500 hover:group-[.toast]:text-gray-700 hover:group-[.toast]:bg-gray-50 group-[.toast]:rounded-lg group-[.toast]:shadow-sm",
               success:
                  "group-[.toaster]:border-l-emerald-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50/80 group-[.toaster]:to-white",
               error: "group-[.toaster]:border-l-rose-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-rose-50/80 group-[.toaster]:to-white",
               warning:
                  "group-[.toaster]:border-l-amber-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50/80 group-[.toaster]:to-white",
               info: "group-[.toaster]:border-l-blue-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50/80 group-[.toaster]:to-white",
               loading:
                  "group-[.toaster]:border-l-primary-500 group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-primary-50/80 group-[.toaster]:to-white",
               icon: "group-[.toast]:mt-0.5",
            },
         }}
         {...props}
      />
   );
};

export { Toaster };
