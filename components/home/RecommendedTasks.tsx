"use client";

/**
 * Recommended Tasks Carousel Component
 * Displays recommended tasks in a scrollable carousel format
 * Supports both scrolling and navigation arrows
 */

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Clock, Tag } from "lucide-react";

interface RecommendedTask {
   id: string;
   title: string;
   budget: number;
   location: string;
   category: string;
   timeAgo: string;
   applications?: number;
}

// Mock recommended tasks data
const mockRecommendedTasks: RecommendedTask[] = [
   {
      id: "rec_1",
      title: "Deep clean 3BHK apartment before move-in",
      budget: 2500,
      location: "Mumbai",
      category: "Cleaning",
      timeAgo: "2 hours ago",
      applications: 3,
   },
   {
      id: "rec_2",
      title: "Assemble IKEA furniture - 5 pieces",
      budget: 1800,
      location: "Bangalore",
      category: "Handyman",
      timeAgo: "5 hours ago",
      applications: 1,
   },
   {
      id: "rec_3",
      title: "Paint living room walls - 2 coats",
      budget: 4500,
      location: "Delhi",
      category: "Painting",
      timeAgo: "1 day ago",
      applications: 5,
   },
   {
      id: "rec_4",
      title: "Garden maintenance and lawn mowing",
      budget: 1200,
      location: "Pune",
      category: "Gardening",
      timeAgo: "3 hours ago",
      applications: 2,
   },
   {
      id: "rec_5",
      title: "Fix leaking kitchen faucet",
      budget: 800,
      location: "Hyderabad",
      category: "Plumbing",
      timeAgo: "6 hours ago",
      applications: 0,
   },
   {
      id: "rec_6",
      title: "Office furniture moving - 2nd floor",
      budget: 3200,
      location: "Chennai",
      category: "Moving",
      timeAgo: "1 day ago",
      applications: 4,
   },
];

export function RecommendedTasks() {
   const router = useRouter();
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const [showLeftArrow, setShowLeftArrow] = useState(false);
   const [showRightArrow, setShowRightArrow] = useState(true);

   const checkScrollButtons = () => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } =
         scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
   };

   useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
         container.removeEventListener("scroll", checkScrollButtons);
         window.removeEventListener("resize", checkScrollButtons);
      };
   }, []);

   const scroll = (direction: "left" | "right") => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector(".task-card")?.clientWidth || 0;
      const gap = 24; // gap-6 = 24px
      const scrollAmount = (cardWidth + gap) * (direction === "right" ? 1 : -1);

      container.scrollBy({
         left: scrollAmount,
         behavior: "smooth",
      });
   };

   if (mockRecommendedTasks.length === 0) {
      return null;
   }

   return (
      <div className="w-full py-8 sm:py-12 bg-white">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg sm:text-xl font-bold text-secondary-900">
                  Recommended for You
               </h2>
               <div className="flex items-center gap-2">
                  <button
                     onClick={() => scroll("left")}
                     disabled={!showLeftArrow}
                     className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     aria-label="Scroll left"
                  >
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                     onClick={() => scroll("right")}
                     disabled={!showRightArrow}
                     className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     aria-label="Scroll right"
                  >
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Scrollable Carousel Container */}
            <div className="relative">
               {/* Left Gradient Fade */}
               {showLeftArrow && (
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
               )}

               {/* Right Gradient Fade */}
               {showRightArrow && (
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white z-10 pointer-events-none" />
               )}

               {/* Scrollable Container */}
               <div
                  ref={scrollContainerRef}
                  className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2"
               >
                  {mockRecommendedTasks.map((task) => (
                     <div
                        key={task.id}
                        className="task-card flex-shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] min-w-[280px]"
                     >
                        <TaskCard
                           task={task}
                           onClick={() => router.push(`/tasks/${task.id}`)}
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}

function TaskCard({
   task,
   onClick,
}: {
   task: RecommendedTask;
   onClick: () => void;
}) {
   return (
      <button
         onClick={onClick}
         className="w-full bg-white rounded-xl border border-secondary-200 p-3 sm:p-5 hover:border-primary-300 hover:shadow-md transition-all text-left group"
      >
         {/* Category Badge */}
         <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
               <Tag className="w-3 h-3 mr-1" />
               {task.category}
            </span>
            <span className="text-xs text-secondary-500 flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {task.timeAgo}
            </span>
         </div>

         {/* Title */}
         <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {task.title}
         </h3>

         {/* Location */}
         <div className="flex items-center gap-1.5 text-xs md:text-sm text-secondary-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{task.location}</span>
         </div>

         {/* Budget */}
         <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
            <div>
               <div className="text-xl sm:text-2xl font-bold text-secondary-900">
                  ₹{task.budget.toLocaleString("en-IN")}
               </div>
               <div className="text-xs text-secondary-500">Fixed price</div>
            </div>
            {task.applications !== undefined && task.applications > 0 && (
               <div className="text-right">
                  <div className="text-sm font-semibold text-primary-600">
                     {task.applications} offer{task.applications > 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-secondary-500">Applied</div>
               </div>
            )}
         </div>
      </button>
   );
}
