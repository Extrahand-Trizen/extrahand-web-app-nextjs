"use client";

import { useState } from "react";
import {
   ChevronDown,
   ChevronUp,
   Image as ImageIcon,
   CheckCircle2,
} from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDetailsMainProps {
   task: Task;
}

export function TaskDetailsMain({ task }: TaskDetailsMainProps) {
   const [showFullDescription, setShowFullDescription] = useState(false);

   const description = task.description || "";
   const isLongDescription = description.length > 70;
   const displayDescription =
      showFullDescription || !isLongDescription
         ? description
         : description.substring(0, 300) + "...";

   return (
      <div className="space-y-4 lg:space-y-6">
         {/* Description Section */}
         <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-5 lg:p-8 shadow-sm border border-secondary-100/50">
            <h2 className="md:text-lg font-bold text-secondary-900 mb-3 lg:mb-4">
               Task Details
            </h2>
            <div className="text-secondary-700 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
               {displayDescription}
            </div>
            {isLongDescription && (
               <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 text-xs md:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-colors"
               >
                  {showFullDescription ? (
                     <>
                        Show less <ChevronUp className="w-4 h-4" />
                     </>
                  ) : (
                     <>
                        Read more <ChevronDown className="w-4 h-4" />
                     </>
                  )}
               </button>
            )}
         </div>

         {/* Images Section */}
         {task.attachments && task.attachments.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-5 lg:p-8 shadow-sm border border-secondary-100/50">
               <h2 className="text-lg lg:text-xl font-bold text-secondary-900 mb-3 lg:mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photos ({task.attachments.length})
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                  {task.attachments.map((image, index) => (
                     <div
                        key={index}
                        className="aspect-square rounded-lg lg:rounded-xl overflow-hidden bg-secondary-100 shadow-sm"
                     >
                        <img
                           src={image.url}
                           alt={`Task image ${index + 1}`}
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Requirements Section */}
         {task.requirements && task.requirements.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-5 lg:p-8 shadow-sm border border-secondary-100/50">
               <h2 className="text-lg lg:text-xl font-bold text-secondary-900 mb-3 lg:mb-4">
                  Requirements
               </h2>
               <ul className="space-y-2.5 lg:space-y-3">
                  {task.requirements.map((req, index) => (
                     <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm lg:text-base text-secondary-700"
                     >
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                     </li>
                  ))}
               </ul>
            </div>
         )}

         {/* Skills & Tags */}
         {task.tags && task.tags.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-5 lg:p-8 shadow-sm border border-secondary-100/50">
               <h2 className="text-lg lg:text-xl font-bold text-secondary-900 mb-3 lg:mb-4">
                  Skills & Tags
               </h2>
               <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                     <span
                        key={index}
                        className="px-3 py-1.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-xs lg:text-sm rounded-full border border-secondary-200 transition-colors"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
