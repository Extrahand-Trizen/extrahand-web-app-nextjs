"use client";

import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import { usePartnerLeadSubmission } from "@/lib/hooks/usePartnerLeadSubmission";

export function PartnerInterestModalForm({
   categories,
   cities,
   partnerPlayStoreUrl,
   partnerAppStoreUrl,
}: {
   categories: Pick<CategoriesListItem, "name" | "slug">[];
   cities: string[];
   partnerPlayStoreUrl: string;
   partnerAppStoreUrl: string;
}) {
   const { isSubmitting, message, hasError, handleSubmit } =
      usePartnerLeadSubmission();

   const fieldClassName =
      "h-[42px] w-full min-w-0 rounded-[9px] border border-[#dfe3ea] bg-white px-[10px] text-[13px] text-[#27324a] outline-none placeholder:text-[#9ba3b1] focus:border-[#e4a300] focus:ring-[3px] focus:ring-[#ffb900]/20";

   return (
      <section
         aria-labelledby="partner-interest-heading"
         className="relative max-h-[min(90vh,760px)] w-full overflow-y-auto rounded-[22px] border border-[#eee7d8] bg-white p-5 shadow-[0_24px_80px_rgba(9,17,33,0.3)] sm:p-7"
      >
         <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#a56d00]">
            Let’s work together
         </p>
         <h2
            id="partner-interest-heading"
            className="m-0 text-[25px] font-extrabold leading-tight tracking-[-0.045em] text-[#15213a] sm:text-[28px]"
         >
            Join as Partner
         </h2>
         <p className="my-2 mb-[22px] text-[13px] leading-relaxed text-[#687386]">
            Share your details and our team will contact you about becoming an ExtraHand partner.
         </p>
         <form
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            onSubmit={handleSubmit}
         >
            <label className="grid min-w-0 gap-1.5">
               <span className="text-[11px] font-bold text-[#34405a]">Full Name</span>
               <input
                  autoComplete="name"
                  className={fieldClassName}
                  maxLength={80}
                  minLength={2}
                  name="fullName"
                  placeholder="Enter your full name"
                  required
               />
            </label>
            <label className="grid min-w-0 gap-1.5">
               <span className="text-[11px] font-bold text-[#34405a]">Mobile Number</span>
               <input
                  autoComplete="tel"
                  className={fieldClassName}
                  inputMode="tel"
                  maxLength={16}
                  name="mobileNumber"
                  pattern="(?:\+?91[\s\-]?)?[6-9](?:[\s\-]?[0-9]){9}"
                  placeholder="+91 98765 43210"
                  required
                  title="Enter a valid 10-digit Indian mobile number."
                  type="tel"
               />
            </label>
            <label className="grid min-w-0 gap-1.5">
               <span className="text-[11px] font-bold text-[#34405a]">City</span>
               {cities.length > 0 ? (
                  <select
                     className={fieldClassName}
                     defaultValue=""
                     name="city"
                     required
                  >
                     <option disabled value="">Select your city</option>
                     {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                     ))}
                  </select>
               ) : (
                  <input
                     autoComplete="address-level2"
                     className={fieldClassName}
                     maxLength={80}
                     name="city"
                     placeholder="Enter your city"
                     required
                  />
               )}
            </label>
            <label className="grid min-w-0 gap-1.5">
               <span className="text-[11px] font-bold text-[#34405a]">
                  Service Category
               </span>
               <select
                  className={fieldClassName}
                  defaultValue=""
                  name="serviceCategory"
                  required
               >
                  <option disabled value="">Choose a service</option>
                  {categories.map((category) => (
                     <option key={category.slug} value={category.slug}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </label>
            {message && (
               <p
                  aria-live="polite"
                  className={`col-span-full m-0 text-[11px] leading-relaxed ${hasError ? "text-[#b42318]" : "text-[#177444]"}`}
                  role={hasError ? "alert" : "status"}
               >
                  {message}
               </p>
            )}
            <button
               className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-[#ffb900] bg-[#ffb900] px-[18px] text-[15px] font-extrabold text-[#17213a] shadow-[0_6px_15px_rgba(226,160,0,0.16)] transition-colors hover:bg-[#ffc629] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
               disabled={isSubmitting || categories.length === 0}
               type="submit"
            >
               {isSubmitting ? "Submitting..." : "Submit"}
               <span aria-hidden="true">→</span>
            </button>
            {categories.length === 0 && (
               <p className="col-span-full m-0 text-[11px] text-[#687386]">
                  Service options are temporarily unavailable. Please try again shortly.
               </p>
            )}
            <p className="col-span-full -mt-1 m-0 text-center text-[9px] leading-relaxed text-[#8790a0]">
               By submitting, you agree to be contacted by ExtraHand about partner onboarding.
            </p>
         </form>

         {(partnerPlayStoreUrl || partnerAppStoreUrl) && (
            <div className="mt-4 border-t border-[#e7eaf0] pt-3.5">
               <p className="mb-2.5 text-center text-[11px] font-bold text-[#536077]">
                  Download the Partner App
               </p>
               <div className="flex flex-wrap justify-center gap-2">
                  {partnerPlayStoreUrl && (
                     <a
                        className="inline-flex min-h-10 items-center gap-2 rounded-[9px] border border-[#202839] bg-[#121926] px-3 text-white"
                        href={partnerPlayStoreUrl}
                        rel="noreferrer"
                        target="_blank"
                     >
                        <span aria-hidden="true">▶</span>
                        <span className="text-[10px] leading-tight">
                           GET IT ON<br /><strong className="text-[11px]">Google Play</strong>
                        </span>
                     </a>
                  )}
                  {partnerAppStoreUrl && (
                     <a
                        className="inline-flex min-h-10 items-center gap-2 rounded-[9px] border border-[#202839] bg-[#121926] px-3 text-white"
                        href={partnerAppStoreUrl}
                        rel="noreferrer"
                        target="_blank"
                     >
                        <span aria-hidden="true">●</span>
                        <span className="text-[10px] leading-tight">
                           Download on the<br /><strong className="text-[11px]">App Store</strong>
                        </span>
                     </a>
                  )}
               </div>
            </div>
         )}
      </section>
   );
}
