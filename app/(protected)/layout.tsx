import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
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
            <div suppressHydrationWarning>
               <LandingHeader />
               <main className="min-h-[calc(100vh - 110px)]">
                  <div className="w-full mx-auto">{children}</div>
               </main>
               <LandingFooter />
            </div>
         </SocketProvider>
      </FCMProvider>
   );
}
