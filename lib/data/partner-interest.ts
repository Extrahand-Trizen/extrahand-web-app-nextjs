import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import { APP_STORE_URL } from "@/lib/openAppBridge";

export const partnerPlayStoreUrl =
   process.env.NEXT_PUBLIC_PARTNER_PLAY_STORE_URL ||
   "https://play.google.com/store/search?q=ExtraHand%20Partner&c=apps";

export const partnerAppStoreUrl =
   process.env.NEXT_PUBLIC_PARTNER_APP_STORE_URL || APP_STORE_URL;

export const partnerCategories: Pick<CategoriesListItem, "name" | "slug">[] = [
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

export const partnerCities = [
   "Warangal",
   "Karimnagar",
   "Nalgonda",
   "Mahabubnagar",
   "Siddipet",
   "Nizamabad",
   "Kalwakurthy",
   "Wanaparthy",
];
