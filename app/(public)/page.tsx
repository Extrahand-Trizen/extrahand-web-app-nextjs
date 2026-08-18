import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
   title: "Extrahand | Get Expert Professional Local & Home Services Near You",
   description:
      "Connect with trusted local professionals for plumbing, electrical, cleaning, painting, and repairs. Compare quotes or book services instantly.",
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
                     "Connect with trusted local professionals for plumbing, electrical, cleaning, painting, and repairs. Compare quotes or book services instantly.",
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
                           text: "ExtraHand is a local services marketplace that connects customers with verified professionals for home, office, maintenance, repair, and cleaning services.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "How does Choose Your Budget work?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Customers post a requirement and set their preferred budget. Verified service providers send offers, and customers choose the best one.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "What is Instant Service?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Instant Service allows customers to book services immediately at fixed prices. A verified professional is assigned automatically.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Are service providers verified?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes. Service providers go through a verification process before joining the platform.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Can I compare multiple offers?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes. The Choose Your Budget model allows customers to compare offers from different professionals.",
                        },
                     },
                     {
                        "@type": "Question",
                        name: "Can I book emergency services?",
                        acceptedAnswer: {
                           "@type": "Answer",
                           text: "Yes. Instant Service is designed for faster booking and urgent requirements.",
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
