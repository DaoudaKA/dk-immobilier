import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./Logo";
import { IconeCoeur, IconePlus, IconeUtilisateur } from "./Icones";
import { MenuMobile } from "./MenuMobile";
import { NavPrincipale } from "./NavPrincipale";
import { getUtilisateur } from "@/lib/data";
import { supabaseActif } from "@/lib/supabase/config";

export async function EnTete() {
  const session = await getUtilisateur();
  const staff = Boolean(session?.profil && ["moderateur", "admin"].includes(session.profil.role));
  const lienCompte = session || !supabaseActif ? "/compte" : "/connexion";

  return (
    <>
      {/* Barre institutionnelle */}
      <div className="bg-dk text-blanc">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <p className="truncate font-medium text-blanc/85">
            {supabaseActif ? "Plateforme sénégalaise d'annonces foncières et immobilières" : "Mode démonstration · annonces fictives"}
          </p>
          <nav className="hidden items-center gap-5 text-blanc/80 sm:flex">
            <Link href="/guide" className="hover:text-blanc">Guide d&apos;utilisation</Link>
            <Link href="/guide#arnaques" className="hover:text-blanc">Éviter les arnaques</Link>
            <a href="mailto:contact@dkimmobilier.sn" className="hover:text-blanc">Contact</a>
            <span className="rounded border border-blanc/30 px-1.5 py-0.5 font-semibold">FR</span>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-[1000] border-b border-dk/10 bg-blanc/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link href="/" aria-label="Accueil DK IMMOBILIER" className="shrink-0 text-[15px]">
            <Logo taille={42} />
          </Link>

          <Suspense fallback={<div className="hidden flex-1 lg:block" />}>
            <NavPrincipale staff={staff} />
          </Suspense>

          <div className="flex items-center gap-2">
            <Link href="/favoris" className="hidden size-11 items-center justify-center rounded-full border border-dk/15 transition hover:border-dk md:flex" aria-label="Mes favoris" title="Mes favoris">
              <IconeCoeur className="size-5" />
            </Link>
            <Link href={lienCompte} className="btn-contour hidden md:inline-flex">
              <IconeUtilisateur className="size-4" />
              {lienCompte === "/compte" ? "Mon espace" : "Se connecter"}
            </Link>
            <Link href="/publier" className="btn-plein">
              <IconePlus className="size-4" />
              <span className="hidden sm:inline">Déposer une annonce</span>
              <span className="sm:hidden">Publier</span>
            </Link>
            <MenuMobile staff={staff} connecte={Boolean(session)} />
          </div>
        </div>
      </header>
    </>
  );
}
