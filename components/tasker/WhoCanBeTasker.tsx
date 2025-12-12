/**
 * Who Can Be a Tasker - Help users self-select honestly
 */

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
      <section className="py-16 bg-gray-50">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Who becomes a tasker?
               </h2>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  People with skills, time, or equipment who want flexible work.
                  No specific background required, but you should be reliable
                  and able to communicate clearly.
               </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               {taskTypes.map((type) => (
                  <div
                     key={type.category}
                     className="bg-white rounded-lg p-6 border border-gray-200"
                  >
                     <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                           <type.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                           <h3 className="font-semibold text-gray-900 mb-1">
                              {type.category}
                           </h3>
                           <p className="text-sm text-gray-600">
                              {type.examples}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
               <h3 className="font-semibold text-gray-900 mb-2">
                  What you need
               </h3>
               <ul className="space-y-2 text-gray-700">
                  <li>• Be 18 or older</li>
                  <li>• Provide ID verification</li>
                  <li>• Have a phone and reliable internet</li>
                  <li>• Be able to work legally in your location</li>
                  <li>• Communicate clearly and show up on time</li>
               </ul>
            </div>
         </div>
      </section>
   );
}
