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
   Home,
   LayoutDashboard,
   User as UserIcon,
   PlusCircle,
   LogOut,
   Briefcase,
   HelpCircle,
   Grid3x3,
   MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import { UserMenu } from "./UserMenu";
import { NotificationCenter } from "@/components/home";
import { mockDashboardData } from "@/lib/data/mockDashboard";
import { posterTaskTypes, taskerTaskTypes } from "@/lib/constants";
import {
   categoriesApi,
   CategoriesListItem,
} from "@/lib/api/endpoints/categories";

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

const GuestCtaButtons = ({ onBecomeTasker }: { onBecomeTasker: () => void }) => (
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
      <Button
         size="sm"
         variant="outline"
         onClick={onBecomeTasker}
         className="border-secondary-300 text-secondary-700 font-medium"
      >
         Become a Tasker
      </Button>
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
   const [taskerCategories, setTaskerCategories] = useState<
      CategoriesListItem[]
   >([]);

   const categoriesRef = useRef<HTMLDivElement>(null);
   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   // Show profile when we have Firebase user OR backend userData (e.g. LOCAL_TEST dummy login)
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);
   const displayName =
      userData?.name ||
      currentUser?.displayName ||
      currentUser?.email ||
      "Account";
   const initials = displayName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

   useEffect(() => {
      let isMounted = true;

      const loadTaskerCategories = async () => {
         const categories = await categoriesApi.getCategories();
         if (!isMounted) return;

         const published = categories.filter(
            (category) => category.isPublished !== false
         );
         const sorted = [...published].sort((a, b) =>
            a.name.localeCompare(b.name)
         );
         setTaskerCategories(sorted);
      };

      loadTaskerCategories();

      return () => {
         isMounted = false;
      };
   }, []);

   const toColumns = useCallback(<T,>(items: T[], columnCount: number) => {
      if (!items.length) return [] as T[][];
      const columnSize = Math.ceil(items.length / columnCount);
      return Array.from({ length: columnCount }, (_, idx) =>
         items.slice(idx * columnSize, (idx + 1) * columnSize)
      ).filter((col) => col.length > 0);
   }, []);

   const posterColumns = useMemo(
      () => posterTaskTypes.map((col) => col.map((label) => ({ label }))),
      []
   );
   const taskerColumns = useMemo(() => {
      if (!taskerCategories.length) {
         return taskerTaskTypes.map((col) => col.map((label) => ({ label })));
      }

      const items = taskerCategories.map((category) => ({
         label: category.name,
         slug: category.slug,
      }));

      return toColumns(items, 4);
   }, [taskerCategories, toColumns]);

   const desktopCategories = useMemo(
      () => (activeRole === "poster" ? posterColumns : taskerColumns),
      [activeRole, posterColumns, taskerColumns]
   );
   const mobileCategories = useMemo(
      () => (mobileActiveRole === "poster" ? posterColumns : taskerColumns),
      [mobileActiveRole, posterColumns, taskerColumns]
   );

   const slugify = useCallback(
      (value: string) =>
         value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-"),
      []
   );

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

   const handleBecomeTasker = useCallback(() => {
      router.push("/earn-money");
   }, [router]);

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
                                                         ? "bg-primary-50 border-primary-200"
                                                         : "bg-white border-secondary-200 hover:bg-secondary-50"
                                                   )}
                                                >
                                                   <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
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
                                             {desktopCategories.map(
                                                (col, colIdx) => (
                                                <div
                                                   key={colIdx}
                                                   className="space-y-0.5"
                                                >
                                                   {col.map((task) => {
                                                      const taskLabel = task.label;
                                                      const taskSlug =
                                                         task.slug || slugify(task.label);

                                                      return (
                                                      <Link
                                                         key={taskSlug}
                                                         href={
                                                            activeRole ===
                                                            "poster"
                                                               ? `/services/${encodeURIComponent(
                                                                    taskSlug
                                                                 )}`
                                                               : `/jobs/${encodeURIComponent(
                                                                    taskSlug
                                                                 )}`
                                                         }
                                                         className="block py-1 text-secondary-600 hover:text-secondary-900 hover:underline"
                                                         onClick={() =>
                                                            setIsCategoriesOpen(
                                                               false
                                                            )
                                                         }
                                                      >
                                                         {taskLabel}
                                                      </Link>
                                                      );
                                                   })}
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
                        <GuestCtaButtons onBecomeTasker={handleBecomeTasker} />
                     ) : (
                        <>
                           <NotificationCenter
                              status={mockDashboardData.currentStatus}
                           />

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



         {/* Mobile Menu - Professional Slide-out Drawer */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
               />

               {/* Slide-out Drawer */}
               <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  {!isMobileCategoriesOpen ? (
                     <>
                        {/* User Profile Section */}
                        {isAuthenticated ? (
                           <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                    <span className="text-lg font-bold text-white">
                                       {initials}
                                    </span>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/80 font-medium">
                                       Hello,
                                    </p>
                                    <p className="text-base font-bold text-white truncate">
                                       {displayName}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-4">
                              <h2 className="text-lg font-bold text-white">ExtraHand</h2>
                              <p className="text-xs text-white/80 mt-0.5">Find help or earn money</p>
                           </div>
                        )}

                        {/* Navigation Items */}
                        <nav className="flex-1 overflow-y-auto py-1">
                           {isAuthenticated && (
                              <>
                                 {/* Main Menu Items */}
                                 <div className="px-2 mb-1">
                                    <button
                                       onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          handleRouteChange("/home");
                                       }}
                                       className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                                    >
                                       <Home className="w-4 h-4" />
                                       <span className="text-sm font-medium">Home</span>
                                    </button>
                                    <button
                                       onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          handleRouteChange("/tasks");
                                       }}
                                       className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                                    >
                                       <LayoutDashboard className="w-4 h-4" />
                                       <span className="text-sm font-medium">Dashboard</span>
                                    </button>
                                    <button
                                       onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          handleRouteChange("/chat");
                                       }}
                                       className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                                    >
                                       <MessageCircle className="w-4 h-4" />
                                       <span className="text-sm font-medium">Chat</span>
                                    </button>
                                    <button
                                       onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          handleRouteChange("/profile");
                                       }}
                                       className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                                    >
                                       <UserIcon className="w-4 h-4" />
                                       <span className="text-sm font-medium">Profile</span>
                                    </button>
                                 </div>

                                 <div className="h-px bg-secondary-200 my-1" />
                              </>
                           )}

                           {/* Public Navigation */}
                           <div className="px-2">
                              <button
                                 onClick={() => handleNavClick("#categories", true)}
                                 className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                              >
                                 <Grid3x3 className="w-4 h-4" />
                                 <span className="text-sm font-medium">Categories</span>
                              </button>
                              <button
                                 onClick={() => handleNavClick("/discover")}
                                 className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                              >
                                 <Briefcase className="w-4 h-4" />
                                 <span className="text-sm font-medium">Browse Tasks</span>
                              </button>
                              <button
                                 onClick={() => handleNavClick("#how-it-works")}
                                 className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                              >
                                 <HelpCircle className="w-4 h-4" />
                                 <span className="text-sm font-medium">How it Works</span>
                              </button>
                           </div>

                           <div className="h-px bg-secondary-200 my-1" />

                           {/* CTA Section */}
                           <div className="px-2">
                              <Link href="/tasks/new" onClick={() => setIsMobileMenuOpen(false)}>
                                 <button className="w-full flex items-center gap-3 px-3 py-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-semibold">
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="text-sm">Post a Task</span>
                                 </button>
                              </Link>
                              {!isAuthenticated && (
                                 <button
                                    onClick={() => {
                                       setIsMobileMenuOpen(false);
                                       handleBecomeTasker();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                                 >
                                    <Briefcase className="w-4 h-4" />
                                    <span className="text-sm font-medium">Become a Tasker</span>
                                 </button>
                              )}
                           </div>
                        </nav>

                        {/* Bottom Section */}
                        <div className="border-t border-secondary-200 p-3">
                           {isAuthenticated ? (
                              <button
                                 onClick={async () => {
                                    setIsMobileMenuOpen(false);
                                    await handleLogout();
                                 }}
                                 className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-semibold text-sm"
                              >
                                 <LogOut className="w-4 h-4" />
                                 <span>Logout</span>
                              </button>
                           ) : (
                              <div className="flex flex-col gap-2">
                                 <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full text-sm py-2">
                                       Log in
                                    </Button>
                                 </Link>
                                 <Link href="/signup" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm py-2">
                                       Sign up
                                    </Button>
                                 </Link>
                              </div>
                           )}
                        </div>
                     </>
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
                                       ? "bg-primary-50 border-primary-200"
                                       : "bg-white border-secondary-200"
                                 )}
                              >
                                 <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
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
                           {mobileCategories.flat().map((task) => {
                              const taskLabel = task.label;
                              const taskSlug = task.slug || slugify(task.label);

                              return (
                              <Link
                                 key={taskSlug}
                                 href={
                                    mobileActiveRole === "poster"
                                       ? `/services/${encodeURIComponent(
                                            taskSlug
                                         )}`
                                       : `/jobs/${encodeURIComponent(
                                            taskSlug
                                         )}`
                                 }
                                 className="block py-2 px-3 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg"
                                 onClick={() => {
                                    setIsMobileCategoriesOpen(false);
                                    setIsMobileMenuOpen(false);
                                 }}
                              >
                                 {taskLabel}
                              </Link>
                              );
                           })}
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
