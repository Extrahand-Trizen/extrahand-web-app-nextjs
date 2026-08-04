import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { EnvironmentLogger } from "@/components/EnvironmentLogger";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PollingOtpToastBridge } from "@/components/notifications/PollingOtpToastBridge";

// Avoid next/font here: relative assetPrefix (`./`) required for MinIO subfolder hosting
// is incompatible with next/font's assetPrefix validation.

export const metadata: Metadata = {
   title: "ExtraHand – Hire Help or Earn Money Near You",
   description:
      "Hire help or earn money near you. Get help, start earning, and get things done with ExtraHand.",
   keywords: "task marketplace, hire helper, get help, services, freelance, home services, India",
   authors: [{ name: "ExtraHand" }],
   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://extrahand.in"),
   icons: {
      icon: [
         { url: "/icon.svg?v=3", type: "image/svg+xml" },
         { url: "/logo.webp", type: "image/webp" },
      ],
      shortcut: "/icon.svg?v=3",
      apple: "/logo.webp?v=3",
      other: [
         { url: '/favicon.ico', type: 'image/x-icon' }
      ],
   },
   openGraph: {
      type: "website",
      locale: "en_IN",
      url: "/",
      siteName: "ExtraHand",
      title: "ExtraHand – Hire Help or Earn Money Near You",
      description: "Connect with skilled helpers and get things done. Get help, hire services, and become a helper on ExtraHand.",
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
         "Hire help or earn money near you. Find helpers, get help, and get things done with ExtraHand.",
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
               href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
               rel="stylesheet"
            />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" href="/icon.svg?v=3" type="image/svg+xml" />
            <link rel="icon" href="/logo.webp" type="image/webp" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-C9E6GBS27L"></script>
            <script
               dangerouslySetInnerHTML={{
                  __html: `
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());
                     gtag('config', 'G-C9E6GBS27L');
                  `,
               }}
            />
         </head>
         <body
            className="font-sans antialiased"
            suppressHydrationWarning
            style={{ margin: 0, padding: 0, overflowX: 'hidden', ['--font-inter' as string]: "'Inter', sans-serif" }}
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
                     <div id="main-content" tabIndex={-1}>
                        {children}
                     </div>
                  </AuthProvider>
               </QueryProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}

