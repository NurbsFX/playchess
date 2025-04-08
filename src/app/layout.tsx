"use client"; // Ajoute ça !

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation"; // Ajoute ça
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/global/navbar";
import Footer from "@/components/global/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hiddenPaths = ["/signin", "/signup"];
  const shouldHideLayout = hiddenPaths.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {!shouldHideLayout && <Navbar />}
          {children}
          {!shouldHideLayout && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}