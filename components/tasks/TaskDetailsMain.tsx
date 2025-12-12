"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDetailsMainProps {
   task: Task;
}

export function TaskDetailsMain({ task }: TaskDetailsMainProps) {
   const [showFullDescription, setShowFullDescription] = useState(false);

   const description = task.description || "";
   const isLongDescription = description.length > 300;
   const displayDescription =
      showFullDescription || !isLongDescription
         ? description
         : description.substring(0, 300) + "...";

   return (
      <div className="space-y-6">
         {/* Description Section */}
         <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-secondary-100/50">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">
               Task Details
            </h2>
            <div className="text-secondary-700 text-base leading-relaxed whitespace-pre-wrap">
               {displayDescription}
            </div>
            {isLongDescription && (
               <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
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
         {task.images && task.images.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-secondary-100/50">
               <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photos ({task.images.length})
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {task.images.map((image, index) => (
                     <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden bg-secondary-100"
                     >
                        <img
                           src={image}
                           alt={`Task image ${index + 1}`}
                           className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Requirements Section */}
         {task.requirements && task.requirements.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-secondary-100/50">
               <h2 className="text-xl font-bold text-secondary-900 mb-4">
                  Requirements
               </h2>
               <ul className="space-y-3">
                  {task.requirements.map((req, index) => (
                     <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-secondary-700"
                     >
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{req}</span>
                     </li>
                  ))}
               </ul>
            </div>
         )}

         {/* Skills Needed */}
         {task.tags && task.tags.length > 0 && (
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
               <h2 className="text-lg font-semibold text-secondary-900 mb-3">
                  Skills & Tags
               </h2>
               <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                     <span
                        key={index}
                        className="px-3 py-1.5 bg-secondary-100 text-secondary-700 text-sm rounded-full border border-secondary-200"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            </div>
         )}

         {/* Additional Notes */}
         {task.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Additional Notes
               </h3>
               <p className="text-sm text-blue-800">{task.notes}</p>
            </div>
         )}
      </div>
   );
}
