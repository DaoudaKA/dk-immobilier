import type { Metadata } from "next";
import { ListeFavoris } from "@/components/ListeFavoris";
import { rechercherAnnonces } from "@/lib/data";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function PageFavoris() {
  const annonces = await rechercherAnnonces({}, 100);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Mon espace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Mes favoris et recherches</h1>
      <ListeFavoris annonces={annonces} />
    </div>
  );
}
