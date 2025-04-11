import "./globals.css";
import RootLayoutClient from "@/components/layouts/root-layout-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Récupérer la session côté serveur
  const session = await auth.api.getSession({ headers: await headers() });

  return <RootLayoutClient session={session}>{children}</RootLayoutClient>;
}