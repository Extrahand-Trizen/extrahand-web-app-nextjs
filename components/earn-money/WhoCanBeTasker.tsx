import { Wrench, Package, Briefcase, Home, Car, Users } from "lucide-react";

export function WhoCanBeTasker() {
   const taskTypes = [
      {
         icon: Home,
         category: "Home Services",
         examples: "Cleaning, repairs, assembly, gardening",
      },
      {
         icon: Package,
         category: "Moving & Delivery",
         examples: "Pick up and drop off, furniture moving, packing",
      },
      {
         icon: Wrench,
         category: "Handyman Work",
         examples: "Minor repairs, installations, maintenance",
      },
      {
         icon: Briefcase,
         category: "Professional Help",
         examples: "Admin tasks, data entry, research, tutoring",
      },
      {
         icon: Car,
         category: "Errands",
         examples: "Shopping, returns, queuing, collecting items",
      },
      {
         icon: Users,
         category: "Personal Assistance",
         examples: "Event help, pet care, companionship",
      },
   ];

   return (
      <section className="py-12 bg-white">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
                  Who becomes a tasker?
               </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               {taskTypes.map((type) => (
                  <div
                     key={type.category}
                     className="group bg-white rounded-2xl p-6 border-2 border-secondary-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                     <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <type.icon className="w-7 h-7 text-primary-600" />
                        </div>
                        <div>
                           <h3 className="font-bold text-secondary-900 mb-2 text-lg">
                              {type.category}
                           </h3>
                           <p className="text-sm text-secondary-600 leading-relaxed">
                              {type.examples}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-sm">
               <h3 className="font-bold text-secondary-900 mb-4 text-xl flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                     <span className="text-white text-lg">✓</span>
                  </div>
                  What you need
               </h3>
               <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
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
