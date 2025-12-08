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

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
   {
      id: 1,
      name: "Priya Sharma",
      role: "Task Poster",
      location: "Mumbai",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      taskType: "Home Cleaning",
      quote: "I was traveling for work and needed someone to deep clean my apartment before my parents visited. The tasker arrived on time, sent me photos throughout, and my place looked spotless. Saved me so much stress!",
      highlight: "Completed in 4 hours",
   },
   {
      id: 2,
      name: "Rahul Verma",
      role: "Tasker",
      location: "Delhi",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      taskType: "Handyman",
      quote: "ExtraHand has become my primary source of income. I do 15-20 tasks a month, mostly furniture assembly and minor repairs. The app is easy to use and payments are always on time.",
      highlight: "₹45,000+ earned monthly",
   },
   {
      id: 3,
      name: "Ananya Patel",
      role: "Task Poster",
      location: "Bangalore",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      taskType: "Moving Help",
      quote: "Needed help moving heavy furniture to my new flat. Found 2 taskers within an hour, they were professional and careful with my stuff. Way cheaper than a moving company.",
      highlight: "Saved ₹3,000+",
   },
   {
      id: 4,
      name: "Vikram Singh",
      role: "Tasker",
      location: "Pune",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      taskType: "Delivery",
      quote: "As a college student, this is perfect for my schedule. I pick up delivery tasks between classes. Flexible hours and I meet interesting people. Made ₹12,000 last month part-time!",
      highlight: "Flexible schedule",
   },
];

interface TestimonialCardProps {
   testimonial: (typeof testimonials)[0];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
   <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100 hover:shadow-lg transition-shadow">
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary-200 mb-4" />

      {/* Quote text */}
      <p className="text-secondary-700 leading-relaxed mb-6">
         "{testimonial.quote}"
      </p>

      {/* Highlight badge */}
      <div className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full mb-6">
         {testimonial.highlight}
      </div>

      {/* Author info */}
      <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
         {/* Avatar */}
         <div className="w-12 h-12 rounded-full bg-secondary-100 overflow-hidden">
            <img
               src={testimonial.avatar}
               alt={testimonial.name}
               className="w-full h-full object-cover"
               onError={(e) => {
                  // Fallback to initials
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold">${testimonial.name.charAt(
                     0
                  )}</div>`;
               }}
            />
         </div>

         {/* Name and details */}
         <div className="flex-1">
            <p className="font-bold text-secondary-900">{testimonial.name}</p>
            <p className="text-sm text-secondary-500">
               {testimonial.role} • {testimonial.location}
            </p>
         </div>

         {/* Rating */}
         <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
               <Star
                  key={i}
                  className={cn(
                     "w-4 h-4",
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

export const TestimonialsSection: React.FC = () => {
   return (
      <section id="testimonials" className="py-20 bg-secondary-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
               <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
                  Loved by Thousands
               </h2>
               <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                  Real stories from real people who use ExtraHand every day.
               </p>
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
            <div className="mt-12 text-center">
               <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-secondary-100">
                  <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => (
                        <Star
                           key={i}
                           className="w-6 h-6 text-yellow-400 fill-yellow-400"
                        />
                     ))}
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-secondary-900">
                        4.8 out of 5
                     </p>
                     <p className="text-sm text-secondary-500">
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
