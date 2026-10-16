"use client";

import Link from "next/link";
import React, { ReactNode } from "react";

interface BookServiceButtonProps {
   className?: string;
   children?: ReactNode;
   href?: string;
}

export function BookServiceButton({
   className,
   children,
   href = "/book-now",
}: BookServiceButtonProps) {
   return (
      <Link
         href={href}
         className={className}
      >
         {children || "Book This Service"}
      </Link>
   );
}
