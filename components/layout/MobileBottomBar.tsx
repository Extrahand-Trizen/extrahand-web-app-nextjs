"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, MessageSquare, Plus, User } from "lucide-react";

type Item = {
   href: string;
   label: string;
   icon: React.ComponentType<{ className?: string }>;
   ariaLabel?: string;
};

const items: Item[] = [
   { href: "/", label: "Home", icon: Home },
   { href: "/tasks", label: "Tasks", icon: ListChecks },
   { href: "/tasks/new", label: "Post", icon: Plus },
   { href: "/chat", label: "Chat", icon: MessageSquare },
   { href: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomBar() {
   const pathname = usePathname();

   return (
      <nav
         className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-secondary-200 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
         role="navigation"
         aria-label="Primary"
      >
         <ul className="mx-auto grid max-w-screen-sm grid-cols-5 items-end px-2">
            {items.map((item, i) => {
               const isActive =
                  item.href === "/"
                     ? pathname === "/"
                     : pathname.startsWith(item.href);

               // Make the center action (Post) visually prominent
               const isCenter = i === 2;

               return (
                  <li key={item.href} className="">
                     <Link
                        href={item.href}
                        aria-label={item.ariaLabel || item.label}
                        aria-current={isActive ? "page" : undefined}
                        className={
                           isCenter
                              ? "relative -translate-y-3 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-secondary-900 shadow-lg shadow-primary-500/30 ring-1 ring-primary-600/20"
                              : "mx-auto flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-secondary-600 hover:text-secondary-900"
                        }
                     >
                        <item.icon
                           className={
                              isCenter
                                 ? "h-6 w-6"
                                 : `h-5 w-5 ${
                                      isActive
                                         ? "text-secondary-900"
                                         : "text-secondary-500"
                                   }`
                           }
                        />
                        {!isCenter && (
                           <span
                              className={
                                 isActive ? "text-secondary-900" : undefined
                              }
                           >
                              {item.label}
                           </span>
                        )}
                     </Link>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
}
