"use client";

import type { ReactNode } from "react";
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
import PartnerCallbackForm from "@/app/(public)/ad/PartnerCallbackForm";

export function PartnerInterestButton({
   children,
   categories,
   className,
}: {
   children: ReactNode;
   categories: Pick<CategoriesListItem, "name" | "slug">[];
   className?: string;
}) {
   return (
      <Dialog>
         <DialogTrigger
            className={cn(buttonVariants({ size: "lg" }), className)}
            type="button"
         >
            {children}
         </DialogTrigger>
         <DialogContent className="!w-[calc(100%-2rem)] !max-w-[520px] !border-0 !bg-transparent !p-0 !shadow-none">
            <DialogTitle className="sr-only">Request a Callback</DialogTitle>
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
