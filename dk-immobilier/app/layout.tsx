import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EnTete } from "@/components/EnTete";
import { PiedDePage } from "@/components/PiedDePage";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DK IMMOBILIER — Terrains, champs et maisons au Sénégal",
    template: "%s · DK IMMOBILIER",
  },
  description:
    "Achetez, vendez et louez des terrains, champs agricoles et biens immobiliers vérifiés au Sénégal : Dakar, Thiès, les Niayes et partout dans le pays.",
  manifest: "/manifest.webmanifest",
  openGraph: { siteName: "DK IMMOBILIER", locale: "fr_SN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0B3C8C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh flex-col bg-blanc text-dk">
        <EnTete />
        <main className="flex-1">{children}</main>
        <PiedDePage />
      </body>
    </html>
  );
}
