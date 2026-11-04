import {
   TaskerHero,
   WhoCanBeTasker,
   HowTaskingWorks,
   TrustAndExpectations,
   TaskerFAQ,
   FinalCTA,
} from "@/components/earn-money";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import { partnerCategories } from "@/lib/data/partner-interest";

async function getPartnerCategories() {
   try {
      const categories = await categoriesApi.getCategories({ throwOnError: true });
      const allCategories = categories
         .filter((category) => category.name && category.slug)
         .map(({ name, slug }) => ({ name, slug }));

      return allCategories.length > 0 ? allCategories : partnerCategories;
   } catch (error) {
      console.error("Unable to load partner service categories:", error);
      return partnerCategories;
   }
}

export default async function EarnMoneyPage() {
   const categories = await getPartnerCategories();

   return (
      <>
         <main>
            <TaskerHero categories={categories} />
            <WhoCanBeTasker />
            <HowTaskingWorks />
            <TrustAndExpectations />
            <TaskerFAQ />
            <FinalCTA categories={categories} />
         </main>
      </>
   );
}
