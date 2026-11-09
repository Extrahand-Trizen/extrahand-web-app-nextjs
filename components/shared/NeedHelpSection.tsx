import { PhoneCall, Sparkles } from "lucide-react";

export function NeedHelpSection() {
   return (
      <section
         aria-labelledby="need-help-heading"
         className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
         <div className="relative isolate overflow-hidden rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-50 via-orange-50 to-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
            <div
               aria-hidden="true"
               className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-amber-200/30 blur-3xl"
            />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
               <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-amber-800">
                     <Sparkles className="size-4" aria-hidden="true" />
                     <span>ExtraHand Support</span>
                  </div>
                  <h2
                     id="need-help-heading"
                     className="text-2xl font-bold tracking-tight text-secondary-900 sm:text-3xl"
                  >
                     Need Help? We&apos;re Here for You!
                  </h2>
                  <p className="mt-3 leading-7 text-secondary-700">
                     Looking for a reliable professional or need assistance
                     with booking a service? Our team is happy to help you.
                  </p>
                  <p className="mt-3 text-sm font-medium text-secondary-600">
                     We&apos;re just a call away. Get in touch with ExtraHand
                     today!
                  </p>
               </div>

               <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:min-w-64 sm:p-6">
                  <p className="text-sm font-medium text-secondary-600">
                     Call Us
                  </p>
                  <a
                     href="tel:+917710247365"
                     className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-base font-bold text-secondary-900 shadow-sm transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                     aria-label="Call ExtraHand at +91 7710247365"
                  >
                     <PhoneCall className="size-5" aria-hidden="true" />
                     +91 7710247365
                  </a>
               </div>
            </div>
         </div>
      </section>
   );
}
