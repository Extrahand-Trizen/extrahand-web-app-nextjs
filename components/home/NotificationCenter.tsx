"use client";

/**
 * Notification Center Component
 * Bell icon with empty dropdown. No API calls, no notifications displayed.
 */

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

export function NotificationCenter() {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

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
                     </h3>
                     <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
                        aria-label="Close"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="p-6 text-center">
                     <Bell className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                     <p className="text-sm text-secondary-500">
                        No new notifications
                     </p>
                  </div>

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
