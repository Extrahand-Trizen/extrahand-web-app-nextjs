import {
   UserCircle,
   Clipboard,
   Bell,
   DollarSign,
   IndianRupee,
} from "lucide-react";

export function HowTaskingWorks() {
   const steps = [
      {
         icon: UserCircle,
         title: "Create a tasker profile",
         description:
            "Add your skills, service area, and complete ID verification.",
      },
      {
         icon: Clipboard,
         title: "Choose your work",
         description:
            "Browse tasks or receive requests and accept the ones that suit you.",
      },
      {
         icon: Bell,
         title: "Confirm task details",
         description:
            "Discuss requirements with the poster and agree on timing and price.",
      },
      {
         icon: IndianRupee,
         title: "Complete the task and get paid",
         description:
            "Finish the work and receive payment after completion is confirmed.",
      },
   ];

   return (
      <section
         id="how-it-works"
         className="py-12 bg-linear-to-b from-secondary-50 to-white"
      >
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
               <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-secondary-900 leading-tight">
                  How it works
               </h2>
               <p className="md:text-lg text-secondary-600">
                  Simple steps to start earning
               </p>
            </div>

            <div className="relative">
               {/* Connection line */}
               <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-linear-to-r from-primary-200 via-primary-300 to-primary-200" />

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {steps.map((step, index) => (
                     <div
                        key={index}
                        className="relative flex flex-col items-center text-center group"
                     >
                        <div className="relative z-10 h-16 w-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                           <step.icon className="size-7 md:size-9 text-white" />
                           <span className="absolute -top-3 -right-3 w-6 h-6 md:w-8 md:h-8 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                              {index + 1}
                           </span>
                        </div>
                        <h3 className="md:text-lg font-bold text-secondary-900 mb-1 md:mb-2">
                           {step.title}
                        </h3>
                        <p className="text-xs md:text-sm max-w-3/4 text-secondary-600 leading-relaxed">
                           {step.description}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
