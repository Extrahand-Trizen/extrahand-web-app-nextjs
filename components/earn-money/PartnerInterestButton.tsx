"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
   partnerCities,
   partnerAppStoreUrl,
   partnerPlayStoreUrl,
} from "@/lib/data/partner-interest";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";

const PartnerCallbackForm = dynamic(
   () => import("@/app/(public)/ad/PartnerCallbackForm"),
   { ssr: false }
);

export function PartnerInterestButton({
   children,
   categories,
   className,
   defaultOpen = false,
}: {
   children: ReactNode;
   categories: Pick<CategoriesListItem, "name" | "slug">[];
   className?: string;
   defaultOpen?: boolean;
}) {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger
            className={cn(buttonVariants({ size: "lg" }), className)}
            type="button"
         >
            {children}
         </DialogTrigger>
         <DialogContent
            className="!w-[calc(100%-1rem)] !max-w-[620px] !border-0 !bg-transparent !p-0 !shadow-none"
            onCloseAutoFocus={(event) => {
               event.preventDefault();
            }}
         >
            <DialogTitle className="sr-only">Join as Partner</DialogTitle>
            <DialogDescription className="sr-only">
               Share your details and our team will contact you about becoming an ExtraHand partner.
            </DialogDescription>
            <PartnerCallbackForm
               categories={categories}
               cities={partnerCities}
               partnerPlayStoreUrl={partnerPlayStoreUrl}
               partnerAppStoreUrl={partnerAppStoreUrl}
               variant="modal"
            />
         </DialogContent>
      </Dialog>
   );
}
