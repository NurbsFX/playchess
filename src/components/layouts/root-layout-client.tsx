"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "../theme-provider";
import Navbar from "../global/navbar";
import Footer from "@/components/global/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Définir le type pour la session
type Session = {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
} | null;

interface RootLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

export default function RootLayoutClient({
  children,
  session,
}: RootLayoutClientProps) {
  const pathname = usePathname();
  const hiddenPaths = ["/signin", "/signup"];
  const shouldHideLayout = hiddenPaths.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {!shouldHideLayout && <Navbar session={session} />}
          {children}
          {!shouldHideLayout && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
} 