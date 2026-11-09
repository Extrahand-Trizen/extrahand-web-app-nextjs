import { PartnerInterestButton } from "@/components/earn-money/PartnerInterestButton";
import { partnerCategories } from "@/lib/data/partner-interest";
import {
   Users,
   TrendingUp,
   Calendar,
   ArrowRight,
   Sparkles,
} from "lucide-react";

const partnerBenefits = [
   {
      icon: Users,
      title: "Get Customer Leads",
      color: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200/60",
   },
   {
      icon: TrendingUp,
      title: "Grow Your Income",
      color: "text-pink-600",
      iconBg: "bg-pink-50 border-pink-200/60",
   },
   {
      icon: Calendar,
      title: "Manage Bookings",
      color: "text-violet-600",
      iconBg: "bg-violet-50 border-violet-200/60",
   },
];

export function PartnerSection() {
   return (
      <section className="rounded-[30px] border border-secondary-200/80 bg-[#f5f1e8] p-5 shadow-[0_4px_22px_rgba(17,24,39,0.04)] sm:p-7">
         <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr] xl:items-center">
            <div className="space-y-5">
               <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-secondary-800 shadow-sm">
                  <Sparkles className="size-3.5 text-primary-500" />
                  For Service Partners
               </div>

               <div>
                  <h2 className="text-[2.6rem] font-black leading-[0.96] tracking-[-0.06em] text-secondary-900 sm:text-[3.2rem]">
                     Become an
                     <br />
                     ExtraHand
                     <span className="block bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                        Partner
                     </span>
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-secondary-600">
                     Get customer leads and grow your service business.
                  </p>
               </div>

               <PartnerInterestButton
                  categories={partnerCategories}
                  defaultOpen
                  className="group w-full gap-2.5 bg-gradient-to-r from-primary-500 to-amber-500 px-6 py-6 text-base font-bold text-white shadow-md shadow-primary-500/20 hover:from-primary-600 hover:to-amber-600 sm:w-auto"
               >
                  Register as a Partner
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
               </PartnerInterestButton>
            </div>

            <div className="space-y-3">
               {partnerBenefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                     <div
                        key={benefit.title}
                        className="flex items-center gap-3 rounded-2xl border border-secondary-100 bg-white/70 p-3 shadow-sm"
                     >
                        <div className="flex size-10 items-center justify-center rounded-xl border bg-white shadow-sm">
                           <Icon className={`size-5 ${benefit.color}`} />
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-3">
                           <span className="text-base font-bold text-secondary-800">{benefit.title}</span>
                           <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-100 text-[10px] font-black text-secondary-500">
                              {idx + 1}
                           </span>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}

export default PartnerSection;
