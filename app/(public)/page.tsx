import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
   title: "Post Your Service Requirement | Get Quotes & Hire Experts | ExtraHand",
   description:
      "Post your service needs, set your budget & get matched with professionals near you. All services in one place. Simple, fast & best platform.",
   verification: {
      google: "tHgCYG0CEAgFmlXSEujUdvF3jSdZK8zDMUpuARfrF9Q",
   },
};

export default function LandingPage() {
   return (
      <>
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Extrahand",
                  url: "https://extrahand.in/",
                  logo: "https://extrahand.in/logo.png",
                  description:
                     "Post your service needs, set your budget & get matched with professionals near you. All services in one place. Simple, fast & best platform.",
                  contactPoint: {
                     "@type": "ContactPoint",
                     telephone: "+91-6281575094",
                     contactType: "customer support",
                     areaServed: "IN",
                     availableLanguage: ["English", "Telugu", "Hindi"],
                  },
                  sameAs: [
                     "https://www.facebook.com/profile.php?id=61587931868799",
                     "https://www.instagram.com/extrahand.in/",
                     "https://x.com/Extrahand278722",
                     "https://www.linkedin.com/company/112403995/admin/dashboard/",
                  ],
               }),
            }}
         />
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                     {
                        "@type": "Question",
                        name: "What is ExtraHand?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "ExtraHand is a platform where you can post your work and find people to do it. It connects you with nearby service providers for different tasks, making your work easy and quick.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Can I set my own budget for services?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes, you can mention your budget while posting your requirement and choose a provider that fits your price.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Are home service providers verified on ExtraHand?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes, all service providers are verified and experienced.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Is ExtraHand available in Hyderabad?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes, ExtraHand is available in Hyderabad and expanding quickly across all areas.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Can I book multiple services at once in ExtraHand?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes, on ExtraHand you can post multiple tasks or services based on your needs. Each task is handled separately, so you can manage different services at the same time.",
                        },
                     },
                  ],
               }),
            }}
         />
         <LandingPageClient />
      </>
   );
}
