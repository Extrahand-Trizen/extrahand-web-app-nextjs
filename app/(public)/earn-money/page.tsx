import {
   TaskerHero,
   WhoCanBeTasker,
   HowTaskingWorks,
   TrustAndExpectations,
   TaskerFAQ,
   FinalCTA,
} from "@/components/earn-money";

export default function EarnMoneyPage() {
   return (
      <>
         <main>
            <TaskerHero />
            <WhoCanBeTasker />
            <HowTaskingWorks />
            <TrustAndExpectations />
            <TaskerFAQ />
            <FinalCTA />
         </main>
      </>
   );
}
