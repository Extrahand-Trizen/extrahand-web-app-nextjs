import type { Metadata } from "next";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import PartnerCallbackForm from "../PartnerCallbackForm";

const partnerCategories: Pick<CategoriesListItem, "name" | "slug">[] = [
   { name: "Home Cleaning", slug: "cleaning-services" },
   { name: "AC Services", slug: "heating-cooling-services" },
   { name: "Appliance Repair", slug: "appliances-services" },
   { name: "Pest Control", slug: "pest-control-services" },
   { name: "Electrician", slug: "electricians-services" },
   { name: "Plumbing", slug: "plumbing-services" },
   { name: "Carpentry", slug: "carpentry-services" },
   { name: "Beauty Services", slug: "beauticians-services" },
   { name: "Painting", slug: "painting-services" },
   { name: "Car Wash", slug: "car-wash" },
   { name: "Laundry", slug: "laundry-services" },
   { name: "Personal Assistance", slug: "admin-services" },
   { name: "Daily Labour", slug: "hourly-based-services" },
];

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
   return <PartnerCallbackForm categories={partnerCategories} cities={partnerCities} />;
}
