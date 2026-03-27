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
import { ConditionalPublicChrome } from "@/components/layout/ConditionalPublicChrome";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "ExtraHand - Task Marketplace | Hire & Post Services",
   description: "Connect with skilled taskers and get things done. Post tasks, hire services, and become a tasker on ExtraHand.",
   keywords: "task marketplace, hire tasker, post task, services, freelance, home services, India",
   authors: [{ name: "ExtraHand" }],
   icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
   },
   openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://extrahand.in",
      siteName: "ExtraHand",
      title: "ExtraHand - Task Marketplace | Hire & Post Services",
      description: "Connect with skilled taskers and get things done. Post tasks, hire services, and become a tasker on ExtraHand.",
      images: [
         {
            url: "/logo.png",
            width: 1200,
            height: 630,
            alt: "ExtraHand Logo",
            type: "image/png",
         },
      ],
   },
   verification: {
      google: "kJdq2hpjEv7FM_ffiqCPPLdzi2bcOFZGVIUXouVi3Jk",
   },
   twitter: {
      card: "summary_large_image",
      title: "ExtraHand - Task Marketplace | Hire & Post Services",
      description: "Connect with skilled taskers and get things done. Post tasks, hire services, and become a tasker on ExtraHand.",
      images: ["/logo.png"],
      creator: "@ExtraHand",
      site: "@ExtraHand",
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
                        if (document.documentElement) document.documentElement.scrollTop = 0;
                        if (document.body) document.body.scrollTop = 0;
                        
                        // Reset on DOMContentLoaded
                        document.addEventListener('DOMContentLoaded', function() {
                           window.scrollTo(0, 0);
                           if (document.documentElement) document.documentElement.scrollTop = 0;
                           if (document.body) document.body.scrollTop = 0;
                        });
                        
                        // Reset on load
                        window.addEventListener('load', function() {
                           window.scrollTo(0, 0);
                           if (document.documentElement) document.documentElement.scrollTop = 0;
                           if (document.body) document.body.scrollTop = 0;
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
                     <ConditionalPublicChrome>{children}</ConditionalPublicChrome>
                  </AuthProvider>
               </QueryProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}

