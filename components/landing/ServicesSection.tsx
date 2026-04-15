"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
   CheckCircle2,
   Zap,
   Users,
   Shield,
   MessageCircle,
   Gauge,
   Wrench,
   Sparkles,
   Hammer,
   Layers,
   Truck,
   PawPrint,
   ArrowRight,
   Briefcase,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCategory {
   icon: React.ComponentType<{ className?: string }>;
   title: string;
   iconTone: string;
   iconBg: string;
}

const categories = [
   {
      icon: Zap,
      title: "Electricians",
      iconTone: "text-amber-600",
      iconBg: "bg-amber-50",
   },
   {
      icon: Wrench,
      title: "Plumbers",
      iconTone: "text-sky-600",
      iconBg: "bg-sky-50",
   },
   {
      icon: Sparkles,
      title: "Home Cleaning",
      iconTone: "text-emerald-600",
      iconBg: "bg-emerald-50",
   },
   {
      icon: Hammer,
      title: "Carpenters",
      iconTone: "text-orange-600",
      iconBg: "bg-orange-50",
   },
   {
      icon: Layers,
      title: "Flooring Services",
      iconTone: "text-violet-600",
      iconBg: "bg-violet-50",
   },
   {
      icon: Truck,
      title: "Delivery & Pickup",
      iconTone: "text-cyan-600",
      iconBg: "bg-cyan-50",
   },
   {
      icon: Briefcase,
      title: "General Handyman",
      iconTone: "text-rose-600",
      iconBg: "bg-rose-50",
   },
   {
      icon: PawPrint,
      title: "Pet Care Services",
      iconTone: "text-fuchsia-600",
      iconBg: "bg-fuchsia-50",
   },
];

const whyChoosePoints = [
   {
      icon: Users,
      title: "Compare Service Providers Easily",
      color: "text-blue-600",
      iconBg: "bg-blue-50",
   },
   {
      icon: Gauge,
      title: "Set Your Own Budget for Services",
      color: "text-green-600",
      iconBg: "bg-green-50",
   },
   {
      icon: Shield,
      title: "Verified & Skilled Professionals",
      color: "text-purple-600",
      iconBg: "bg-purple-50",
   },
   {
      icon: MessageCircle,
      title: "Transparent Communication",
      color: "text-orange-600",
      iconBg: "bg-orange-50",
   },
   {
      icon: Zap,
      title: "Quick Response & Booking",
      color: "text-red-600",
      iconBg: "bg-red-50",
   },
   {
      icon: Layers,
      title: "All Services in One Platform",
      color: "text-indigo-600",
      iconBg: "bg-indigo-50",
   },
];

export const ServicesSection: React.FC = () => {
   return (
      <section className="relative py-14 md:py-24 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,245,220,0.5),rgba(255,255,255,1))] overflow-hidden">
         <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary-200/25 blur-3xl" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Hero Section - H1 */}
            <div className="relative mb-12 md:mb-16 flex flex-col items-center text-center">
               <h1
                  className="text-3xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] text-secondary-900 mb-4 max-w-4xl mx-auto"
                  style={{ textWrap: "balance" }}
               >
                  Find & Hire Services Near You at Your Budget
               </h1>
               <p className="text-base md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed text-center">
                  Find trusted service providers for all your Service needs. Share your
                  requirement, set your budget, and get matched with the right
                  professional—only on ExtraHand.
               </p>
            </div>

            {/* One Platform Section - H2 */}
            <div className="mb-16 md:mb-24 bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-secondary-200/40 border border-secondary-100 p-6 md:p-12">
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-6 md:mb-8">
                  One Platform to Book Home Services Within Your Budget
               </h2>
               <p className="text-secondary-600 mb-8 text-base md:text-2xl/9 max-w-5xl">
                  ExtraHand is a smart home services platform that connects customers
                  with verified service providers. Simply post your requirement, mention
                  your budget, and get the best service at your price.
               </p>

               {/* Process steps */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-8">
                  {[
                     "Post Your Requirement",
                     "Set Your Budget",
                     "Get Matched with Experts",
                     "Book Instantly",
                  ].map((step, idx) => (
                     <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50/70 px-4 py-3"
                     >
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-green-100 shrink-0">
                           <CheckCircle2 className="size-4 text-green-700" />
                        </span>
                        <span className="text-secondary-800 font-semibold">{step}</span>
                     </div>
                  ))}
               </div>

               {/* CTAs */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/tasks/new">
                     <Button size="lg" className="w-full sm:w-auto px-7">
                        Post Your Requirement
                        <ArrowRight className="size-4 ml-2" />
                     </Button>
                  </Link>
                  <Link href="/tasks">
                     <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto px-7 border-secondary-300 hover:bg-secondary-50"
                     >
                        Get Quotes Now
                     </Button>
                  </Link>
               </div>
            </div>

            {/* Categories Section - H2 */}
            <div className="mb-16 md:mb-24">
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-2">
                  Our Top Categories
               </h2>
               <p className="text-secondary-600 mb-8 text-base md:text-xl/8 max-w-5xl">
                  Choose from a wide range of home and daily services. All services are
                  handled by verified professionals to ensure quality and safety.
               </p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                  {categories.map((category, idx) => {
                     const Icon = category.icon;
                     const categorySlug = category.title
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                     return (
                        <Link
                           key={idx}
                           href={`/tasks/new?category=${categorySlug}`}
                        >
                           <div className="group bg-white rounded-2xl p-5 md:p-6 text-center border border-secondary-100 hover:shadow-lg hover:shadow-secondary-200/40 hover:border-primary-200 transition-all duration-300 cursor-pointer">
                              <div
                                 className={cn(
                                    "mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5",
                                    category.iconBg
                                 )}
                              >
                                 <Icon className={cn("size-6", category.iconTone)} />
                              </div>
                              <h3 className="font-semibold text-secondary-900 text-sm md:text-lg">
                                 {category.title}
                              </h3>
                           </div>
                        </Link>
                     );
                  })}
               </div>
            </div>

            {/* Why Choose ExtraHand - H2 */}
            <div>
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-2">
                  Why Choose ExtraHand
               </h2>
               <p className="text-secondary-600 mb-8 text-base md:text-xl/8 max-w-5xl">
                  We make your life easier by connecting you with trusted service
                  providers.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whyChoosePoints.map((point, idx) => {
                     const Icon = point.icon;
                     return (
                        <div
                           key={idx}
                           className="group bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-lg hover:shadow-secondary-200/40 transition-all duration-300"
                        >
                           <div
                              className={cn(
                                 "mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5",
                                 point.iconBg
                              )}
                           >
                              <Icon className={cn("size-7", point.color)} />
                           </div>
                           <h3 className="font-semibold text-secondary-900 text-xl/7">
                              {point.title}
                           </h3>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default ServicesSection;
