"use client";

/**
 * Header component for landing page
 * Responsive header with mobile menu
 */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/design/utils";
import { Button } from "@/components/ui/button";
import { categoriesApi } from "@/lib/api/endpoints/categories";

const menuItems = [
   { label: "Post a Task", type: "button", route: "/tasks/new" },
   { label: "Browse Tasks", icon: true },
   { label: "How it works" },
   { label: "Benefits" },
   { label: "Login", route: "/login" },
   { label: "Signup", route: "/signup" },
   { label: "Become a Tasker", type: "button", route: "/earn-money" },
];

type HeaderCategory = { name: string; isPublished?: boolean };

// Fallback categories if API fails
const fallbackCategories: HeaderCategory[] = [
   { name: "Accountants", isPublished: true },
   { name: "Admin", isPublished: true },
   { name: "Alterations", isPublished: true },
   { name: "Appliances", isPublished: true },
   { name: "Assembly", isPublished: true },
   { name: "Auto Electricians", isPublished: true },
   { name: "Bakers", isPublished: true },
   { name: "Barbers", isPublished: true },
   { name: "Beauticians", isPublished: true },
   { name: "Bicycle Service", isPublished: true },
   { name: "Bricklaying", isPublished: true },
   { name: "Building & Construction", isPublished: true },
   { name: "Business", isPublished: true },
   { name: "Car Body Work", isPublished: true },
   { name: "Car Detailing", isPublished: true },
   { name: "Car Repair", isPublished: true },
   { name: "Car Service", isPublished: true },
   { name: "Carpentry", isPublished: true },
   { name: "Cat Care", isPublished: true },
   { name: "Catering", isPublished: true },
   { name: "Chef", isPublished: true },
   { name: "Cladding", isPublished: true },
   { name: "Cleaning", isPublished: true },
   { name: "Computers & IT", isPublished: true },
   { name: "Concreting", isPublished: true },
   { name: "Decking", isPublished: true },
   { name: "Delivery", isPublished: true },
   { name: "Design", isPublished: true },
   { name: "Dog Care", isPublished: true },
   { name: "Draftsman", isPublished: true },
   { name: "Driving", isPublished: true },
   { name: "Electricians", isPublished: true },
   { name: "Entertainment", isPublished: true },
   { name: "Events", isPublished: true },
   { name: "Fencing", isPublished: true },
   { name: "Flooring", isPublished: true },
   { name: "Florist", isPublished: true },
   { name: "Furniture Assembly", isPublished: true },
   { name: "Gardening", isPublished: true },
   { name: "Gate Installation", isPublished: true },
   { name: "Hairdressers", isPublished: true },
   { name: "Handyman", isPublished: true },
   { name: "Heating & Cooling", isPublished: true },
   { name: "Home", isPublished: true },
   { name: "Automation And Security", isPublished: true },
   { name: "Home Theatre", isPublished: true },
   { name: "Interior Designer", isPublished: true },
   { name: "Landscaping", isPublished: true },
   { name: "Laundry", isPublished: true },
   { name: "Lawn Care", isPublished: true },
   { name: "Lessons", isPublished: true },
   { name: "Locksmith", isPublished: true },
   { name: "Makeup Artist", isPublished: true },
   { name: "Marketing", isPublished: true },
   { name: "Mobile Mechanic", isPublished: true },
   { name: "Painting", isPublished: true },
   { name: "Paving", isPublished: true },
   { name: "Pet Care", isPublished: true },
   { name: "Photographers", isPublished: true },
   { name: "Plasterer", isPublished: true },
   { name: "Plumbing", isPublished: true },
   { name: "Pool Maintenance", isPublished: true },
   { name: "Removals", isPublished: true },
   { name: "Roofing", isPublished: true },
   { name: "Sharpening", isPublished: true },
   { name: "Staffing", isPublished: true },
   { name: "Tailors", isPublished: true },
   { name: "Tattoo Artists", isPublished: true },
   { name: "Tiling", isPublished: true },
   { name: "Tradesman", isPublished: true },
   { name: "Tutoring", isPublished: true },
   { name: "Wall Hanging & Mounting", isPublished: true },
   { name: "Wallpapering", isPublished: true },
   { name: "Waterproofing", isPublished: true },
   { name: "Web", isPublished: true },
   { name: "Wheel & Tyre Service", isPublished: true },
   { name: "Writing", isPublished: true },
];

