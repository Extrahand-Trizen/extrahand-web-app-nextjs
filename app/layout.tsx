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
import { PollingOtpToastBridge } from "@/components/notifications/PollingOtpToastBridge";


const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "ExtraHand – Hire Help or Earn Money Near You",
   description:
      "Hire help or earn money near you. Browse tasks, post tasks, and get things done with ExtraHand.",
   keywords: "task marketplace, hire tasker, post task, services, freelance, home services, India",
   authors: [{ name: "ExtraHand" }],
   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://extrahand.in"),
   icons: {
      icon: [
         { url: "/favicon.ico?v=2", type: "image/x-icon" },
         { url: "/logo.webp", type: "image/webp" },
      ],
      shortcut: "/favicon.ico?v=2",
      apple: "/favicon.ico?v=2",
   },
   openGraph: {
      type: "website",
      locale: "en_IN",
      url: "/",
      siteName: "ExtraHand",
      title: "ExtraHand – Hire Help or Earn Money Near You",
      description: "Connect with skilled taskers and get things done. Post tasks, hire services, and become a tasker on ExtraHand.",
      images: [
         {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: "ExtraHand – Hire help or earn money near you",
            type: "image/png",
         },
      ],
   },
   twitter: {
      card: "summary_large_image",
      title: "ExtraHand – Hire Help or Earn Money Near You",
      description:
         "Hire help or earn money near you. Browse taskers, post tasks, and get things done with ExtraHand.",
      images: ["/opengraph-image"],
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
                     <Toaster
                        position="top-right"
                        expand
                        visibleToasts={5}
                        closeButton
                        richColors
                     />
                     <PollingOtpToastBridge />
                     {children}
                  </AuthProvider>
               </QueryProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}

