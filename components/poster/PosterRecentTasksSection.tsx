"use client";

import React from "react";
import type { PosterStaticTask } from "@/types/category";

interface PosterRecentTasksSectionProps {
   serviceLabel: string;
   sectionTitle?: string;
   sectionDescription?: string;
   tasks: PosterStaticTask[];
}

export default function PosterRecentTasksSection({
   serviceLabel,
   sectionTitle,
   sectionDescription,
   tasks,
}: PosterRecentTasksSectionProps) {
   const title = sectionTitle || `Recent ${(serviceLabel || "service").toLowerCase()} tasks`;
   const description = sectionDescription || "Check out what tasks people want done near you right now.";
   const taskList = Array.isArray(tasks) && tasks.length > 0 ? tasks : [];

   if (taskList.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-[rgb(243,247,255)]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {title}
               </h2>
               {description && (
                  <p className="text-base text-gray-600">{description}</p>
               )}
            </div>

            <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
               <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                  {taskList.map((task, index) => (
                     <div
                        key={index}
                        className="shrink-0 w-[280px] sm:w-[300px] md:w-auto md:min-w-0 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                     >
                        <div className="flex justify-between items-start gap-2 mb-2">
                           <h3 className="text-base font-bold text-gray-900 flex-1 min-w-0 line-clamp-2">
                              {task.title || "Task"}
                           </h3>
                           <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                              {task.price || "—"}
                           </span>
                        </div>

                        {task.location && (
                           <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <svg
                                 className="w-4 h-4 text-gray-400 shrink-0"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z"
                                 />
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                 />
                              </svg>
                              <span className="truncate">{task.location}</span>
                           </div>
                        )}
                        {task.date && (
                           <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <svg
                                 className="w-4 h-4 text-gray-400 shrink-0"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                 />
                              </svg>
                              <span>{task.date}</span>
                           </div>
                        )}

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                           {task.description || ""}
                        </p>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                           {task.profileImage ? (
                              <img
                                 src={task.profileImage}
                                 alt=""
                                 className="w-8 h-8 rounded-full object-cover"
                              />
                           ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                 <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </div>
                           )}
                           {task.rating && (
                              <div className="flex items-center gap-0.5">
                                 <svg
                                    className="w-4 h-4 text-amber-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                 </svg>
                                 <span className="text-sm font-medium text-gray-700">
                                    {task.rating}
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
