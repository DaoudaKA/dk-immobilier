import Link from "next/link";
import { Logo } from "./Logo";

const COLONNES: [string, [string, string][]][] = [
  ["Rechercher", [
    ["/annonces?categorie=terrain", "Terrains à vendre"],
    ["/annonces?categorie=champ", "Champs et terres agricoles"],
    ["/annonces?categorie=maison", "Maisons et villas"],
    ["/annonces?transaction=location", "Locations"],
    ["/annonces?verifiees=1", "Biens vérifiés"],
  ]],
  ["Vendre et louer", [
    ["/publier", "Déposer une annonce"],
    ["/guide#vendre", "Conseils pour bien vendre"],
    ["/guide#verification", "Faire vérifier son bien"],
    ["/compte", "Mon espace"],
  ]],
  ["Aide", [
    ["/guide", "Guide d'utilisation"],
    ["/guide#documents", "Documents fonciers"],
    ["/guide#arnaques", "Éviter les arnaques"],
    ["/guide#faq", "Questions fréquentes"],
    ["/charte", "Charte graphique"],
  ]],
];

export function PiedDePage() {
  return (
    <footer className="plan-grid-blanc mt-24 bg-dk text-blanc">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variante="blanc" taille={48} className="text-base" />
          <p className="mt-5 max-w-xs text-blanc/75">
            La plateforme de confiance pour acheter, vendre et louer terrains, champs et biens immobiliers au Sénégal.
          </p>
          <div className="bornage mt-6 w-40 text-blanc/50" />
          <p className="mt-6 text-sm text-blanc/70">contact@dkimmobilier.sn</p>
        </div>
        {COLONNES.map(([titre, liens]) => (
          <div key={titre}>
            <p className="font-semibold">{titre}</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-blanc/75">
              {liens.map(([href, label]) => (
                <li key={href}><Link href={href} className="transition hover:text-blanc">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-blanc/15">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-5 text-sm text-blanc/60 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} DK IMMOBILIER · Tous droits réservés</p>
          <p>Le badge « Bien vérifié » ne remplace pas un acte notarié.</p>
        </div>
      </div>
    </footer>
  );
}
