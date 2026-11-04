import {
   TaskerHero,
   WhoCanBeTasker,
   HowTaskingWorks,
   TrustAndExpectations,
   TaskerFAQ,
   FinalCTA,
} from "@/components/earn-money";
import { partnerCategories } from "@/lib/data/partner-interest";

export default function EarnMoneyPage() {
   return (
      <>
         <main>
            <TaskerHero categories={partnerCategories} />
            <WhoCanBeTasker />
            <HowTaskingWorks />
            <TrustAndExpectations />
            <TaskerFAQ />
            <FinalCTA categories={partnerCategories} />
         </main>
      </>
   );
}
