"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconeMenu } from "./Icones";
import { LogoMarque } from "./Logo";

export function MenuMobile({ staff, connecte }: { staff: boolean; connecte: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();

  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    document.body.style.overflow = ouvert ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [ouvert]);

  const groupes = [
    { titre: "Rechercher", liens: [
      ["/annonces?transaction=vente", "Acheter un bien"],
      ["/annonces?transaction=location", "Louer un bien"],
      ["/annonces?categorie=terrain", "Terrains"],
      ["/annonces?categorie=champ", "Champs et terres agricoles"],
      ["/annonces?verifiees=1", "Biens vérifiés uniquement"],
    ] },
    { titre: "Mon espace", liens: [
      ["/publier", "Déposer une annonce"],
      ["/favoris", "Mes favoris"],
      [connecte ? "/compte" : "/connexion", connecte ? "Mon tableau de bord" : "Se connecter"],
      ...(staff ? [["/admin", "Administration"]] : []),
    ] },
    { titre: "Aide", liens: [
      ["/guide", "Guide d'utilisation"],
      ["/guide#documents", "Comprendre les documents fonciers"],
      ["/guide#arnaques", "Éviter les arnaques"],
    ] },
  ];

  return (
    <>
      <button onClick={() => setOuvert(true)} className="flex size-11 items-center justify-center rounded-full border border-dk/15 lg:hidden" aria-label="Ouvrir le menu" aria-expanded={ouvert}>
        <IconeMenu />
      </button>
      <div className={`fixed inset-0 z-[2000] lg:hidden ${ouvert ? "" : "pointer-events-none"}`} aria-hidden={!ouvert}>
        <div onClick={() => setOuvert(false)} className={`absolute inset-0 bg-dk/40 transition-opacity ${ouvert ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-blanc shadow-2xl transition-transform duration-300 ${ouvert ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-dk/10 p-4">
            <LogoMarque taille={38} />
            <button onClick={() => setOuvert(false)} className="flex size-10 items-center justify-center rounded-full border border-dk/15 text-xl" aria-label="Fermer">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {groupes.map((g) => (
              <div key={g.titre} className="mb-6">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-dk/45">{g.titre}</p>
                <ul className="mt-2">
                  {g.liens.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="flex items-center justify-between rounded-xl px-3 py-3 font-medium hover:bg-dk/5">
                        {label} <span className="text-dk/30">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-dk/10 p-4">
            <Link href="/publier" className="btn-plein w-full">Déposer une annonce</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
