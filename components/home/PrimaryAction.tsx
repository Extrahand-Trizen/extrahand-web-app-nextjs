"use client";

/**
 * PrimaryAction Component
 * Identifies and elevates the single most important next action
 * Enhanced with app theme colors
 */

import React from "react";
import { useRouter } from "next/navigation";
import {
   AlertCircle,
   Clock,
   CreditCard,
   MessageSquare,
   ClipboardCheck,
   ChevronRight,
} from "lucide-react";
import type { UserCurrentStatus } from "@/types/dashboard";

interface PrimaryActionProps {
   status: UserCurrentStatus;
}

type PriorityAction = {
   type: "payment" | "offer" | "task" | "message" | "empty";
   priority: number;
   title: string;
   description: string;
   actionLabel: string;
   actionRoute: string;
   metadata?: {
      amount?: number;
      taskTitle?: string;
      otherPartyName?: string;
      dueDate?: Date;
   };
};

export function PrimaryAction({ status }: PrimaryActionProps) {
   const router = useRouter();
   const action = getPrimaryAction(status);

   if (action.type === "empty") {
      return null;
   }

   const getIcon = () => {
      switch (action.type) {
         case "payment":
            return CreditCard;
         case "offer":
            return AlertCircle;
         case "task":
            return ClipboardCheck;
         case "message":
            return MessageSquare;
         default:
            return Clock;
      }
   };

   const Icon = getIcon();

   const getColorClasses = () => {
      switch (action.type) {
         case "payment":
            return "bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500";
         case "offer":
            return "bg-gradient-to-br from-primary-50 to-white border-l-4 border-primary-500";
         case "task":
            return "bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500";
         case "message":
            return "bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500";
         default:
            return "bg-white border-l-4 border-secondary-300";
      }
   };

   const getIconBg = () => {
      switch (action.type) {
         case "payment":
            return "bg-green-100";
         case "offer":
            return "bg-primary-100";
         case "task":
            return "bg-blue-100";
         case "message":
            return "bg-purple-100";
         default:
            return "bg-secondary-100";
      }
   };

   const getIconColor = () => {
      switch (action.type) {
         case "payment":
            return "text-green-600";
         case "offer":
            return "text-primary-600";
         case "task":
            return "text-blue-600";
         case "message":
            return "text-purple-600";
         default:
            return "text-secondary-700";
      }
   };

   return (
      <button
         onClick={() => router.push(action.actionRoute)}
         className={`w-full text-left ${getColorClasses()} rounded-lg p-5 transition-all hover:shadow-lg group`}
      >
         <div className="flex items-start gap-4">
            <div
               className={`w-12 h-12 rounded-xl ${getIconBg()} flex items-center justify-center shrink-0`}
            >
               <Icon className={`w-6 h-6 ${getIconColor()}`} />
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-secondary-900">
                     {action.title}
                  </h3>
                  {action.metadata?.amount && (
                     <span className="text-xl font-bold text-secondary-900 shrink-0">
                        ₹{action.metadata.amount.toLocaleString("en-IN")}
                     </span>
                  )}
               </div>

               <p className="text-sm text-secondary-600 mb-2">
                  {action.description}
               </p>

               {action.metadata?.taskTitle && (
                  <p className="text-xs text-secondary-500 truncate mb-2">
                     {action.metadata.taskTitle}
                  </p>
               )}

               {action.metadata?.dueDate && (
                  <div className="flex items-center gap-1 mb-3 text-xs text-secondary-500">
                     <Clock className="w-3 h-3" />
                     <span>
                        Due{" "}
                        {new Date(action.metadata.dueDate).toLocaleDateString(
                           "en-IN",
                           { day: "numeric", month: "short" }
                        )}
                     </span>
                  </div>
               )}

               <div className="mt-3 pt-3 border-t border-secondary-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                     {action.actionLabel}
                  </span>
                  <ChevronRight className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transition-colors" />
               </div>
            </div>
         </div>
      </button>
   );
}

function getPrimaryAction(status: UserCurrentStatus): PriorityAction {
   // Priority order:
   // 1. Pending payments (release action)
   // 2. Pending offers (received, need response)
   // 3. Active tasks with urgent status or due soon
   // 4. Unread messages (only if no other action)
   // 5. Empty state

   // Check for pending payments (highest priority)
   if (status.pendingPayments.length > 0) {
      const payment = status.pendingPayments[0];
      return {
         type: "payment",
         priority: 1,
         title: "Payment ready to release",
         description:
            "Task completed. Release payment to complete the transaction.",
         actionLabel: "Review and release payment",
         actionRoute: payment.actionRoute,
         metadata: {
            amount: payment.amount,
            taskTitle: payment.taskTitle,
         },
      };
   }

   // Check for pending offers (received)
   const receivedOffers = status.pendingOffers.filter(
      (o) => o.type === "received"
   );
   if (receivedOffers.length > 0) {
      const offer = receivedOffers[0];
      return {
         type: "offer",
         priority: 2,
         title: "New offer received",
         description: `${
            offer.applicantName || "Someone"
         } offered ₹${offer.proposedBudget.toLocaleString(
            "en-IN"
         )} for your task.`,
         actionLabel: "Review offer",
         actionRoute: offer.actionRoute,
         metadata: {
            amount: offer.proposedBudget,
            taskTitle: offer.taskTitle,
            otherPartyName: offer.applicantName,
         },
      };
   }

   // Check for active tasks (prioritize urgent or due soon)
   if (status.activeTasks.length > 0) {
      const urgentTask = status.activeTasks.find(
         (t) => t.urgency === "urgent" || t.urgency === "high"
      );
      const task = urgentTask || status.activeTasks[0];

      return {
         type: "task",
         priority: 3,
         title:
            task.role === "poster" ? "Track your task" : "Continue your task",
         description: task.nextAction,
         actionLabel: task.nextAction,
         actionRoute: task.nextActionRoute,
         metadata: {
            taskTitle: task.title,
            otherPartyName: task.otherPartyName,
            dueDate: task.scheduledDate,
         },
      };
   }

   // Check for unread messages (lowest priority)
   const unreadChats = status.activeChats.filter((c) => c.unreadCount > 0);
   if (unreadChats.length > 0) {
      const chat = unreadChats[0];
      return {
         type: "message",
         priority: 4,
         title: "New message",
         description: `${chat.unreadCount} unread message${
            chat.unreadCount > 1 ? "s" : ""
         } from ${chat.otherPartyName}`,
         actionLabel: "View conversation",
         actionRoute: `/chat?id=${chat.id}`,
         metadata: {
            taskTitle: chat.taskTitle,
            otherPartyName: chat.otherPartyName,
         },
      };
   }

   // Empty state
   return {
      type: "empty",
      priority: 999,
      title: "",
      description: "",
      actionLabel: "",
      actionRoute: "",
   };
}
