import type { Metadata } from "next";
import { FormulaireConnexion } from "@/components/FormulaireConnexion";
import { LogoMarque } from "@/components/Logo";

export const metadata: Metadata = { title: "Connexion" };

export default async function PageConnexion({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const { suite } = await searchParams;
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
      <div className="plan-grid-blanc hidden flex-col justify-between rounded-[2rem] bg-dk p-10 text-blanc md:flex">
        <LogoMarque variante="blanc" taille={72} />
        <div>
          <h2 className="text-3xl font-bold leading-tight">Un compte, et tout le Sénégal foncier à portée de main.</h2>
          <ul className="mt-6 space-y-3 text-blanc/80">
            <li>— Enregistrez vos recherches et recevez des alertes</li>
            <li>— Échangez avec les vendeurs sans dévoiler votre numéro</li>
            <li>— Publiez et suivez vos annonces</li>
          </ul>
        </div>
        <div className="bornage w-full text-blanc/40" />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold tracking-tight">Connexion ou inscription</h1>
        <p className="mt-2 text-dk/65">Recevez un code par SMS. Pas de mot de passe à retenir.</p>
        <FormulaireConnexion suite={suite?.startsWith("/") ? suite : "/compte"} />
      </div>
    </div>
  );
}
