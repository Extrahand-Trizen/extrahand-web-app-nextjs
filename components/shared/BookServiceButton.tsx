"use client";

import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";
import React, { ReactNode } from "react";

interface BookServiceButtonProps {
   className?: string;
   children?: ReactNode;
}

export function BookServiceButton({ className, children }: BookServiceButtonProps) {
   return (
      <button
         type="button"
         onClick={() => redirectToAppStore()}
         className={className}
      >
         {children || "Book This Service"}
      </button>
   );
}
