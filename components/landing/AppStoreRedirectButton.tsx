"use client";

import { Button } from "@/components/ui/button";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";
import type { ReactNode } from "react";

export function AppStoreRedirectButton({
   children,
   className,
}: {
   children: ReactNode;
   className: string;
}) {
   return (
      <Button
         size="lg"
         onClick={redirectToAppStore}
         className={className}
      >
         {children}
      </Button>
   );
}
