import {
   Wrench,
   Package,
   Briefcase,
   Home,
   Car,
   Droplets,
   Snowflake,
   Bug,
   Scissors,
   Paintbrush,
} from "lucide-react";

const services = [
   { icon: Home, name: "Cleaning", description: "Home, deep, kitchen and office cleaning" },
   { icon: Wrench, name: "Electrician", description: "Wiring, switches, fans and light installation" },
   { icon: Package, name: "Appliance Repair", description: "Washing machine, fridge, TV and purifier repair" },
   { icon: Snowflake, name: "AC Service", description: "Installation, service, gas filling and repair" },
   { icon: Droplets, name: "Plumbing", description: "Taps, pipes, toilets, basins and motors" },
   { icon: Wrench, name: "Carpentry", description: "Furniture, doors, shelves and modular work" },
   { icon: Bug, name: "Pest Control", description: "Termite, cockroach, mosquito and rodent control" },
   { icon: Scissors, name: "Beauty Services", description: "Hair, makeup, nails and skin care" },
   { icon: Paintbrush, name: "Painting", description: "Interior, exterior, putty and texture painting" },
   { icon: Package, name: "Delivery & Logistics", description: "Pickup, courier, grocery and parcel delivery" },
   { icon: Car, name: "Driving", description: "Personal, on-demand and commercial driving" },
   { icon: Briefcase, name: "Daily Labour", description: "Construction, moving, site work and manual labour" },
];

export function WhoCanBeTasker() {
   return (
      <section
         id="how-to-become-partner"
         className="relative overflow-hidden bg-linear-to-b from-white to-primary-50/30 py-16 md:py-20"
      >
         <div className="pointer-events-none absolute -left-40 top-1/4 size-96 rounded-full bg-primary-100/30 blur-3xl" />
         <div className="pointer-events-none absolute -right-40 bottom-1/4 size-96 rounded-full bg-amber-100/30 blur-3xl" />

         <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-9 text-center md:mb-12">
               <span className="mb-4 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-800">
                  Find your kind of work
               </span>
               <h2 className="mb-3 text-3xl font-bold text-secondary-900 sm:text-4xl lg:text-5xl">
                  Who can become a partner?
               </h2>
               <p className="mx-auto max-w-2xl text-sm leading-relaxed text-secondary-600 md:text-base">
                  Put your skills to work. Explore the services you can offer with ExtraHand.
               </p>
            </div>

            <div className="mb-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 md:mb-14">
               {services.map(({ icon: Icon, name, description }) => (
                  <div
                     key={name}
                     className="group relative flex min-h-36 items-start gap-4 overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-secondary-900/5 sm:p-5"
                  >
                     <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary-50/0 via-transparent to-primary-50/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                     <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 transition-all duration-300 group-hover:scale-105 group-hover:border-primary-200 group-hover:bg-primary-100 sm:size-14">
                        <Icon aria-hidden="true" className="size-6 text-primary-600 sm:size-7" />
                     </div>
                     <div className="relative min-w-0 pt-0.5">
                        <h3 className="mb-1.5 font-bold text-secondary-900 transition-colors group-hover:text-primary-800 sm:text-lg">
                           {name}
                        </h3>
                        <p className="text-xs leading-relaxed text-secondary-600 sm:text-sm">
                           {description}
                        </p>
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 md:p-8 border-2 border-green-200 shadow-sm">
               <h3 className="font-bold text-secondary-900 mb-2 text-xl flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-green-500 flex items-center justify-center">
                     <span className="text-white text-lg">✓</span>
                  </div>
                  What you need
               </h3>
               <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-4 text-sm md:text-base">
                  <div className="flex items-center gap-2 text-secondary-700">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Be 18 or older
                  </div>
                  <div className="flex items-center gap-2 text-secondary-700">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Provide ID verification
                  </div>
                  <div className="flex items-center gap-2 text-secondary-700">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Have a phone and reliable internet
                  </div>
                  <div className="flex items-center gap-2 text-secondary-700">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Be able to work legally in your location
                  </div>
                  <div className="flex items-center gap-2 text-secondary-700 sm:col-span-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Communicate clearly and show up on time
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
