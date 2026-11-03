import type { Metadata } from "next";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import PartnerCallbackForm from "../PartnerCallbackForm";

const partnerCities = [
   "Warangal",
   "Karimnagar",
   "Nalgonda",
   "Mahabubnagar",
   "Siddipet",
   "Nizamabad",
   "Kalwakurthy",
   "Wanaparthy",
];

export const metadata: Metadata = {
   title: "Partner Interest | ExtraHand",
   description: "Share your details and our team will contact you about becoming an ExtraHand partner.",
};

export default async function PartnerInterestPage() {
   const categories = await categoriesApi.getCategories();

   return <PartnerCallbackForm categories={categories} cities={partnerCities} />;
}
