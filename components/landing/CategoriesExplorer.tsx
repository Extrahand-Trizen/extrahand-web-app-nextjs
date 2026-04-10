"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

type Subcategory = {
   _id?: string;
   name: string;
   slug: string;
   categorySlug?: string;
};

type Category = {
   title: string;
   description: string;
   image: string;
   color: string;
   slug?: string;
   subcategories?: Subcategory[];
};

// Color palette for categories (repeats to ensure enough colors)
const colorPalette = [
   "from-emerald-50 to-green-50",
   "from-orange-50 to-amber-50",
   "from-blue-50 to-indigo-50",
   "from-purple-50 to-pink-50",
   "from-cyan-50 to-blue-50",
   "from-rose-50 to-red-50",
   "from-lime-50 to-green-50",
   "from-sky-50 to-blue-50",
   "from-fuchsia-50 to-purple-50",
   "from-teal-50 to-cyan-50",
   "from-yellow-50 to-orange-50",
   "from-slate-50 to-gray-100",
];

const CATEGORY_MARQUEE_DURATION_SECONDS = 50;
const curatedCategories: Category[] = [
   {
      title: "Home Cleaning",
      description: "Book trusted cleaners for regular, deep, or move-in cleaning.",
      image: "/assets/mobilescreens/cleaning.webp",
      color: colorPalette[0],
         slug: "cleaning-services",
      subcategories: [
            { name: "Deep Cleaning", slug: "cleaning-services/deep-cleaning" },
            { name: "Sofa Cleaning", slug: "cleaning-services/sofa-cleaning" },
            { name: "Kitchen Cleaning", slug: "cleaning-services/kitchen-cleaning" },
      ],
   },
   {
      title: "Packers & Movers",
      description: "Get help with house shifting, loading, unloading, and packing.",
      image: "/assets/mobilescreens/moving.webp",
      color: colorPalette[1],
      slug: "packers-movers",
      subcategories: [
         { name: "Home Shifting", slug: "packers-movers/home-shifting" },
         { name: "Packing Help", slug: "packers-movers/packing-help" },
         { name: "Truck Unloading", slug: "packers-movers/truck-unloading" },
      ],
   },
   {
      title: "Delivery & Pickup",
      description: "Same-day local pickup and drop for parcels, groceries, and items.",
      image: "/assets/mobilescreens/delivery.webp",
      color: colorPalette[2],
         slug: "delivery-services",
      subcategories: [
            { name: "Parcel Pickup", slug: "delivery-services/parcel-pickup" },
            { name: "Grocery Delivery", slug: "delivery-services/grocery-delivery" },
            { name: "Document Drop", slug: "delivery-services/document-drop" },
      ],
   },
   {
      title: "AC Repair",
      description: "AC installation, gas refill, maintenance, and repair by experts.",
      image: "https://whirlpoolservicescenterfaridabad.in/wp-content/uploads/2022/12/ac-service.jpg",
      color: colorPalette[3],
      slug: "ac-repair-service",
      subcategories: [
         { name: "AC Service", slug: "ac-repair-service/ac-service" },
         { name: "Gas Refill", slug: "ac-repair-service/gas-refill" },
         { name: "AC Installation", slug: "ac-repair-service/ac-installation" },
      ],
   },
   {
      title: "Electrical",
      description: "Electricians for wiring, switch boards, fittings, and fault fixes.",
      image: "/assets/mobilescreens/electrical.webp",
      color: colorPalette[4],
         slug: "electricians-services",
      subcategories: [
            { name: "Wiring", slug: "electricians-services/wiring" },
            { name: "Fan Installation", slug: "electricians-services/fan-installation" },
            { name: "Light Fixtures", slug: "electricians-services/light-fixtures" },
      ],
   },
   {
      title: "Plumbing",
      description: "Resolve leaks, clogs, pipe issues, and bathroom fitting jobs.",
      image: "/assets/mobilescreens/plumbing.webp",
      color: colorPalette[5],
         slug: "plumbing-services",
      subcategories: [
            { name: "Leak Repair", slug: "plumbing-services/leak-repair" },
            { name: "Tap Installation", slug: "plumbing-services/tap-installation" },
            { name: "Drain Cleaning", slug: "plumbing-services/drain-cleaning" },
      ],
   },
   {
      title: "Appliance Repair",
      description: "Repair and service support for fridge, washing machine, and more.",
      image: "/assets/mobilescreens/handy.webp",
      color: colorPalette[6],
      slug: "appliance-repair",
      subcategories: [
         { name: "Fridge Repair", slug: "appliance-repair/fridge-repair" },
         { name: "Washing Machine", slug: "appliance-repair/washing-machine" },
         { name: "Microwave Repair", slug: "appliance-repair/microwave-repair" },
      ],
   },
   {
      title: "Handyman",
      description: "Quick home fixes, fittings, and odd jobs handled efficiently.",
      image: "/assets/mobilescreens/work.webp",
      color: colorPalette[7],
      slug: "handyperson-general-repairs",
      subcategories: [
         { name: "Curtain Rod Fix", slug: "handyperson-general-repairs/curtain-rod-fix" },
         { name: "Door Repair", slug: "handyperson-general-repairs/door-repair" },
         { name: "Furniture Fix", slug: "handyperson-general-repairs/furniture-fix" },
      ],
   },
   {
      title: "Car Cleaning",
      description: "Interior and exterior car cleaning services at your convenience.",
      image: "https://www.windshieldshatterfix.com/images/car-cleaning.jpg",
      color: colorPalette[8],
      slug: "car-washing-car-cleaning",
      subcategories: [
         { name: "Exterior Wash", slug: "car-washing-car-cleaning/exterior-wash" },
         { name: "Interior Cleaning", slug: "car-washing-car-cleaning/interior-cleaning" },
         { name: "Foam Wash", slug: "car-washing-car-cleaning/foam-wash" },
      ],
   },
   {
      title: "Pest Control",
      description: "Safe and reliable pest control solutions for home and office.",
      image: "/assets/mobilescreens/garden.webp",
      color: colorPalette[9],
      slug: "pest-control",
      subcategories: [
         { name: "Termite Control", slug: "pest-control/termite-control" },
         { name: "Cockroach Control", slug: "pest-control/cockroach-control" },
         { name: "Rodent Control", slug: "pest-control/rodent-control" },
      ],
   },
];

