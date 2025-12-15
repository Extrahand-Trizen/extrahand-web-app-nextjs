"use client";

import React from "react";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
   subtitle?: string;
   description?: string;
}

interface QuestionsSectionProps {
   title?: string;
   questions: Question[];
   openAccordion: number | null;
   onToggle: (index: number) => void;
}

export const QuestionsSection: React.FC<QuestionsSectionProps> = ({
   title,
   questions,
}) => {
   if (!questions || questions.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            {title && (
               <div className="mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                     {title}
                  </h2>
               </div>
            )}

            {/* FAQ Accordion */}
            <div className="max-w-3xl">
               <Accordion type="single" collapsible className="space-y-3">
                  {questions.map((question, index) => (
                     <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                     >
                        <AccordionTrigger className="px-5 py-4 text-left hover:bg-slate-50 text-base font-medium text-slate-900 hover:no-underline data-[state=open]:bg-slate-50">
                           {question.subtitle}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 text-slate-600 leading-relaxed">
                           {question.description}
                        </AccordionContent>
                     </AccordionItem>
                  ))}
               </Accordion>
            </div>
         </div>
      </section>
   );
};
