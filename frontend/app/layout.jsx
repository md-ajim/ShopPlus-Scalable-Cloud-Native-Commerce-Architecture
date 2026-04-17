"use client";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { StripeProvider } from '@/components/stripe-provider';
import { CartProviders } from "@/context/cart";
import { Providers } from "./providers";
import { Suspense } from "react";
import { CartProvider } from "@/context/cart-context";

export default function RootLayout({ children  }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>

      {/* className={`${geistSans.variable} ${geistMono.variable} antialiased`} */}
      <body suppressHydrationWarning={true}>

        <SessionProvider>
                  <CartProvider> 
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

            <Providers>
              <CartProviders> <StripeProvider> <Suspense> {children}</Suspense> </StripeProvider>     </CartProviders>
            </Providers>
            <Toaster  position="top-right" />
          </ThemeProvider>
          </CartProvider>
        </SessionProvider>
 
      </body>
    </html>
  );
}
