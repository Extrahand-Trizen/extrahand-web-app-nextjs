/**
 * How Tasking Works - Simple step-by-step flow
 */

import { UserCircle, Clipboard, Bell, DollarSign } from "lucide-react";

export function HowTaskingWorks() {
   const steps = [
      {
         icon: UserCircle,
         title: "Create a tasker profile",
         description:
            "Add your skills, set your service area, and verify your ID. List the types of tasks you're willing to do.",
      },
      {
         icon: Clipboard,
         title: "Choose your work",
         description:
            "Browse available tasks or wait for requests. You decide which tasks to accept based on location, price, and timing.",
      },
      {
         icon: Bell,
         title: "Get task details and confirm",
         description:
            "Chat with the poster to clarify requirements. Agree on final details and schedule.",
      },
      {
         icon: DollarSign,
         title: "Complete the task and get paid",
         description:
            "Do the work as agreed. Once the poster confirms completion, payment is released to your account.",
      },
   ];

   return (
      <section id="how-it-works" className="py-16 bg-white">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
               How it works
            </h2>

            <div className="space-y-8">
               {steps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                     <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                           {index + 1}
                        </div>
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <step.icon className="w-5 h-5 text-gray-400" />
                           <h3 className="text-xl font-semibold text-gray-900">
                              {step.title}
                           </h3>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
