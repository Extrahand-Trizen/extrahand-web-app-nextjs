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
   { label: "Browse tasks", href: "/tasks" },
   { label: "How it works", href: "#how-it-works" },
];

export const LandingHeader: React.FC = () => {
   const router = useRouter();
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
   const [activeRole, setActiveRole] = useState<"poster" | "tasker">("poster");
   const categoriesRef = useRef<HTMLDivElement>(null);
   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

   const handleNavClick = (href: string) => {
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
               <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-2 shrink-0">
                     <img
                        src="/assets/images/logo.png"
                        alt="ExtraHand"
                        className="h-8 w-8"
                        onError={(e) => {
                           (e.target as HTMLImageElement).style.display =
                              "none";
                        }}
                     />
                     <span className="text-xl font-bold text-secondary-900">
                        ExtraHand
                     </span>
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-6">
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
                                                      I'm looking for work in
                                                      ...
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
                                                      I'm looking to hire
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
                                                               ? `/tasks/new?category=${encodeURIComponent(
                                                                    task
                                                                 )}`
                                                               : `/tasks?q=${encodeURIComponent(
                                                                    task
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
                                             href="/tasks"
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
                  <div className="hidden md:flex items-center gap-3">
                     <Link href="/login">
                        <Button
                           variant="ghost"
                           className="text-secondary-700 font-medium"
                        >
                           Log in
                        </Button>
                     </Link>
                     <Link href="/signup">
                        <Button
                           variant="ghost"
                           className="border-secondary-300 text-secondary-700 font-medium"
                        >
                           Signup
                        </Button>
                     </Link>
                     <Link href="/signup">
                        <Button
                           variant="outline"
                           className="border-secondary-300 text-secondary-700 font-medium"
                        >
                           Become a Tasker
                        </Button>
                     </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
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
            <div className="fixed inset-0 z-40 md:hidden">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
               />

               {/* Menu Panel */}
               <div className="absolute top-16 left-0 right-0 bg-white border-b border-secondary-200 shadow-lg">
                  <nav className="px-4 py-4">
                     {/* Nav Items */}
                     {navItems.map((item) => (
                        <button
                           key={item.label}
                           onClick={() => handleNavClick(item.href)}
                           className="w-full text-left py-3 px-4 text-base font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                        >
                           {item.label}
                        </button>
                     ))}

                     {/* Divider */}
                     <div className="my-4 border-t border-secondary-100" />

                     {/* CTA Buttons */}
                     <div className="flex flex-col gap-3 px-4">
                        <Link href="/tasks/new" className="w-full">
                           <Button className="w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold py-6">
                              Post a Task
                           </Button>
                        </Link>
                        <Link href="/signup" className="w-full">
                           <Button
                              variant="outline"
                              className="w-full border-secondary-300 text-secondary-700 font-medium py-6"
                           >
                              Become a Tasker
                           </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                           <Button
                              variant="ghost"
                              className="w-full text-secondary-700 font-medium py-6"
                           >
                              Log in
                           </Button>
                        </Link>
                     </div>
                  </nav>
               </div>
            </div>
         )}

         {/* Spacer for fixed header */}
         <div className="h-16" />
      </>
   );
};
