import { RouteChrome } from "@/components/layout/RouteChrome";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import { FCMProvider } from "@/lib/firebase/FCMProvider";
import { SocketProvider } from "@/lib/socket/SocketProvider";

export default function ProtectedLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <FCMProvider>
         <SocketProvider>
            <RouteChrome variant="protected">
               {children}
               <CookieConsentBanner />
            </RouteChrome>
         </SocketProvider>
      </FCMProvider>
   );
}
