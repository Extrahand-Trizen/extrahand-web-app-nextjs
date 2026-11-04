import type { Metadata } from "next";
import { partnerCategories, partnerCities } from "@/lib/data/partner-interest";
import PartnerCallbackForm from "../PartnerCallbackForm";

export const metadata: Metadata = {
   title: "Partner Interest | ExtraHand",
   description: "Share your details and our team will contact you about becoming an ExtraHand partner.",
};

export default async function PartnerInterestPage() {
   return <PartnerCallbackForm categories={partnerCategories} cities={partnerCities} />;
}
