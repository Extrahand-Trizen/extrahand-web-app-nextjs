/**
 * City Stats Component
 * Display key metrics and trust indicators
 */

"use client";

import { Shield, Star, Clock, Award, Users, CheckCircle2 } from "lucide-react";
import { CityInfo } from "@/lib/data/cities";

interface CityStatsProps {
   city: CityInfo;
}

export function CityStats({ city }: CityStatsProps) {
   const stats = [
      {
         icon: Users,
         value: `${city.activeTaskers.toLocaleString()}+`,
         label: "Verified Taskers",
         color: "from-blue-500 to-cyan-500",
      },
      {
         icon: CheckCircle2,
         value: `${city.completedTasks.toLocaleString()}+`,
         label: "Tasks Completed",
         color: "from-green-500 to-emerald-500",
      },
      {
         icon: Star,
         value: city.avgRating.toString(),
         label: "Average Rating",
         color: "from-yellow-500 to-orange-500",
         suffix: "/5",
      },
      {
         icon: Clock,
         value: "< 2 hrs",
         label: "Avg Response Time",
         color: "from-purple-500 to-pink-500",
      },
   ];

   const trustFeatures = [
      {
         icon: Shield,
         title: "Background Verified",
         description: "All taskers undergo thorough verification",
      },
      {
         icon: Award,
         title: "Quality Guaranteed",
         description: "100% satisfaction or your money back",
      },
      {
         icon: Star,
         title: "Rated & Reviewed",
         description: "Real reviews from real customers",
      },
   ];

   return (
      <section className="py-20 lg:py-28 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
               {stats.map((stat, index) => (
                  <div
                     key={stat.label}
                     className="relative group"
                     style={{
                        animationDelay: `${index * 100}ms`,
                     }}
                  >
                     <div className="relative bg-white rounded-3xl p-8 border-2 border-secondary-100 group-hover:border-transparent transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                        {/* Gradient background on hover */}
                        <div
                           className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                           <div
                              className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-lg`}
                           >
                              <stat.icon className="w-7 h-7" />
                           </div>
                           <div className="text-4xl font-bold text-secondary-900 group-hover:text-white mb-2 transition-colors">
                              {stat.value}
                              {stat.suffix && (
                                 <span className="text-2xl text-secondary-400 group-hover:text-white/80">
                                    {stat.suffix}
                                 </span>
                              )}
                           </div>
                           <div className="text-sm text-secondary-600 group-hover:text-white/90 font-medium transition-colors">
                              {stat.label}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Trust Features */}
            <div className="text-center mb-12">
               <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
                  Why choose ExtraHand?
               </h2>
               <p className="text-lg text-secondary-600">
                  Your safety and satisfaction are our top priorities
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {trustFeatures.map((feature, index) => (
                  <div
                     key={feature.title}
                     className="relative group"
                     style={{
                        animationDelay: `${index * 100}ms`,
                     }}
                  >
                     <div className="bg-gradient-to-br from-secondary-50 to-primary-50/30 rounded-3xl p-8 text-center h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                           <feature.icon className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-3">
                           {feature.title}
                        </h3>
                        <p className="text-secondary-600 leading-relaxed">
                           {feature.description}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
