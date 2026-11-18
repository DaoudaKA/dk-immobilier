import Link from "next/link";
import { Logo } from "./Logo";

export function PiedDePage() {
  return (
    <footer className="plan-grid-blanc mt-24 bg-dk text-blanc">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variante="blanc" taille={48} className="text-base" />
          <p className="mt-5 max-w-sm text-blanc/75">
            La plateforme de confiance pour acheter, vendre et louer terrains, champs et biens immobiliers au Sénégal.
          </p>
          <div className="bornage mt-6 w-40 text-blanc/60" />
        </div>
        <div>
          <p className="font-semibold">Explorer</p>
          <ul className="mt-4 space-y-2.5 text-blanc/75">
            <li><Link href="/annonces?categorie=terrain" className="hover:text-blanc">Terrains à vendre</Link></li>
            <li><Link href="/annonces?categorie=champ" className="hover:text-blanc">Champs et terres agricoles</Link></li>
            <li><Link href="/annonces?categorie=maison" className="hover:text-blanc">Maisons et villas</Link></li>
            <li><Link href="/annonces?transaction=location" className="hover:text-blanc">Locations</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">DK IMMOBILIER</p>
          <ul className="mt-4 space-y-2.5 text-blanc/75">
            <li><Link href="/publier" className="hover:text-blanc">Publier une annonce</Link></li>
            <li><Link href="/#verification" className="hover:text-blanc">Vérification des biens</Link></li>
            <li><Link href="/charte" className="hover:text-blanc">Charte graphique</Link></li>
            <li><a href="mailto:contact@dkimmobilier.sn" className="hover:text-blanc">contact@dkimmobilier.sn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blanc/15">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-5 text-sm text-blanc/60 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} DK IMMOBILIER. Tous droits réservés.</p>
          <p>Le badge « Bien vérifié » ne remplace pas un acte notarié.</p>
        </div>
      </div>
    </footer>
  );
}
