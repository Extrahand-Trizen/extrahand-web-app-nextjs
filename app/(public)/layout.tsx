import { RouteChrome } from "@/components/layout/RouteChrome";
import { PublicHashScroll } from "@/components/layout/PublicHashScroll";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";

export default function PublicLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <RouteChrome variant="public">
         <PublicHashScroll />
         {children}
         <CookieConsentBanner />
      </RouteChrome>
   );
}
