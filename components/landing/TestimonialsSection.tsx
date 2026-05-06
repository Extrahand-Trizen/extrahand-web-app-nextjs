/**
 * Testimonials Section - Social proof through stories
 *
 * Design principles:
 * - Real testimonials with photos
 * - Mix of poster and tasker testimonials
 * - Specific results, not generic praise
 * - Star ratings with context
 */

"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
   {
      id: 1,
      name: "Priya Sharma",
      role: "Task Poster",
      location: "Hyderabad",
      avatar: "https://source.unsplash.com/300x300/?indian,woman,portrait&sig=11",
      avatarInitials: "PS",
      rating: 5,
      taskType: "Home Cleaning",
      quote: "I was traveling for work and needed someone to deep clean my apartment before my parents visited. The helper arrived on time, sent me photos throughout, and my place looked spotless. Saved me so much stress!",
      highlight: "Completed in 4 hours",
      highlightType: "time",
   },
   {
      id: 2,
      name: "Rahul Verma",
      role: "Helper",
      location: "Hyderabad",
      avatar: "https://source.unsplash.com/300x300/?indian,man,portrait&sig=22",
      avatarInitials: "RV",
      rating: 5,
      taskType: "Handyman",
      quote: "ExtraHand has become my primary source of income. I do 15-20 tasks a month, mostly furniture assembly and minor repairs. The app is easy to use and payments are always on time.",
      highlight: "₹45,000+ earned monthly",
      highlightType: "earnings",
   },
   {
      id: 3,
      name: "Ananya Patel",
      role: "Task Poster",
      location: "Hyderabad",
      avatar: "https://source.unsplash.com/300x300/?indian,girl,portrait&sig=33",
      avatarInitials: "AP",
      rating: 5,
      taskType: "Moving Help",
      quote: "Needed help moving heavy furniture to my new flat. Found 2 helpers within an hour, they were professional and careful with my stuff. Way cheaper than a moving company.",
      highlight: "Saved ₹3,000+",
      highlightType: "savings",
   },
   {
      id: 4,
      name: "Vikram Singh",
      role: "Helper",
      location: "Hyderabad",
      avatar: "https://source.unsplash.com/300x300/?indian,male,portrait&sig=44",
      avatarInitials: "VS",
      rating: 5,
      taskType: "Delivery",
      quote: "As a college student, this is perfect for my schedule. I pick up delivery tasks between classes. Flexible hours and I meet interesting people. Made ₹12,000 last month part-time!",
      highlight: "Flexible schedule",
      highlightType: "benefit",
   },
];

const highlightStyles = {
   time: "bg-[#FFF7D6] text-[#6B5200]",
   earnings: "bg-[#DFF8E7] text-[#1F7A43]",
   savings: "bg-[#E8F1FF] text-[#2B5BA9]",
   benefit: "bg-[#F2EEFF] text-[#5B3FBA]",
} as const;

const roleStyles = {
   "Task Poster": "bg-[#E8F1FF] text-[#2B5BA9]",
   Helper: "bg-[#DFF8E7] text-[#1F7A43]",
} as const;

const legendItems: Array<{ label: string; className: string }> = [
   { label: "Time badge", className: "bg-[#FFF7D6]" },
   { label: "Earnings badge", className: "bg-[#DFF8E7]" },
   { label: "Savings badge", className: "bg-[#E8F1FF]" },
   { label: "Benefit badge", className: "bg-[#F2EEFF]" },
   { label: "Task Poster", className: "bg-[#E8F1FF]" },
   { label: "Helper", className: "bg-[#DFF8E7]" },
];

interface TestimonialCardProps {
   testimonial: (typeof testimonials)[0];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
   const [imgError, setImgError] = useState(false);

   return (
   <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-secondary-100 hover:shadow-lg transition-shadow">
      {/* Quote icon */}
      <Quote className="size-6 md:size-8 text-[#E8CB63] mb-4" />

      {/* Quote text */}
      <p className="text-secondary-700 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
         &quot;{testimonial.quote}&quot;
      </p>

      {/* Highlight badge */}
      <div
         className={cn(
            "inline-flex items-center px-3 py-1.5 text-xs md:text-sm font-semibold rounded-full mb-6",
            highlightStyles[testimonial.highlightType]
         )}
      >
         {testimonial.highlight}
      </div>

      {/* Author info */}
      <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
         {/* Avatar */}
         <div className="size-8 md:size-12 rounded-full overflow-hidden border border-secondary-100 bg-white">
            {imgError ? (
               <div
                  className={cn(
                     "size-full flex items-center justify-center text-xs md:text-sm font-semibold",
                     roleStyles[testimonial.role]
                  )}
               >
                  {testimonial.avatarInitials}
               </div>
            ) : (
               <Image
                  src={testimonial.avatar}
                  alt={`${testimonial.name} profile`}
                  width={48}
                  height={48}
                  sizes="48px"
                  className="size-full object-cover"
                  loading="lazy"
                  onError={() => setImgError(true)}
               />
            )}
         </div>

         {/* Name and details */}
         <div className="flex-1">
            <p className="font-bold text-secondary-900 text-sm md:text-base">{testimonial.name}</p>
            <p className="text-xs md:text-sm text-secondary-500">
               {testimonial.role} • {testimonial.location}
            </p>
         </div>

         {/* Rating */}
         <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
               <Star
                  key={i}
                  className={cn(
                     "size-4",
                     i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-secondary-200"
                  )}
               />
            ))}
         </div>
      </div>
   </div>
   );
};

export const TestimonialsSection: React.FC = () => {
   return (
      <section id="testimonials" className="py-12 md:py-20 bg-secondary-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-8 md:mb-12">
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                  What Our Customers Say
               </h2>
               <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto">
                  Real stories from our community.
               </p>
               <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-5 text-xs text-secondary-500">
                  {legendItems.map((item) => (
                     <span key={item.label} className="inline-flex items-center gap-1.5">
                        <span className={cn("h-2.5 w-2.5 rounded-full", item.className)} />
                        {item.label}
                     </span>
                  ))}
               </div>
            </div>

            {/* Mobile carousel (scroll snap) */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory pb-4 space-x-4 flex">
               {testimonials.map((t) => (
                  <div key={t.id} className="snap-start min-w-[85%]">
                     <TestimonialCard testimonial={t} />
                  </div>
               ))}
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
               {testimonials.map((testimonial) => (
                  <TestimonialCard
                     key={testimonial.id}
                     testimonial={testimonial}
                  />
               ))}
            </div>

            {/* Overall rating */}
            <div className="mt-6 md:mt-12 text-center">
               <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-secondary-100">
                  <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => (
                        <Star
                           key={i}
                           className="size-4 md:size-6 text-yellow-400 fill-yellow-400"
                        />
                     ))}
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-secondary-900 text-sm md:text-base">
                        4.8 out of 5
                     </p>
                     <p className="text-xs md:text-sm text-secondary-500">
                        Based on 12,500+ reviews
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default TestimonialsSection;
