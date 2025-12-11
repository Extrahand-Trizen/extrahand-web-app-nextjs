import {
   TaskerHero,
   WhoCanBeTasker,
   HowTaskingWorks,
   TrustAndExpectations,
   TaskerFAQ,
   FinalCTA,
} from "@/components/earn-money";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

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
