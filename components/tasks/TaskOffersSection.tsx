"use client";

import { useState } from "react";
import { Star, CheckCircle, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Offer {
   id: string;
   taskerName: string;
   taskerAvatar?: string;
   price: number;
   rating: number;
   completedTasks: number;
   message: string;
   timestamp: string;
   verified: boolean;
}

interface TaskOffersSectionProps {
   taskId: string;
}

// Mock offers data
const mockOffers: Offer[] = [
   {
      id: "o1",
      taskerName: "Arun Singh",
      price: 1200,
      rating: 4.9,
      completedTasks: 47,
      message:
         "Hi! I have 5 years of experience in deep cleaning services. I use eco-friendly products and provide my own equipment. I can complete this task efficiently within 4-5 hours.",
      timestamp: "2 hours ago",
      verified: true,
   },
   {
      id: "o2",
      taskerName: "Sunita Devi",
      price: 1500,
      rating: 4.8,
      completedTasks: 32,
      message:
         "Hello! Professional cleaning service with all equipment. I specialize in residential deep cleaning and have great reviews. Available this week.",
      timestamp: "4 hours ago",
      verified: true,
   },
   {
      id: "o3",
      taskerName: "Ramesh Kumar",
      price: 1400,
      rating: 4.7,
      completedTasks: 28,
      message:
         "Experienced cleaner with eco-friendly products. I can start immediately and ensure thorough cleaning of all rooms including kitchen and bathrooms.",
      timestamp: "6 hours ago",
      verified: false,
   },
];

export function TaskOffersSection({ taskId }: TaskOffersSectionProps) {
   const [offers, setOffers] = useState<Offer[]>(mockOffers);
   const [sortBy, setSortBy] = useState<"newest" | "price-low" | "rating">(
      "newest"
   );

   const sortedOffers = [...offers].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // newest (default order)
   });

   return (
      <div className="p-4 md:p-8">
         {/* Header */}
         <div className="flex items-center justify-between mb-5 md:mb-8">
            <h2 className="md:text-lg font-bold text-secondary-900">
               Offers ({offers.length})
            </h2>

            {/* Sort Dropdown */}
            {offers.length > 0 && (
               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 text-xs md:text-sm border border-secondary-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
               >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="rating">Highest rated</option>
               </select>
            )}
         </div>

         {/* Offers List */}
         {offers.length === 0 ? (
            <div className="text-center py-16">
               <div className="w-32 h-32 mx-auto mb-6">
                  <svg
                     viewBox="0 0 200 200"
                     fill="none"
                     className="w-full h-full"
                  >
                     <circle cx="100" cy="100" r="90" fill="#F3F4F6" />
                     <path
                        d="M100 60c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40zm0 60c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
                        fill="#9CA3AF"
                     />
                     <circle cx="100" cy="100" r="12" fill="#6B7280" />
                     <path
                        d="M60 50l80 80M140 50l-80 80"
                        stroke="#9CA3AF"
                        strokeWidth="3"
                        strokeLinecap="round"
                     />
                  </svg>
               </div>
               <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  No offers yet
               </h3>
               <p className="text-sm text-secondary-500 max-w-xs mx-auto">
                  Make the first offer and get ahead of the competition!
               </p>
            </div>
         ) : (
            <div className="space-y-3">
               {sortedOffers.map((offer) => (
                  <div
                     key={offer.id}
                     className="p-3 sm:p-4 md:p-6 rounded-xl bg-secondary-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary-100"
                  >
                     <div className="flex flex-col gap-4">
                        {/* Header: Avatar + Name + Time */}
                        <div className="flex items-center justify-between gap-3">
                           <div className="flex gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md">
                                 {offer.taskerName.charAt(0)}
                              </div>

                              <div className="min-w-0">
                                 <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate">
                                       {offer.taskerName}
                                    </h3>
                                    {offer.verified && (
                                       <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                                    )}
                                 </div>

                                 <div className="flex items-center gap-2 text-xs text-secondary-500 mt-1">
                                    <div className="flex items-center gap-1">
                                       <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                       <span className="font-semibold text-secondary-900">
                                          {offer.rating}
                                       </span>
                                    </div>
                                    <span className="text-secondary-300">
                                       •
                                    </span>
                                    <span>{offer.completedTasks} tasks</span>
                                 </div>
                              </div>
                           </div>

                           <span className="text-xs text-secondary-400 font-medium">
                              {offer.timestamp}
                           </span>
                        </div>

                        {/* Message */}
                        <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">
                           {offer.message}
                        </p>

                        {/* Footer: Actions */}

                        {/* Actions */}
                        <div className="flex gap-2 w-full">
                           <Button
                              size="sm"
                              variant="ghost"
                              className="text-secondary-600 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                           >
                              View Profile
                           </Button>

                           <Link href="/chat">
                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="border-secondary-200 text-secondary-700 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                              >
                                 Message
                              </Button>
                           </Link>

                           <Button
                              size="sm"
                              className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] md:text-xs font-semibold px-5"
                           >
                              Accept Offer
                           </Button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
