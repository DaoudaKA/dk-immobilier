import type { Metadata } from "next";
import { Recherche } from "@/components/recherche/Recherche";
import { rechercherAnnonces } from "@/lib/data";
import type { Categorie, Filtres, StatutJuridique, TypeTransaction } from "@/lib/types";

export const metadata: Metadata = { title: "Annonces" };

type SP = Record<string, string | string[] | undefined>;
const un = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const nombre = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export default async function PageAnnonces({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filtres: Filtres = {
    q: un(sp.q),
    categorie: un(sp.categorie) as Categorie | undefined,
    transaction: un(sp.transaction) as TypeTransaction | undefined,
    region: un(sp.region),
    prixMin: nombre(un(sp.prixMin)),
    prixMax: nombre(un(sp.prixMax)),
    surfaceMin: nombre(un(sp.surfaceMin)),
    verifiees: un(sp.verifiees) === "1",
    juridique: un(sp.juridique) as StatutJuridique | undefined,
    tri: (un(sp.tri) as Filtres["tri"]) ?? "recent",
  };
  const annonces = await rechercherAnnonces(filtres, 100);
  return <Recherche annonces={annonces} filtres={filtres} />;
}
