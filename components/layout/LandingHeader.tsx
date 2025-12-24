/**
 * Header Component - Clean, conversion-focused navigation
 *
 * Design principles:
 * - Single dominant CTA: "Post a Task"
 * - Clear navigation hierarchy
 * - Mobile-first responsive
 * - Sticky with blur backdrop
 */

"use client";

import React, {
   useState,
   useEffect,
   useRef,
   useCallback,
   useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   Menu,
   X,
   ChevronDown,
   Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import { UserMenu } from "./UserMenu";
import { NotificationCenter } from "@/components/home";
import { mockDashboardData } from "@/lib/data/mockDashboard";
import { taskTypes } from "@/lib/constants";

const USER_MENU_ITEMS = [
   { label: "Home", route: "/home" },
   { label: "Dashboard", route: "/tasks" },
   { label: "Profile", route: "/profile" },
   { label: "Post a Task", route: "/tasks/new" },
];

const navItems = [
   { label: "Categories", href: "#categories", hasDropdown: true },
   { label: "Browse tasks", href: "/discover" },
   { label: "How it works", href: "#how-it-works" },
];

const GuestCtaButtons = () => (
   <>
      <Link href="/login">
         <Button
            size="sm"
            variant="ghost"
            className="text-secondary-700 font-medium"
         >
            Log in
         </Button>
      </Link>
      <Link href="/signup">
         <Button
            size="sm"
            variant="ghost"
            className="border-secondary-300 text-secondary-700 font-medium"
         >
            Signup
         </Button>
      </Link>
      <Link href="/earn-money">
         <Button
            size="sm"
            variant="outline"
            className="border-secondary-300 text-secondary-700 font-medium"
         >
            Become a Tasker
         </Button>
      </Link>
   </>
);

export const LandingHeader: React.FC = () => {
   const router = useRouter();
   const [isScrolled, setIsScrolled] = useState(false);
   const { currentUser, userData, logout } = useAuth();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
   const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
   const [activeRole, setActiveRole] = useState<"poster" | "tasker">("poster");
   const [mobileActiveRole, setMobileActiveRole] = useState<
      "poster" | "tasker"
   >("poster");
   const [showSettings, setShowSettings] = useState(false);
   const categoriesRef = useRef<HTMLDivElement>(null);
   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const isAuthenticated = Boolean(currentUser);
   const displayName =
      userData?.name ?? currentUser?.displayName ?? "Your Account";
   const initials = displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

   // Handle scroll for sticky header styling
   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   // Hover handlers for dropdown
   const handleMouseEnter = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsCategoriesOpen(true);
   };
   const handleMouseLeave = () => {
      hoverTimeoutRef.current = setTimeout(
         () => setIsCategoriesOpen(false),
         150
      );
   };

   // Close mobile menu on resize
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth >= 768) {
            setIsMobileMenuOpen(false);
         }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // Prevent body scroll when mobile menu is open
   useEffect(() => {
      if (isMobileMenuOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
      return () => {
         document.body.style.overflow = "";
      };
   }, [isMobileMenuOpen]);

   const handleNavClick = (href: string, hasDropdown?: boolean) => {
      if (hasDropdown) {
         setIsMobileCategoriesOpen(true);
         return;
      }

      setIsMobileMenuOpen(false);

      if (href.startsWith("#")) {
         const element = document.querySelector(href);
         if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      } else {
         router.push(href);
      }
   };

   const handleRouteChange = useCallback(
      (path: string) => {
         router.push(path);
      },
      [router]
   );

   const handleLogout = useCallback(async () => {
      try {
         await logout();
      } catch (error) {
         console.error("Logout failed", error);
      } finally {
         router.push("/");
      }
   }, [logout, router]);

   return (
      <>
         <header
            className={cn(
               "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
               isScrolled
                  ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100"
                  : "bg-transparent"
            )}
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-14 md:h-16">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-2 shrink-0">
                     <img
                        src="/assets/images/logo.png"
                        alt="ExtraHand"
                        className="size-7 md:size-8"
                        onError={(e) => {
                           (e.target as HTMLImageElement).style.display =
                              "none";
                        }}
                     />
                     <span className="text-lg md:text-xl font-bold text-secondary-900">
                        ExtraHand
                     </span>
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden lg:flex items-center gap-6">
                     <Link href="/tasks/new">
                        <Button className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm">
                           Post a Task
                        </Button>
                     </Link>
                     {navItems.map((item) =>
                        item.hasDropdown ? (
                           <div
                              key={item.label}
                              className="relative"
                              ref={categoriesRef}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                           >
                              <button
                                 className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                                    isCategoriesOpen
                                       ? "text-primary-600"
                                       : "text-secondary-600 hover:text-secondary-900"
                                 )}
                              >
                                 {item.label}
                                 <ChevronDown
                                    className={cn(
                                       "h-4 w-4 transition-transform",
                                       isCategoriesOpen && "rotate-180"
                                    )}
                                 />
                              </button>

                              {/* Dropdown Menu */}
                              {isCategoriesOpen && (
                                 <div className="absolute left-0 top-full pt-2 z-50">
                                    <div className="w-[720px] bg-white rounded-xl shadow-xl border border-secondary-200 p-5">
                                       <div className="flex gap-6">
                                          {/* Left sidebar */}
                                          <div className="w-44 shrink-0 border-r border-secondary-100 pr-5">
                                             <h3 className="text-base font-semibold text-secondary-900 mb-1">
                                                What are you looking for?
                                             </h3>
                                             <p className="text-xs text-secondary-500 mb-4">
                                                Pick a type of task.
                                             </p>
                                             <div className="space-y-2">
                                                <button
                                                   type="button"
                                                   onClick={() =>
                                                      setActiveRole("tasker")
                                                   }
                                                   className={cn(
                                                      "w-full text-left rounded-lg border p-2.5 transition-colors",
                                                      activeRole === "tasker"
                                                         ? "bg-blue-50 border-blue-200"
                                                         : "bg-white border-secondary-200 hover:bg-secondary-50"
                                                   )}
                                                >
                                                   <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                                      As a Tasker
                                                   </span>
                                                   <p className="text-xs text-secondary-600 mt-0.5">
                                                      I&apos;m looking for work
                                                      in ...
                                                   </p>
                                                </button>
                                                <button
                                                   type="button"
                                                   onClick={() =>
                                                      setActiveRole("poster")
                                                   }
                                                   className={cn(
                                                      "w-full text-left rounded-lg border p-2.5 transition-colors",
                                                      activeRole === "poster"
                                                         ? "bg-primary-50 border-primary-200"
                                                         : "bg-white border-secondary-200 hover:bg-secondary-50"
                                                   )}
                                                >
                                                   <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                                                      As a Poster
                                                   </span>
                                                   <p className="text-xs text-secondary-600 mt-0.5">
                                                      I&apos;m looking to hire
                                                      someone for ...
                                                   </p>
                                                </button>
                                             </div>
                                          </div>

                                          {/* Task types grid */}
                                          <div className="flex-1 grid grid-cols-4 gap-x-4 gap-y-0.5 text-sm max-h-[360px] overflow-y-auto">
                                             {taskTypes.map((col, colIdx) => (
                                                <div
                                                   key={colIdx}
                                                   className="space-y-0.5"
                                                >
                                                   {col.map((task) => (
                                                      <Link
                                                         key={task}
                                                         href={
                                                            activeRole ===
                                                            "poster"
                                                               ? `/services/${encodeURIComponent(
                                                                    task
                                                                       .toLowerCase()
                                                                       .replace(
                                                                          /\s+/g,
                                                                          "-"
                                                                       )
                                                                 )}`
                                                               : `/jobs/${encodeURIComponent(
                                                                    task
                                                                       .toLowerCase()
                                                                       .replace(
                                                                          /\s+/g,
                                                                          "-"
                                                                       )
                                                                 )}`
                                                         }
                                                         className="block py-1 text-secondary-600 hover:text-secondary-900 hover:underline"
                                                         onClick={() =>
                                                            setIsCategoriesOpen(
                                                               false
                                                            )
                                                         }
                                                      >
                                                         {task}
                                                      </Link>
                                                   ))}
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                       <div className="mt-3 pt-3 border-t border-secondary-100 text-right">
                                          <Link
                                             href={
                                                activeRole === "poster"
                                                   ? "/services"
                                                   : "/jobs"
                                             }
                                             className="text-sm font-medium text-primary-600 hover:underline"
                                             onClick={() =>
                                                setIsCategoriesOpen(false)
                                             }
                                          >
                                             View All
                                          </Link>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <button
                              key={item.label}
                              onClick={() => handleNavClick(item.href)}
                              className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors"
                           >
                              {item.label}
                           </button>
                        )
                     )}
                  </nav>

                  {/* Desktop CTA Group */}
                  <div className="hidden lg:flex items-center gap-2">
                     {!isAuthenticated ? (
                        <GuestCtaButtons />
                     ) : (
                        <>
                           <NotificationCenter
                              status={mockDashboardData.currentStatus}
                           />
                           <button
                              onClick={() => setShowSettings(!showSettings)}
                              className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors bg-white shadow-sm"
                              title="Settings"
                              aria-label="Settings"
                           >
                              <Settings className="w-5 h-5" />
                           </button>
                           <UserMenu
                              displayName={displayName}
                              initials={initials}
                              onNavigate={handleRouteChange}
                              onLogout={handleLogout}
                           />
                        </>
                     )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                     aria-label="Toggle menu"
                  >
                     {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-secondary-700" />
                     ) : (
                        <Menu className="w-6 h-6 text-secondary-700" />
                     )}
                  </button>
               </div>
            </div>
         </header>

         {/* Settings Panel - Fixed on Right Side (Dev Only) */}
         {showSettings && isAuthenticated && (
            <div className="fixed right-0 top-20 h-1/2 w-64 bg-white border-l border-secondary-200 shadow-xl z-40 overflow-y-auto">
               <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-secondary-900">
                     Settings (Dev)
                  </h3>
                  <button
                     onClick={() => setShowSettings(false)}
                     className="p-1 text-secondary-400 hover:text-secondary-600"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
               <div className="p-4">
                  <p className="text-xs text-secondary-500">
                     Developer settings panel
                  </p>
               </div>
            </div>
         )}

         {/* Mobile Menu Overlay */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
               />

               {/* Menu Panel */}
               <div className="absolute top-16 left-0 right-0 bg-white border-b border-secondary-200 shadow-lg">
                  {!isMobileCategoriesOpen ? (
                     <nav className="p-2">
                        {/* Nav Items */}
                        {navItems.map((item) => (
                           <button
                              key={item.label}
                              onClick={() =>
                                 handleNavClick(item.href, item.hasDropdown)
                              }
                              className="w-full text-left py-2 px-3 md:py-3 md:px-4 text-sm md:text-base font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                           >
                              {item.label}
                           </button>
                        ))}

                        {/* Divider */}
                        <div className="my-4 border-t border-secondary-100" />

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 px-4">
                           <Link href="/tasks/new" className="w-full">
                              <Button className="w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold py-5">
                                 Post a Task
                              </Button>
                           </Link>
                           <Link href="/earn-money" className="w-full">
                              <Button
                                 variant="outline"
                                 className="w-full border-secondary-300 text-secondary-700 font-medium py-5"
                              >
                                 Become a Tasker
                              </Button>
                           </Link>
                           {!isAuthenticated && (
                              <>
                                 <Link href="/signup" className="w-full">
                                    <Button
                                       variant="ghost"
                                       className="w-full text-secondary-700 font-medium py-5"
                                    >
                                       Signup
                                    </Button>
                                 </Link>
                                 <Link href="/login" className="w-full">
                                    <Button
                                       variant="ghost"
                                       className="w-full text-secondary-700 font-medium py-5"
                                    >
                                       Log in
                                    </Button>
                                 </Link>
                              </>
                           )}
                        </div>
                        {isAuthenticated && (
                           <div className="px-4 pb-6">
                              <div className="mb-4 flex items-center gap-4 rounded-2xl border border-secondary-100 bg-secondary-50 p-4">
                                 <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-900 text-lg font-semibold text-white">
                                    {initials}
                                 </span>
                                 <div>
                                    <p className="text-xs uppercase text-secondary-500">
                                       Signed in as
                                    </p>
                                    <p className="text-base font-semibold text-secondary-900">
                                       {displayName}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                 {USER_MENU_ITEMS.map((item) => (
                                    <button
                                       key={item.label}
                                       onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          handleRouteChange(item.route);
                                       }}
                                       className="w-full rounded-xl border border-secondary-100 px-4 py-3 text-left text-secondary-800"
                                    >
                                       {item.label}
                                    </button>
                                 ))}
                                 <button
                                    onClick={async () => {
                                       setIsMobileMenuOpen(false);
                                       await handleLogout();
                                    }}
                                    className="w-full rounded-xl border border-red-100 px-4 py-3 text-left font-semibold text-red-600"
                                 >
                                    Logout
                                 </button>
                              </div>
                           </div>
                        )}
                     </nav>
                  ) : (
                     <div className="p-4">
                        {/* Back Button */}
                        <button
                           onClick={() => setIsMobileCategoriesOpen(false)}
                           className="flex items-center gap-2 text-secondary-700 font-medium mb-4 hover:text-secondary-900"
                        >
                           <ChevronDown className="w-5 h-5 rotate-90" />
                           Back
                        </button>

                        {/* Role Selection */}
                        <div className="mb-4">
                           <h3 className="text-sm font-semibold text-secondary-900 mb-3">
                              What are you looking for?
                           </h3>
                           <div className="flex gap-4">
                              <button
                                 type="button"
                                 onClick={() => setMobileActiveRole("tasker")}
                                 className={cn(
                                    "w-full text-left rounded-lg border p-2 transition-colors",
                                    mobileActiveRole === "tasker"
                                       ? "bg-blue-50 border-blue-200"
                                       : "bg-white border-secondary-200"
                                 )}
                              >
                                 <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                    As a Tasker
                                 </span>
                                 <p className="text-[10px] text-secondary-600 mt-0.5">
                                    I&apos;m looking for work
                                 </p>
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setMobileActiveRole("poster")}
                                 className={cn(
                                    "w-full text-left rounded-lg border p-2 transition-colors",
                                    mobileActiveRole === "poster"
                                       ? "bg-primary-50 border-primary-200"
                                       : "bg-white border-secondary-200"
                                 )}
                              >
                                 <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                                    As a Poster
                                 </span>
                                 <p className="text-[10px] text-secondary-600 mt-0.5">
                                    I&apos;m looking to hire someone
                                 </p>
                              </button>
                           </div>
                        </div>

                        {/* Categories List */}
                        <div className="max-h-[50vh] overflow-y-auto space-y-1 mb-4">
                           {taskTypes.flat().map((task) => (
                              <Link
                                 key={task}
                                 href={
                                    mobileActiveRole === "poster"
                                       ? `/services/${encodeURIComponent(
                                            task
                                               .toLowerCase()
                                               .replace(/\s+/g, "-")
                                         )}`
                                       : `/jobs/${encodeURIComponent(
                                            task
                                               .toLowerCase()
                                               .replace(/\s+/g, "-")
                                         )}`
                                 }
                                 className="block py-2 px-3 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg"
                                 onClick={() => {
                                    setIsMobileCategoriesOpen(false);
                                    setIsMobileMenuOpen(false);
                                 }}
                              >
                                 {task}
                              </Link>
                           ))}
                        </div>

                        {/* View All Button */}
                        <Link
                           href={
                              mobileActiveRole === "poster"
                                 ? "/services"
                                 : "/jobs"
                           }
                           className="block w-full text-center py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg border border-primary-200"
                           onClick={() => {
                              setIsMobileCategoriesOpen(false);
                              setIsMobileMenuOpen(false);
                           }}
                        >
                           View All Categories
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* Spacer for fixed header */}
         <div className="h-16" />
      </>
   );
};
