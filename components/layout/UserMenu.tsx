import { UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const USER_MENU_ITEMS = [
   { label: "Home", route: "/home" },
   { label: "Dashboard", route: "/tasks" },
   { label: "Profile", route: "/profile" },
   { label: "Post a Task", route: "/tasks/new" },
];

type UserMenuProps = {
   displayName: string;
   initials: string;
   onNavigate: (route: string) => void;
   onLogout: () => Promise<void>;
};

export const UserMenu: React.FC<UserMenuProps> = ({
   displayName,
   initials,
   onNavigate,
   onLogout,
}) => {
   const [open, setOpen] = useState(false);
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
   }, [open]);

   const handleNavigate = (route: string) => {
      onNavigate(route);
      setOpen(false);
   };

   const handleLogout = async () => {
      await onLogout();
      setOpen(false);
   };

   return (
      <div className="relative" ref={menuRef}>
         <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Open user menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-200 bg-white text-secondary-900 shadow-sm transition hover:border-secondary-400"
         >
            <UserRound className="h-5 w-5" />
         </button>
         {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-secondary-100 bg-white p-3 shadow-xl">
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
