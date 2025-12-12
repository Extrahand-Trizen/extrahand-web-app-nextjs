"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function TaskerFAQ() {
   const [openIndex, setOpenIndex] = useState<number | null>(null);

   const faqs = [
      {
         question: "Do I need prior experience?",
         answer:
            "Not for most tasks. If you can do the work competently and safely, you can offer it. Some specialized tasks (electrical work, plumbing) may require proof of qualifications. Be honest about your skill level.",
      },
      {
         question: "Can I choose which tasks I accept?",
         answer:
            "Yes. You decide which tasks to apply for or accept. You're not required to take any task. However, repeatedly accepting and then canceling tasks will hurt your rating.",
      },
      {
         question: "How soon do I get paid?",
         answer:
            "Payment is released to your ExtraHand account within 24 hours of the poster marking the task complete. You can then transfer it to your bank account, which takes 2-3 business days.",
      },
      {
         question: "What happens if a task is cancelled?",
         answer:
            "If the poster cancels before you start, no payment is made. If they cancel after you've started, contact support to review the situation. You may be compensated for work already done.",
      },
      {
         question: "Is there a joining fee?",
         answer:
            "No. Signing up is free. ExtraHand takes a 15% service fee from each task payment you receive.",
      },
      {
         question: "Can I work in multiple cities?",
         answer:
            "Yes, as long as you're available to travel there for tasks. Update your service area in your profile settings.",
      },
      {
         question: "What if I can't complete a task I accepted?",
         answer:
            "Contact the poster immediately and explain. Cancel through the app as soon as possible. Late cancellations damage your rating and may result in penalties if repeated.",
      },
   ];

   return (
      <section className="py-20 bg-secondary-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-10 text-center">
               Common questions
            </h2>

            <div className="space-y-3">
               {faqs.map((faq, index) => (
                  <div
                     key={index}
                     className="bg-white rounded-xl border border-secondary-100 overflow-hidden"
                  >
                     <button
                        onClick={() =>
                           setOpenIndex(openIndex === index ? null : index)
                        }
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary-50 transition-colors"
                     >
                        <span className="font-bold text-secondary-900 pr-4">
                           {faq.question}
                        </span>
                        <ChevronDown
                           className={`w-5 h-5 text-secondary-400 shrink-0 transition-transform ${
                              openIndex === index ? "rotate-180" : ""
                           }`}
                        />
                     </button>
                     {openIndex === index && (
                        <div className="px-5 pb-5 pt-0">
                           <p className="text-secondary-700">{faq.answer}</p>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