export const Header: React.FC = () => {
   const router = useRouter();
   const [activeItem, setActiveItem] = useState<string | null>(null);
   const [showCategories, setShowCategories] = useState(false);
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const [categories, setCategories] = useState<HeaderCategory[]>(
      fallbackCategories
   );
   const [categoriesLoading, setCategoriesLoading] = useState(true);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const mobileMenuRef = useRef<HTMLDivElement>(null);

   // Fetch categories from API on mount
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const categoriesData = await categoriesApi.getCategories({
               includeUnpublished: true,
            });
            const categoryItems = (categoriesData || []).map((cat) => ({
               name: cat.name,
               isPublished: cat.isPublished,
            }));
            setCategories(categoryItems);
         } catch (error) {
            console.error("Error fetching categories:", error);
            // Keep fallback categories on error only
            setCategories(fallbackCategories);
         } finally {
            setCategoriesLoading(false);
         }
      };

      fetchCategories();
   }, []);

   useEffect(() => {
      if (!showCategories) return;

      const handleClick = (e: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target as Node)
         ) {
            setShowCategories(false);
         }
      };

      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
   }, [showCategories]);

   useEffect(() => {
      if (!showMobileMenu) return;

      const handleClick = (e: MouseEvent) => {
         if (
            mobileMenuRef.current &&
            !mobileMenuRef.current.contains(e.target as Node)
         ) {
            setShowMobileMenu(false);
         }
      };

      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
   }, [showMobileMenu]);

   const handleNavigate = (item: (typeof menuItems)[0]) => {
      setActiveItem(item.label);

      if (item.label === "How it works") {
         const el = document.getElementById("how-it-works");
         if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      } else if (item.label === "Benefits") {
         const el = document.getElementById("benefits");
         if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      } else if (item.label === "Become a Tasker") {
         router.push('/earn-money');
      } else if (item.route) {
         router.push(item.route);
      }

      setShowCategories(false);
      setShowMobileMenu(false);
   };

   const handleCategoryClick = (categoryName: string) => {
      setShowCategories(false);
      // Navigate to tasks page with category filter
      router.push(`/discover?category=${encodeURIComponent(categoryName)}`);
   };

   const centerMenu = menuItems.slice(0, 4);
   const rightMenu = menuItems.slice(4);

   return (
      <header className="w-full max-w-full flex flex-row items-center justify-between px-6 md:px-8 lg:px-12 bg-white relative z-[1000] -mt-1 h-16 overflow-x-hidden">
         {/* Left: Logo */}
         <div className="flex flex-row items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
               <img
                  src="/assets/images/logo.png"
                  alt="Extrahand Logo"
                  className="h-8 w-8"
                  onError={(e) => {
                     // Fallback if logo doesn't exist
                     (e.target as HTMLImageElement).style.display = "none";
                  }}
               />
               <span className="text-lg font-bold text-secondary-800 font-sans">
                  Extrahand
               </span>
            </Link>
         </div>

         {/* Mobile Menu Button */}
         <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden bg-transparent border-none text-2xl cursor-pointer p-2 min-w-[40px] h-10 flex items-center justify-center relative z-[1001]"
            aria-label="Toggle menu"
         >
            ☰
         </button>

         {/* Desktop Menu - Centered */}
         <div className="hidden md:flex justify-center items-center h-12 absolute left-1/2 -translate-x-1/2 gap-4 lg:gap-6">
            {centerMenu.map((item, index) =>
               item.label === "Browse Tasks" ? (
                  <div
                     key={index}
                     className="relative flex items-center h-10"
                     ref={dropdownRef}
                  >
                     <button
                        onClick={() => setShowCategories((prev) => !prev)}
                        className={cn(
                           "relative h-10 flex items-center font-sans outline-none",
                           item.type === "button"
                              ? "bg-accent-yellow text-secondary-900 font-semibold text-base border-none rounded-lg px-5 py-3"
                              : showCategories
                              ? "bg-neutral-gray-100 text-secondary-700"
                              : activeItem === item.label
                              ? "text-secondary-700"
                              : "text-secondary-500",
                           "font-medium text-base cursor-pointer"
                        )}
                     >
                        <span>{item.label}</span>
                        {item.icon && (
                           <span
                              className={cn(
                                 "ml-1.5 text-sm",
                                 showCategories
                                    ? "text-secondary-700"
                                    : "text-secondary-500",
                                 "transition-transform duration-200",
                                 showCategories && "rotate-180"
                              )}
                           >
                              ⌄
                           </span>
                        )}
                        {(activeItem === item.label || showCategories) && (
                           <span className="absolute left-1/2 -translate-x-1/2 -top-2 w-full h-0.5 bg-secondary-500 rounded block" />
                        )}
                     </button>
                     {showCategories && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-neutral-gray-200 rounded-lg shadow-lg z-[10000] p-6 w-[90vw] max-w-[650px] max-h-[350px] overflow-y-auto flex gap-8">
                           {categoriesLoading ? (
                              <div className="text-secondary-500 text-sm">Loading categories...</div>
                           ) : categories.length === 0 ? (
                              <div className="text-secondary-500 text-sm">No categories available</div>
                           ) : (
                              Array.from({ length: 4 }).map((_, colIdx) => (
                                 <ul key={colIdx} className="list-none p-0 m-0">
                                    {categories
                                       .slice(
                                          Math.floor(
                                             (categories.length / 4) * colIdx
                                          ),
                                          Math.floor(
                                             (categories.length / 4) * (colIdx + 1)
                                          )
                                       )
                                       .map((cat) => {
                                          const isDisabled =
                                             cat.isPublished === false;

                                          return (
                                             <li key={cat.name}>
                                                {isDisabled ? (
                                                   <span className="block text-secondary-400 px-2 py-1 text-sm rounded font-sans cursor-not-allowed">
                                                      {cat.name}
                                                   </span>
                                                ) : (
                                                   <a
                                                      href="#"
                                                      onClick={(e) => {
                                                         e.preventDefault();
                                                         handleCategoryClick(
                                                            cat.name
                                                         );
                                                      }}
                                                      className="block text-secondary-700 no-underline px-2 py-1 text-sm rounded font-sans transition-colors duration-200 hover:bg-neutral-gray-100 cursor-pointer"
                                                   >
                                                      {cat.name}
                                                   </a>
                                                )}
                                             </li>
                                          );
                                       })}
                                 </ul>
                              ))
                           )}
                        </div>
                     )}
                  </div>
               ) : (
                  <button
                     key={index}
                     onClick={() => handleNavigate(item)}
                     className={cn(
                        "relative h-10 flex items-center font-sans outline-none",
                        item.type === "button"
                           ? "bg-accent-yellow text-secondary-900 font-semibold text-base border-none rounded-lg px-5 py-3"
                           : "bg-transparent",
                        activeItem === item.label
                           ? "text-secondary-700"
                           : "text-secondary-500",
                        "font-medium text-base cursor-pointer"
                     )}
                  >
                     <span>{item.label}</span>
                     {item.icon && (
                        <span className="ml-1.5 text-sm text-secondary-500">
                           ⌄
                        </span>
                     )}
                     {activeItem === item.label && (
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2 w-full h-0.5 bg-secondary-500 rounded block" />
                     )}
                  </button>
               )
            )}
         </div>

         {/* Desktop Right Menu */}
         <div className="hidden md:flex gap-4 lg:gap-5 items-center flex-shrink-0">
            {rightMenu.map((item, index) => (
               <button
                  key={index}
                  onClick={() => handleNavigate(item)}
                  className={cn(
                     "relative h-10 flex items-center font-sans outline-none",
                     item.type === "button"
                        ? "bg-accent-yellow text-secondary-900 font-semibold text-base border-none rounded-lg px-5 py-3"
                        : "bg-transparent text-secondary-900",
                     "font-normal text-base cursor-pointer"
                  )}
               >
                  <span>{item.label}</span>
               </button>
            ))}
         </div>

         {/* Mobile Menu */}
         {showMobileMenu && (
            <div
               ref={mobileMenuRef}
               className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-[9999] p-6 overflow-y-auto"
            >
               <div className="flex flex-col gap-4">
                  {menuItems.map((item, index) => (
                     <button
                        key={index}
                        onClick={() => handleNavigate(item)}
                        className={cn(
                           "text-left py-3 px-4 rounded-lg font-sans",
                           item.type === "button"
                              ? "bg-accent-yellow text-secondary-900 font-semibold"
                              : "text-secondary-700",
                           "text-base"
                        )}
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>
         )}
      </header>
   );
};
