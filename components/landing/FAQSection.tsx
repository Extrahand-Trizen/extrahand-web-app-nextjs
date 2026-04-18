"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
   question: string;
   answer: string;
}

const faqs: FAQItem[] = [
   {
      question: "What is ExtraHand?",
      answer:
         "ExtraHand is a platform where you can post your work and find people to do it. It connects you with nearby service providers for different tasks, making your work easy and quick.",
   },
   {
      question: "Can I set my own budget for services?",
      answer:
         "Yes, you can mention your budget while posting your requirement and choose a provider that fits your price.",
   },
   {
      question: "Are home service providers verified on ExtraHand?",
      answer: "Yes, all service providers are verified and experienced.",
   },
   {
      question: "Is ExtraHand available in Hyderabad?",
      answer:
         "Yes, ExtraHand is available in Hyderabad and expanding quickly across all areas.",
   },
   {
      question: "Can I book multiple services at once in ExtraHand?",
      answer:
         "Yes, on ExtraHand you can post multiple tasks or services based on your needs. Each task is handled separately, so you can manage different services at the same time.",
   },
];

interface FAQItemComponentProps {
   index: number;
   item: FAQItem;
   isOpen: boolean;
   onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({
   index,
   item,
   isOpen,
   onToggle,
}) => {
   return (
      <div
         className={cn(
            "rounded-2xl border bg-white overflow-hidden transition-all duration-300",
            isOpen
               ? "border-primary-200 shadow-md shadow-primary-100/40"
               : "border-secondary-200 hover:border-secondary-300 hover:shadow-sm"
         )}
      >
         <button
            onClick={onToggle}
            className={cn(
               "w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 transition-colors",
               isOpen ? "bg-primary-50/50" : "hover:bg-secondary-50"
            )}
            aria-expanded={isOpen}
         >
            <div className="flex items-center gap-3 text-left">
               <span
                  className={cn(
                     "inline-flex size-7 items-center justify-center rounded-full text-xs font-bold shrink-0",
                     isOpen
                        ? "bg-primary-500 text-secondary-900"
                        : "bg-secondary-100 text-secondary-600"
                  )}
               >
                  {String(index + 1).padStart(2, "0")}
               </span>
               <span className="font-semibold md:text-[1.06rem] text-secondary-900">
                  {item.question}
               </span>
            </div>
            <span
               className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full border shrink-0 transition-all",
                  isOpen
                     ? "border-primary-200 bg-white"
                     : "border-secondary-200 bg-secondary-50"
               )}
            >
               <ChevronDown
                  className={cn(
                     "size-4 text-secondary-600 transition-transform duration-300",
                     isOpen && "rotate-180"
                  )}
               />
            </span>
         </button>

         <div
            className={cn(
               "grid transition-all duration-300 ease-out",
               isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
         >
            <div className="overflow-hidden">
               <div className="px-5 md:px-6 py-4 md:py-5 border-t border-secondary-100 bg-linear-to-b from-white to-secondary-50/50">
                  <p className="text-secondary-600 leading-relaxed">
                     {item.answer}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export const FAQSection: React.FC = () => {
   const [openIndex, setOpenIndex] = useState<number | null>(0);

   return (
      <section
         id="faqs"
         className="relative py-14 md:py-24 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(232,241,255,0.75),rgba(255,255,255,1))] overflow-hidden"
      >
         <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 rounded-full bg-primary-200/20 blur-3xl"
            style={{ width: "36rem", height: "36rem" }}
         />
         <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-10 md:mb-14">
               <span className="inline-flex px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary-100 text-secondary-700 border border-primary-200">
                  Help Center
               </span>
               <h3 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
                  Frequently Asked Questions
               </h3>
               <p className="text-secondary-600 text-base md:text-lg max-w-2xl mx-auto">
                  Find answers to common questions about ExtraHand and how it works.
               </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                  <FAQItemComponent
                     key={idx}
                     index={idx}
                     item={faq}
                     isOpen={openIndex === idx}
                     onToggle={() =>
                        setOpenIndex(openIndex === idx ? null : idx)
                     }
                  />
               ))}
            </div>
         </div>
      </section>
   );
};

export default FAQSection;
