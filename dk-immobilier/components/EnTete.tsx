import Link from "next/link";
import { Logo } from "./Logo";
import { IconeMenu, IconePlus, IconeUtilisateur } from "./Icones";
import { getUtilisateur } from "@/lib/data";
import { supabaseActif } from "@/lib/supabase/config";

const liens = [
  { href: "/annonces?categorie=terrain", label: "Terrains" },
  { href: "/annonces?categorie=champ", label: "Champs" },
  { href: "/annonces?categorie=maison", label: "Maisons" },
  { href: "/annonces?transaction=location", label: "Location" },
  { href: "/#verification", label: "Vérification" },
];

export async function EnTete() {
  const session = await getUtilisateur();
  const staff = session?.profil && ["moderateur", "admin"].includes(session.profil.role);

  return (
    <header className="sticky top-0 z-[1000] border-b border-dk/10 bg-blanc/90 backdrop-blur">
      {!supabaseActif && (
        <div className="bg-dk px-4 py-1.5 text-center text-xs font-medium text-blanc">
          Mode démonstration : annonces fictives. Ajoutez vos clés Supabase dans .env.local pour passer en production.
        </div>
      )}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Accueil DK IMMOBILIER" className="text-[15px]">
          <Logo taille={42} />
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] font-medium text-dk/75 lg:flex">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-dk">
              {l.label}
            </Link>
          ))}
          {staff && <Link href="/admin" className="hover:text-dk">Administration</Link>}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={session ? "/compte" : "/connexion"} className="btn-contour hidden sm:inline-flex">
            <IconeUtilisateur className="size-4" />
            {session ? "Mon compte" : "Connexion"}
          </Link>
          <Link href="/publier" className="btn-plein">
            <IconePlus className="size-4" />
            <span className="hidden sm:inline">Publier une annonce</span>
            <span className="sm:hidden">Publier</span>
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-dk/20" aria-label="Menu">
              <IconeMenu />
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-dk/15 bg-blanc p-2 shadow-xl">
              {[...liens, { href: session ? "/compte" : "/connexion", label: session ? "Mon compte" : "Connexion" }, ...(staff ? [{ href: "/admin", label: "Administration" }] : [])].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-xl px-4 py-2.5 font-medium hover:bg-dk/5">
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
