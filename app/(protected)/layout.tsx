import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function ProtectedLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <>
         <LandingHeader />
         <main className="min-h-[calc(100vh - 110px)]">
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </>
   );
}
