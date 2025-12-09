import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";

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
      <html lang="en">
         <body className={`${inter.variable} font-sans antialiased`}>
            <ErrorBoundary>
               <AuthProvider>
                  <Toaster />
                  {children}
               </AuthProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}