export const CategoriesExplorer = () => {
   const categories = curatedCategories;

   const marqueeItems = [...categories, ...categories];

   return (
      <section className="py-12 md:py-20 bg-linear-to-b from-primary-50/30 via-white to-primary-50/30 relative overflow-hidden">
         <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />

         <div className="max-w-7xl mx-auto md:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-primary-100 rounded-full text-primary-700 text-xs md:text-sm font-medium mb-4">
                  <Sparkles className="size-3 md:size-4" />
                  Popular Categories
               </div>
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Browse by category
               </h2>
               <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto">
                  Discover the most popular task categories and find the perfect
                  help for your needs
               </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl">
               {/* edge fades */}
               <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-28 bg-linear-to-r from-white via-white/80 to-transparent z-10" />
               <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-28 bg-linear-to-l from-white via-white/80 to-transparent z-10" />

               {/* Scrolling cards */}
               {Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                     key={i}
                     className="flex w-max gap-6 py-2 md:py-4"
                     animate={
                        i === 0
                           ? { x: ["0%", "-33.333%"] }
                           : { x: ["-33.333%", "0%"] }
                     }
                     transition={{
                        duration: CATEGORY_MARQUEE_DURATION_SECONDS,
                        ease: "linear",
                        repeat: Infinity,
                     }}
                  >
                     {marqueeItems.map((item, index) => (
                        <motion.div
                           key={`${item.title}-${index}`}
                           className="group flex min-w-[260px] sm:min-w-[320px] lg:min-w-[340px] items-center gap-5 rounded-2xl bg-white p-3 md:p-5 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                           whileHover={{ scale: 1.02, y: -4 }}
                           transition={{ duration: 0.2 }}
                        >
                           <div
                              className={`relative h-16 w-16 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ${item.color}`}
                           >
                              <div className="relative h-full w-full overflow-hidden rounded-lg bg-white">
                                 <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-120 transition-transform duration-300"
                                 />
                              </div>
                           </div>

                           <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                 <h3 className="md:text-lg sm:text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                 </h3>
                                 <ArrowRight className="size-4 md:size-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="mt-2 text-xs md:text-sm text-secondary-600 leading-relaxed">
                                 {item.description}
                              </p>
                              {item.subcategories && item.subcategories.length > 0 && (
                                 <div className="mt-3 flex flex-wrap gap-1.5">
                                    {item.subcategories.slice(0, 3).map((sub) => (
                                       <span
                                          key={sub.slug}
                                          className="inline-block px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-md border border-primary-100"
                                       >
                                          {sub.name}
                                       </span>
                                    ))}
                                    {item.subcategories.length > 3 && (
                                       <span className="inline-block px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded-md">
                                          +{item.subcategories.length - 3} more
                                       </span>
                                    )}
                                 </div>
                              )}
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               ))}
            </div>

            {/* View all button */}
            <div className="text-center mt-6 md:mt-12">
               <Link href="/services" className="inline-flex items-center gap-2 px-5 py-3 md:px-6 bg-primary-500 hover:bg-primary-600 transition-colors font-semibold rounded-xl text-sm md:text-lg shadow-lg text-white opacity-90 cursor-pointer">
                  View all categories
                  <ArrowRight className="h-5 w-5" />
               </Link>
            </div>
         </div>
      </section>
   );
};
