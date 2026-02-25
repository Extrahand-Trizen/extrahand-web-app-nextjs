"use client";

/**
 * Notification Center Component
 * Bell icon with unread count and grouped notifications dropdown
 * Always visible, shows count when there are unread items
 * Includes FCM in-app notifications
 */

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, AlertCircle, CreditCard, X, BellRing } from "lucide-react";
import { useFCM } from "@/lib/firebase/FCMProvider";
import type {
   UserCurrentStatus,
   ActiveChatItem,
   PendingOfferItem,
   PendingPaymentItem,
} from "@/types/dashboard";

interface NotificationCenterProps {
   status: UserCurrentStatus;
}

interface NotificationGroup {
   type: "messages" | "offers" | "payments" | "system";
   label: string;
   icon: React.ElementType;
   items: Array<{
      id: string;
      title: string;
      description: string;
      route: string;
      timestamp: Date;
   }>;
}

export function NotificationCenter({ status }: NotificationCenterProps) {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const { notifications: fcmNotifications, unreadCount: fcmUnreadCount, markAsRead } = useFCM();

   // Calculate unread count from status
   const unreadMessages = status.activeChats.filter((c) => c.unreadCount > 0);
   const unreadOffers = status.pendingOffers.filter(
      (o) => o.type === "received"
   );
   const unreadPayments = status.pendingPayments;
   
   // Total unread including FCM notifications
   const statusUnreadCount =
      unreadMessages.reduce((sum, c) => sum + c.unreadCount, 0) +
      unreadOffers.length +
      unreadPayments.length;
   
   const totalUnread = statusUnreadCount + fcmUnreadCount;

   // Build notification groups
   const groups: NotificationGroup[] = [];

   // Add FCM system notifications (task reminders, keyword alerts, etc.)
   if (fcmNotifications.length > 0) {
      groups.push({
         type: "system",
         label: "Notifications",
         icon: BellRing,
         items: fcmNotifications.map((notif) => ({
            id: notif.id,
            title: notif.title,
            description: notif.body,
            route: notif.data?.url || '/home',
            timestamp: notif.timestamp,
         })),
      });
   }

   if (unreadMessages.length > 0) {
      groups.push({
         type: "messages",
         label: "Messages",
         icon: MessageSquare,
         items: unreadMessages.map((chat) => ({
            id: chat.id,
            title: `${chat.unreadCount} new message${
               chat.unreadCount > 1 ? "s" : ""
            } from ${chat.otherPartyName}`,
            description: chat.taskTitle,
            route: `/chat?id=${chat.id}`,
            timestamp: chat.lastMessageTime,
         })),
      });
   }

   if (unreadOffers.length > 0) {
      groups.push({
         type: "offers",
         label: "Offers",
         icon: AlertCircle,
         items: unreadOffers.map((offer) => ({
            id: offer.id,
            title: `New offer: ₹${offer.proposedBudget.toLocaleString(
               "en-IN"
            )}`,
            description: offer.taskTitle,
            route: offer.actionRoute,
            timestamp: offer.createdAt,
         })),
      });
   }

   if (unreadPayments.length > 0) {
      groups.push({
         type: "payments",
         label: "Payments",
         icon: CreditCard,
         items: unreadPayments.map((payment) => ({
            id: payment.id,
            title: `Payment ready: ₹${payment.amount.toLocaleString("en-IN")}`,
            description: payment.taskTitle,
            route: payment.actionRoute,
            timestamp: new Date(),
         })),
      });
   }

   // Close dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      }

      if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isOpen]);

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Notifications"
         >
            <Bell className="w-5 h-5" />
            {totalUnread > 0 && (
               <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
            )}
         </button>

         {isOpen && (
            <>
               <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
               />
               <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-secondary-200 shadow-xl z-50 max-h-[500px] overflow-y-auto">
                  <div className="p-3 border-b border-secondary-100 flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-secondary-900">
                        Notifications
                        {totalUnread > 0 && (
                           <span className="ml-2 text-xs text-secondary-500">
                              ({totalUnread})
                           </span>
                        )}
                     </h3>
                     <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {groups.length === 0 ? (
                     <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                        <p className="text-sm text-secondary-500">
                           No new notifications
                        </p>
                     </div>
                  ) : (
                     <div className="divide-y divide-secondary-100">
                        {groups.map((group) => {
                           const Icon = group.icon;
                           return (
                              <div key={group.type} className="p-2">
                                 <div className="flex items-center gap-2 px-2 py-1 mb-1">
                                    <Icon className="w-4 h-4 text-secondary-500" />
                                    <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wide">
                                       {group.label}
                                    </span>
                                    <span className="text-xs text-secondary-400">
                                       ({group.items.length})
                                    </span>
                                 </div>
                                 <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                       <button
                                          key={item.id}
                                          onClick={() => {
                                             // Mark FCM notification as read
                                             if (group.type === "system") {
                                                markAsRead(item.id);
                                             }
                                             router.push(item.route);
                                             setIsOpen(false);
                                          }}
                                          className="w-full text-left px-2 py-2 rounded hover:bg-secondary-50 transition-colors"
                                       >
                                          <p className="text-xs font-medium text-secondary-900 truncate">
                                             {item.title}
                                          </p>
                                          <p className="text-xs text-secondary-500 truncate mt-0.5">
                                             {item.description}
                                          </p>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}

                  <div className="p-2 border-t border-secondary-100">
                     <button
                        onClick={() => {
                           router.push("/notifications");
                           setIsOpen(false);
                        }}
                        className="w-full text-center text-xs font-medium text-primary-600 hover:text-primary-700 py-2 transition-colors"
                     >
                        View all notifications
                     </button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
