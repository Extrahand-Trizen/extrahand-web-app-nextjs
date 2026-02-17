import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationItem = {
   id: string;
   title: string;
   description: string;
   route?: string;
   timestamp?: string;
};

const notifications: NotificationItem[] = [];

export default function NotificationsPage() {
   return (
      <div className="bg-secondary-50 min-h-[calc(100vh-110px)]">
         <div className="max-w-3xl mx-auto px-6 sm:px-8 md:px-10 py-10">
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-secondary-900">
                  Notifications
               </h1>
               <p className="text-sm text-secondary-600">
                  Stay updated on messages, offers, and payments.
               </p>
            </div>

            {notifications.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 bg-white rounded-xl border border-secondary-200">
                  <div className="w-24 h-24 md:w-28 md:h-28 mb-6 bg-secondary-50 rounded-full flex items-center justify-center">
                     <Bell className="w-12 h-12 md:w-14 md:h-14 text-secondary-300" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-secondary-900 mb-2">
                     No notifications yet
                  </h3>
                  <p className="text-sm md:text-base text-secondary-600 text-center max-w-md mb-6">
                     When you receive messages, offers, or payment updates, they
                     will appear here.
                  </p>
                  <Link href="/home">
                     <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                        Go to Home
                     </Button>
                  </Link>
               </div>
            ) : (
               <div className="bg-white rounded-xl border border-secondary-200 shadow-sm divide-y divide-secondary-100">
                  {notifications.map((item) => (
                     <div
                        key={item.id}
                        className="flex items-start gap-4 px-5 py-4"
                     >
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                           <Bell className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-secondary-900">
                              {item.title}
                           </p>
                           <p className="text-sm text-secondary-600 mt-1">
                              {item.description}
                           </p>
                           {item.timestamp && (
                              <p className="text-xs text-secondary-400 mt-2">
                                 {item.timestamp}
                              </p>
                           )}
                        </div>
                        {item.route && (
                           <Link
                              href={item.route}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
                           >
                              View
                              <ArrowRight className="w-4 h-4" />
                           </Link>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
