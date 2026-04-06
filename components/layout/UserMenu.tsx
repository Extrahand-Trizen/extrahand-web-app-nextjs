import { UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const USER_MENU_ITEMS = [
   { label: "Home", route: "/home" },
   { label: "Profile", route: "/profile" },
   { label: "Chat", route: "/chat" },
   { label: "Post a Task", route: "/tasks/new" },
];

type UserMenuRole = "poster" | "tasker";

type UserMenuProps = {
   displayName: string;
   initials: string;
   role: UserMenuRole;
   onNavigate: (route: string) => void;
   onLogout: () => Promise<void>;
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
};

export const UserMenu: React.FC<UserMenuProps> = ({
   displayName,
   initials,
   role,
   onNavigate,
   onLogout,
   open: openProp,
   onOpenChange,
}) => {
   const [internalOpen, setInternalOpen] = useState(false);
   const isControlled = typeof openProp === "boolean";
   const open = isControlled ? openProp : internalOpen;

   const setOpen = useCallback((nextOpen: boolean) => {
      if (!isControlled) {
         setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
   }, [isControlled, onOpenChange]);

   const menuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [open, setOpen]);

   const handleNavigate = (route: string) => {
      onNavigate(route);
      setOpen(false);
   };

   const tasksRoute = role === "tasker" ? "/tasks?tab=myapplications" : "/tasks?tab=mytasks";

   const handleLogout = async () => {
      await onLogout();
      setOpen(false);
   };

   return (
      <div className="relative" ref={menuRef}>
         <button
            onClick={() => setOpen(!open)}
            aria-label="Open user menu"
            className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors bg-white shadow-sm"
         >
            <UserRound className="h-5 w-5" />
         </button>
         {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-secondary-100 bg-white p-3 shadow-xl z-100">
               <div className="mb-2 flex items-center gap-3 rounded-xl bg-secondary-50 px-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-900 text-sm font-semibold text-white">
                     {initials}
                  </span>
                  <div>
                     <p className="text-xs uppercase text-secondary-500">
                        Signed in as
                     </p>
                     <p className="text-sm font-semibold text-secondary-900">
                        {displayName}
                     </p>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <button
                     onClick={() => handleNavigate(tasksRoute)}
                     className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-secondary-800 hover:bg-secondary-50"
                  >
                     {role === "poster" ? "My Tasks" : "My Applications"}
                  </button>
                  {USER_MENU_ITEMS.map((item) => (
                     <button
                        key={item.label}
                        onClick={() => handleNavigate(item.route)}
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-secondary-800 hover:bg-secondary-50"
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
               <div className="my-2 border-t border-secondary-100" />
               <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-secondary-50"
               >
                  Logout
               </button>
            </div>
         )}
      </div>
   );
};
