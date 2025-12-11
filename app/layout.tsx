import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "ExtraHand - Task Marketplace",
   description: "Connect with taskers and get things done",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${inter.variable} font-sans antialiased`}
            suppressHydrationWarning
         >
            <ErrorBoundary>
               <AuthProvider>
                  <LandingHeader />
                  <main className="min-h-[calc(100vh - 110px)]">
                     <div className="w-full mx-auto">
                        <Toaster />
                        {children}
                     </div>
                  </main>
                  <LandingFooter />
               </AuthProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}
