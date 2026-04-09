import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
   verification: {
      google: "tHgCYG0CEAgFmlXSEujUdvF3jSdZK8zDMUpuARfrF9Q",
   },
};

export default function LandingPage() {
   return <LandingPageClient />;
}
