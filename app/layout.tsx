import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { EnvironmentLogger } from "@/components/EnvironmentLogger";
import { ScrollToTop } from "@/components/ScrollToTop";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "ExtraHand - Task Marketplace",
   description: "Connect with taskers and get things done",
   icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning style={{ scrollBehavior: 'auto' }}>
         <head>
            <script
               dangerouslySetInnerHTML={{
                  __html: `
                     // Aggressive scroll reset - runs immediately
                     (function() {
                        window.history.scrollRestoration = 'manual';
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                        
                        // Reset on DOMContentLoaded
                        document.addEventListener('DOMContentLoaded', function() {
                           window.scrollTo(0, 0);
                           document.documentElement.scrollTop = 0;
                           document.body.scrollTop = 0;
                        });
                        
                        // Reset on load
                        window.addEventListener('load', function() {
                           window.scrollTo(0, 0);
                           document.documentElement.scrollTop = 0;
                           document.body.scrollTop = 0;
                        });
                     })();
                  `,
               }}
            />
         </head>
         <body
            className={`${inter.variable} font-sans antialiased`}
            suppressHydrationWarning
            style={{ margin: 0, padding: 0, overflowX: 'hidden' }}
         >
            <EnvironmentLogger />
            <ErrorBoundary>
               <QueryProvider>
                  <AuthProvider>
                     <Suspense fallback={null}>
                        <ScrollToTop />
                     </Suspense>
                     <Toaster />
                     {children}
                  </AuthProvider>
               </QueryProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}

