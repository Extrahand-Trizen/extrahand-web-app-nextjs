/**
 * Final CTA Section - Conversion-focused ending
 *
 * Design principles:
 * - Single, clear action
 * - Urgency without pressure
 * - Restate value proposition
 * - Option for both user types
 */

import Image from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/openAppBridge";

export const FinalCTASection = () => {
   return (
      <section className="bg-white px-4 py-12 md:py-20">
         <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff5cf] via-[#fff9e8] to-[#ffedb5] px-5 py-8 text-center shadow-sm sm:px-10 sm:py-10">
               <div className="relative mx-auto mb-6 h-56 w-full max-w-[390px] sm:h-64">
                  <div className="absolute inset-x-7 bottom-0 top-5 rounded-3xl bg-white/35" />
                  <div className="absolute left-[8%] top-12 h-40 w-[27%] -rotate-12 overflow-hidden rounded-[1.25rem] border-[5px] border-secondary-900 bg-white shadow-lg sm:top-10 sm:h-48">
                     <Image
                        src="/assets/Book-now/step1.jpeg"
                        alt="Explore services in the ExtraHand app"
                        fill
                        sizes="110px"
                        className="object-cover object-top"
                     />
                  </div>
                  <div className="absolute left-1/2 top-1 h-48 w-[31%] -translate-x-1/2 overflow-hidden rounded-[1.4rem] border-[5px] border-secondary-900 bg-white shadow-xl sm:h-60">
                     <Image
                        src="/assets/Book-now/step2.jpeg"
                        alt="Choose services in the ExtraHand app"
                        fill
                        sizes="125px"
                        className="object-cover object-top"
                     />
                  </div>
                  <div className="absolute right-[8%] top-12 h-40 w-[27%] rotate-12 overflow-hidden rounded-[1.25rem] border-[5px] border-secondary-900 bg-white shadow-lg sm:top-10 sm:h-48">
                     <Image
                        src="/assets/Book-now/step3.jpeg"
                        alt="Schedule a booking in the ExtraHand app"
                        fill
                        sizes="110px"
                        className="object-cover object-top"
                     />
                  </div>
               </div>

               <h2 className="text-2xl font-extrabold leading-tight text-secondary-950 sm:text-3xl">
                  Get trusted home services and everyday essentials in minutes.
               </h2>
               <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-secondary-700 sm:text-base">
                  Download the ExtraHand app and book a service or shop for your daily needs today.
               </p>

               <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                     href={PLAY_STORE_URL}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Get ExtraHand on Google Play"
                     className="inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-black px-4 py-2 text-white shadow-sm transition hover:bg-secondary-900"
                  >
                     <svg aria-hidden="true" width="24" height="24" viewBox="0 0 36 36" fill="none">
                        <polygon points="3,2 33,18 3,34" fill="#34A853" />
                        <polygon points="3,2 19,18 3,34" fill="#FBBC05" />
                        <polygon points="19,18 33,18 3,34" fill="#EA4335" />
                     </svg>
                     <span className="flex flex-col text-left leading-tight">
                        <span className="text-[9px]">GET IT ON</span>
                        <span className="text-sm font-semibold">Google Play</span>
                     </span>
                  </a>
                  <a
                     href={APP_STORE_URL}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Download ExtraHand on the App Store"
                     className="inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-black px-4 py-2 text-white shadow-sm transition hover:bg-secondary-900"
                  >
                     <svg aria-hidden="true" width="24" height="24" viewBox="0 0 28 28" fill="none">
                        <path
                           d="M21.7 14.7c-.1-2.1 1.7-3.1 1.8-3.2-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.7-.8-1.4.1-2.7.8-3.4 2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.3-.7 2.6-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0-.1-2.1-.8-2.1-3.2zm-2-6c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 2-.5 2.6-1.1z"
                           fill="white"
                        />
                     </svg>
                     <span className="flex flex-col text-left leading-tight">
                        <span className="text-[9px]">Download on the</span>
                        <span className="text-sm font-semibold">App Store</span>
                     </span>
                  </a>
               </div>
            </div>
         </div>
      </section>
   );
};

export default FinalCTASection;
