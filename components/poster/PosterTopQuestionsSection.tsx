"use client";

import React from "react";
import type { Question } from "@/types/category";

interface PosterTopQuestionsSectionProps {
   serviceLabel: string;
   questionsTitle?: string;
   questions: Question[];
}

export default function PosterTopQuestionsSection({ serviceLabel, questionsTitle, questions }: PosterTopQuestionsSectionProps) {
   const title = questionsTitle || "Top " + serviceLabel + " related questions";
   return (
      <section className="py-16 md:py-24 bg-amber-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
               {title}
            </h2>
            <div className="space-y-4">
               {questions.map((q, i) => (
                  <details
                     key={i}
                     className="bg-white rounded-lg border border-gray-200"
                  >
                     <summary className="cursor-pointer p-6 font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center">
                        <span>{q.subtitle}</span>
                        <svg
                           className="w-5 h-5 text-gray-500 shrink-0 ml-4"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                           />
                        </svg>
                     </summary>
                     <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                        {q.description}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </section>
   );
}
