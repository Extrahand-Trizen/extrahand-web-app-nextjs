import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/lib/socket/SocketProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { FCMProvider } from "@/lib/firebase/FCMProvider";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { EnvironmentLogger } from "@/components/EnvironmentLogger";

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
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${inter.variable} font-sans antialiased`}
            suppressHydrationWarning
         >
            <EnvironmentLogger />
            <ErrorBoundary>
               <QueryProvider>
                  <AuthProvider>
                     <FCMProvider>
                        <SocketProvider>
                           <Toaster />
                           <NotificationCenter />
                           {children}
                        </SocketProvider>
                     </FCMProvider>
                  </AuthProvider>
               </QueryProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}

