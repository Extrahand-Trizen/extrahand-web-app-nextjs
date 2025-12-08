/**
 * Hero Section - Primary landing section
 *
 * Design principles:
 * - Single dominant CTA: "Post a Task"
 * - Clear value proposition above the fold
 * - Trust indicators visible immediately
 * - Mobile-first responsive design
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, MapPin, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Quick stats for trust
const quickStats = [
   { value: "50K+", label: "Tasks Completed" },
   { value: "10K+", label: "Verified Taskers" },
   { value: "4.8★", label: "Average Rating" },
];

// Trust badges shown below CTA
const trustBadges = [
   { icon: Shield, text: "Verified Taskers" },
   { icon: Clock, text: "Same-day Service" },
   { icon: MapPin, text: "Local Experts" },
];

export const HeroSection: React.FC = () => {
   const router = useRouter();
   const [idea, setIdea] = useState("");

   const onQuickPost = (e: React.FormEvent) => {
      e.preventDefault();
      const q = idea.trim();
      router.push(q ? `/tasks/new?q=${encodeURIComponent(q)}` : "/tasks/new");
   };

   return (
      <section className="relative min-h-[calc(100vh-64px)] flex items-center bg-linear-to-br from-white via-primary-50/30 to-orange-50/50 overflow-hidden">
         {/* Background decoration */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
         </div>

         <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
               {/* Left: Content */}
               <div className="flex flex-col items-start text-left order-1">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     Trusted by 50,000+ users across India
                  </div>

                  {/* Main headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-[1.1] tracking-tight mb-6">
                     Get any task done
                     <span className="block text-primary-500 mt-2">
                        by local experts
                     </span>
                  </h1>

                  {/* Subheadline - specific value prop */}
                  <p className="text-base sm:text-xl text-secondary-600 max-w-xl leading-relaxed mb-8">
                     From home repairs to deliveries, connect with verified
                     taskers in your area. Post your task, get quotes, and get
                     it done — all in one place.
                  </p>

                  {/* Primary CTA Group */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
                     <Link href="/tasks/new" className="w-full sm:w-auto">
                        <Button
                           size="lg"
                           className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                        >
                           Post a Task — It&apos;s Free
                           <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                     </Link>
                     <Link href="/signup" className="w-full sm:w-auto">
                        <Button
                           variant="outline"
                           size="lg"
                           className="w-full sm:w-auto border-2 border-secondary-300 text-secondary-700 font-semibold text-lg px-8 py-6 rounded-xl hover:bg-secondary-50 transition-all"
                        >
                           Become a Tasker
                        </Button>
                     </Link>
                  </div>

                  {/* Quick idea input */}
                  <form onSubmit={onQuickPost} className="w-full max-w-xl mb-4">
                     <label htmlFor="quick-task" className="sr-only">
                        What do you need help with?
                     </label>
                     <div className="flex items-stretch gap-2 bg-white/80 backdrop-blur rounded-xl border border-secondary-200 p-2 shadow-sm">
                        <input
                           id="quick-task"
                           value={idea}
                           onChange={(e) => setIdea(e.target.value)}
                           placeholder="What do you need help with? e.g. Mount TV, Deep clean..."
                           className="flex-1 bg-transparent outline-none px-3 py-3 text-secondary-800 placeholder:text-secondary-400"
                           aria-label="Quick task idea"
                        />
                        <Button
                           type="submit"
                           className="bg-secondary-900 text-white hover:bg-secondary-800 px-5"
                        >
                           Continue
                        </Button>
                     </div>
                     <p className="mt-2 text-xs text-secondary-500">
                        Free to post • Get offers within hours
                     </p>
                  </form>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-500">
                     {trustBadges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                           <badge.icon className="w-4 h-4 text-primary-500" />
                           <span>{badge.text}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right: Visual */}
               <div className="relative order-2">
                  {/* Main image container with aspect ratio for mobile */}
                  <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl aspect-4/3">
                     <Image
                        src="/assets/images/herocard.png"
                        alt="ExtraHand app showing task posting interface"
                        fill
                        priority
                        sizes="(min-width: 1024px) 600px, (min-width: 640px) 520px, 92vw"
                        className="object-contain rounded-2xl shadow-2xl"
                     />

                     {/* Floating card - Task notification */}
                     <div className="absolute -left-4 sm:-left-8 top-1/4 bg-white rounded-xl shadow-lg p-4 motion-safe:animate-float hidden sm:block">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <svg
                                 className="w-5 h-5 text-green-600"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                 />
                              </svg>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-secondary-900">
                                 Task Completed!
                              </p>
                              <p className="text-xs text-secondary-500">
                                 Home cleaning • ₹500
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Floating card - Rating */}
                     <div className="absolute -right-4 sm:-right-8 bottom-1/4 bg-white rounded-xl shadow-lg p-4 motion-safe:animate-float-delayed hidden sm:block">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">⭐</span>
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-secondary-900">
                                 4.9 Rating
                              </p>
                              <p className="text-xs text-secondary-500">
                                 12,500+ reviews
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Background decoration for image (kept subtle) */}
                  <div className="absolute inset-0 -z-10 transform translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4">
                     <div className="w-full h-full bg-primary-200/20 rounded-2xl" />
                  </div>
               </div>
            </div>

            {/* Quick stats - desktop only */}
            <div className="hidden lg:flex items-center justify-start gap-12 mt-16 pt-8 border-t border-secondary-200/50">
               {quickStats.map((stat, idx) => (
                  <div key={idx} className="text-left">
                     <p className="text-3xl font-bold text-secondary-900">
                        {stat.value}
                     </p>
                     <p className="text-sm text-secondary-500 mt-1">
                        {stat.label}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* CSS for floating animation (respects reduced motion) */}
         <style jsx>{`
            @keyframes float {
               0%,
               100% {
                  transform: translateY(0px);
               }
               50% {
                  transform: translateY(-10px);
               }
            }
            .animate-float {
               animation: float 3s ease-in-out infinite;
            }
            .animate-float-delayed {
               animation: float 3s ease-in-out infinite;
               animation-delay: 1.5s;
            }
            @media (prefers-reduced-motion: reduce) {
               .animate-float,
               .animate-float-delayed {
                  animation: none;
               }
            }
            /* Subtle grid pattern overlay */
            section::before {
               content: "";
               position: absolute;
               inset: 0;
               background-image: radial-gradient(
                  rgba(0, 0, 0, 0.03) 1px,
                  transparent 1px
               );
               background-size: 18px 18px;
               mask-image: linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.15),
                  transparent 30%
               );
               pointer-events: none;
            }
         `}</style>
      </section>
   );
};

export default HeroSection;
