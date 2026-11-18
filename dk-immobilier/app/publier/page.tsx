import type { Metadata } from "next";
import { FormulaireAnnonce } from "@/components/FormulaireAnnonce";
import { getCommunes } from "@/lib/data";

export const metadata: Metadata = { title: "Publier une annonce" };

export default async function PagePublier() {
  const communes = await getCommunes();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Vendeur</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Publier une annonce</h1>
      <p className="mt-3 max-w-2xl text-dk/65">
        Votre annonce est relue par notre équipe avant publication, en général sous 24 h. Ajoutez vos documents pour obtenir le badge « Bien vérifié ».
      </p>
      <FormulaireAnnonce communes={communes} />
    </div>
  );
}
