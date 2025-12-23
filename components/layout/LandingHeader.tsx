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

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";

// Mega-menu task types organized into columns
const taskTypes: string[][] = [
   [
      "Accountant",
      "Admin Assistant",
      "Appliance Repair",
      "Architect",
      "Auto Electrician",
      "AV Specialist",
      "Barista",
      "Bartender",
      "Bricklayer",
      "Cabinet Maker",
      "Car Wash",
      "Carpenter",
      "Carpet Cleaner",
      "Caterer",
      "Chef",
      "Cleaner",
      "Clothing Alteration",
      "Commercial Cleaner",
      "Concreter",
      "Cooking",
      "Copywriter",
      "Courier Services",
   ],
   [
      "Data Entry Specialist",
      "Decking",
      "Delivery",
      "Designer",
      "Digital Design",
      "Drafting",
      "Driving",
      "End Of Lease Cleaner",
      "Engraving",
      "Entertainment",
      "Events Staff",
      "Fencing",
      "Flooring",
      "Food Delivery",
      "Furniture Assembler",
      "Gardener",
      "General Labour",
      "Graffiti Artist",
      "Grocery Delivery",
      "Handyman",
      "HIIT Trainer",
   ],
   [
      "House Cleaner",
      "Housekeeper",
      "Interior Designer",
      "IT Support",
      "Landscaper",
      "Locksmith",
      "Logo Designer",
      "Makeup Artist",
      "Marketing",
      "Mechanic",
      "Mobile Bike Repair",
      "Office Cleaner",
      "Painter",
      "Paver",
      "Pest Controller",
      "Pet Groomer",
      "Pet Minder",
      "Pilates Instructor",
      "Plasterer",
      "Project Management",
      "Proofreader",
   ],
   [
      "Property Maintenance",
      "Receptionist",
      "Removalist",
      "Research Assistant",
      "Resume Writer",
      "Roofing",
      "Rubbish Removal",
      "Tradesman",
      "Translator",
      "Turf Laying",
      "Tutor",
      "Virtual Assistant",
      "Wait Staff",
      "Waterproofing",
      "Web Design & Developer",
      "Wedding Services",
      "Window Cleaner",
      "Yoga Instructor",
   ],
];

const navItems = [
   { label: "Categories", href: "#categories", hasDropdown: true },
   { label: "Browse tasks", href: "/discover" },
   { label: "How it works", href: "#how-it-works" },
];

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
   const [showUserMenu, setShowUserMenu] = useState(false);
   const categoriesRef = useRef<HTMLDivElement>(null);
   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const userMenuRef = useRef<HTMLDivElement>(null);

   const isAuthenticated = Boolean(currentUser);
   const displayName =
      userData?.fullName ?? currentUser?.displayName ?? "Your Account";
   const initials = displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

   const userMenuItems = [
      { label: "Dashboard", route: "/home" },
      { label: "Profile", route: "/profile" },
      { label: "Post a Task", route: "/tasks/new" },
   ];

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

   useEffect(() => {
      if (!showUserMenu) return;

      const handleClickOutside = (event: MouseEvent) => {
         if (
            userMenuRef.current &&
            !userMenuRef.current.contains(event.target as Node)
         ) {
            setShowUserMenu(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [showUserMenu]);

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

   const handleUserMenuAction = async (route?: string) => {
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);

      if (route) {
         router.push(route);
         return;
      }

      try {
         await logout();
      } catch (error) {
         console.error("Logout failed", error);
      } finally {
         router.push("/");
      }
   };

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
                     ) : (
                        <div className="relative" ref={userMenuRef}>
                           <button
                              onClick={() => setShowUserMenu((prev) => !prev)}
                              className="flex items-center gap-3 rounded-full border border-secondary-200 bg-white pl-1 pr-4 py-1.5 shadow-sm"
                           >
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-900 text-base font-semibold text-white">
                                 {initials}
                              </span>
                              <span className="hidden xl:flex flex-col text-left">
                                 <span className="text-xs text-secondary-500">
                                    Welcome back
                                 </span>
                                 <span className="text-sm font-semibold text-secondary-900">
                                    {displayName}
                                 </span>
                              </span>
                              <ChevronDown className="h-4 w-4 text-secondary-500" />
                           </button>
                           {showUserMenu && (
                              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-secondary-100 bg-white p-2 shadow-xl">
                                 {userMenuItems.map((item) => (
                                    <button
                                       key={item.label}
                                       onClick={() =>
                                          handleUserMenuAction(item.route)
                                       }
                                       className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-secondary-800 hover:bg-secondary-50"
                                    >
                                       {item.label}
                                    </button>
                                 ))}
                                 <div className="my-1 border-t border-secondary-100" />
                                 <button
                                    onClick={() => handleUserMenuAction()}
                                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-secondary-50"
                                 >
                                    Logout
                                 </button>
                              </div>
                           )}
                        </div>
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
                                 {userMenuItems.map((item) => (
                                    <button
                                       key={item.label}
                                       onClick={() =>
                                          handleUserMenuAction(item.route)
                                       }
                                       className="w-full rounded-xl border border-secondary-100 px-4 py-3 text-left text-secondary-800"
                                    >
                                       {item.label}
                                    </button>
                                 ))}
                                 <button
                                    onClick={() => handleUserMenuAction()}
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
