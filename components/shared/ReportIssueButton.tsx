"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/lib/state/userStore";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export type ReportIssueType = "payment" | "task" | "chat" | "general";

interface ReportIssueButtonProps {
   buttonLabel?: string;
   issueType: ReportIssueType;
   pageContext: string;
   metadata?: Record<string, unknown>;
   className?: string;
   buttonClassName?: string;
   buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
   buttonSize?: "default" | "sm" | "lg" | "icon";
}

export function ReportIssueButton({
   buttonLabel = "Report Issue",
   issueType,
   pageContext,
   metadata,
   className,
   buttonClassName,
   buttonVariant = "link",
   buttonSize = "sm",
}: ReportIssueButtonProps) {
   const pathname = usePathname();
   const user = useUserStore((state) => state.user);
   const [open, setOpen] = useState(false);
   const [message, setMessage] = useState("");
   const [submitting, setSubmitting] = useState(false);

   const submitIssue = async () => {
      const trimmedMessage = message.trim();
      if (trimmedMessage.length < 5) {
         toast.error("Please enter at least 5 characters");
         return;
      }

      setSubmitting(true);
      try {
         const response = await fetch("/api/issue-reports", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               issueType,
               issueLabel: buttonLabel,
               pageContext,
               message: trimmedMessage,
               userId: user?._id,
               userUid: user?.uid,
               metadata: {
                  ...(metadata || {}),
                  pathname,
               },
            }),
         });

         const result = await response.json().catch(() => null);

         if (!response.ok) {
            throw new Error(result?.message || "Failed to submit issue");
         }

         toast.success("Issue submitted successfully");
         setMessage("");
         setOpen(false);
      } catch (error) {
         toast.error(
            error instanceof Error ? error.message : "Failed to submit issue"
         );
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className={cn("inline-flex", className)}>
         <Button
            type="button"
            variant={buttonVariant}
            size={buttonSize}
            className={cn(
               "px-0 text-amber-500 hover:text-amber-600 font-medium",
               buttonClassName
            )}
            onClick={() => setOpen(true)}
         >
            <span className="inline-flex items-center gap-1.5">
               <AlertTriangle className="w-3.5 h-3.5" />
               <span>{buttonLabel}</span>
            </span>
         </Button>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>{buttonLabel}</DialogTitle>
                  <DialogDescription>
                     Describe the issue clearly. This report will be saved for support review.
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-2">
                  <Textarea
                     value={message}
                     onChange={(event) => setMessage(event.target.value)}
                     placeholder="Enter your issue here..."
                     className="min-h-32"
                     maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                     {message.length}/2000
                  </p>
               </div>

               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => setOpen(false)}
                     disabled={submitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     onClick={submitIssue}
                     disabled={submitting || message.trim().length < 5}
                  >
                     {submitting ? "Sending..." : "Send"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
