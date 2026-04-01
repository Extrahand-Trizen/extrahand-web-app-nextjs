import { RouteChrome } from "@/components/layout/RouteChrome";
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
            <RouteChrome variant="protected">{children}</RouteChrome>
         </SocketProvider>
      </FCMProvider>
   );
}
