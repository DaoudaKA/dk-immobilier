import Link from "next/link";
import { AnnonceCard } from "@/components/AnnonceCard";
import { BarreRecherche } from "@/components/BarreRecherche";
import { IllustrationBien } from "@/components/IllustrationBien";
import {
  IconeBouclier, IconeCalendrier, IconeDocument, IconeFleche, IconeMessage, IconePin,
} from "@/components/Icones";
import { getStatistiques, rechercherAnnonces } from "@/lib/data";
import type { Categorie } from "@/lib/types";

const CATEGORIES: { code: Categorie; titre: string; texte: string }[] = [
  { code: "terrain", titre: "Terrains", texte: "Parcelles à bâtir, lotissements viabilisés" },
  { code: "champ", titre: "Champs", texte: "Maraîchage, vergers, terres irrigables" },
  { code: "maison", titre: "Maisons", texte: "Villas, maisons familiales, immeubles" },
  { code: "appartement", titre: "Appartements", texte: "À vendre ou à louer, meublés ou non" },
  { code: "local", titre: "Locaux pro", texte: "Magasins, bureaux, entrepôts" },
];

export default async function Accueil() {
  const [annonces, stats] = await Promise.all([rechercherAnnonces({}, 8), getStatistiques()]);

  return (
    <>
      {/* ---------- Héros ---------- */}
      <section className="plan-grid-blanc relative overflow-hidden bg-dk text-blanc">
        <svg className="pointer-events-none absolute -right-24 top-10 hidden w-[620px] opacity-[.14] lg:block" viewBox="0 0 400 400" aria-hidden="true">
          <path d="M40 80 330 40 370 300 60 360Z" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="14 9" />
          <circle cx="40" cy="80" r="7" fill="#fff" /><circle cx="330" cy="40" r="7" fill="#fff" />
          <circle cx="370" cy="300" r="7" fill="#fff" /><circle cx="60" cy="360" r="7" fill="#fff" />
          <path d="M160 260V180l50-40 50 40v80Z" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-blanc/30 px-4 py-1.5 text-sm font-medium text-blanc/85">
            <IconeBouclier className="size-4" /> Biens contrôlés par notre équipe foncière
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            La bonne terre,
            <br />
            au bon prix, <span className="relative whitespace-nowrap">en toute confiance.<span className="bornage absolute -bottom-2 left-0 w-full text-blanc/70" /></span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-blanc/80">
            Terrains, champs et biens immobiliers à vendre ou à louer au Sénégal, géolocalisés, avec leur statut juridique déclaré et vérifié.
          </p>
          <div className="mt-10 max-w-5xl">
            <BarreRecherche />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {["Mboro", "Diamniadio", "Saly", "Keur Massar", "Pout", "Darou Khoudoss"].map((v) => (
              <Link key={v} href={`/annonces?q=${encodeURIComponent(v)}`} className="rounded-full border border-blanc/25 px-3.5 py-1.5 text-blanc/85 transition hover:bg-blanc hover:text-dk">
                {v}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Chiffres ---------- */}
      <section className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <div className="relative grid grid-cols-2 divide-dk/10 rounded-[var(--radius-dk)] border border-dk/10 bg-blanc shadow-[0_25px_50px_-30px_rgb(11_60_140/.5)] md:grid-cols-4 md:divide-x">
          {[
            [stats.total, "annonces actives"],
            [stats.verifiees, "biens vérifiés"],
            [stats.champs, "champs et terres agricoles"],
            [stats.regions, "régions couvertes"],
          ].map(([n, l]) => (
            <div key={String(l)} className="px-6 py-6 text-center">
              <p className="text-3xl font-extrabold tracking-tight">{n}</p>
              <p className="mt-1 text-sm text-dk/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Catégories ---------- */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Explorer</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Que cherchez-vous ?</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c.code} href={`/annonces?categorie=${c.code}`} className="group overflow-hidden rounded-[var(--radius-dk)] border border-dk/12 transition hover:border-dk">
              <div className="aspect-[4/3] overflow-hidden">
                <IllustrationBien categorie={c.code} graine={c.code} className="transition duration-500 group-hover:scale-110" />
              </div>
              <div className="flex items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-semibold">{c.titre}</p>
                  <p className="hidden text-sm text-dk/60 sm:block">{c.texte}</p>
                </div>
                <IconeFleche className="size-5 shrink-0 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Annonces récentes ---------- */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Nouveautés</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Annonces récentes</h2>
          </div>
          <Link href="/annonces" className="btn-contour">
            Tout voir <IconeFleche className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {annonces.map((a) => (
            <AnnonceCard key={a.id} a={a} />
          ))}
        </div>
      </section>

      {/* ---------- Vérification ---------- */}
      <section id="verification" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-6">
        <div className="plan-grid grid gap-10 rounded-[2rem] border border-dk/12 p-8 md:grid-cols-[1fr_1.3fr] md:p-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Notre engagement</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Le badge « Bien vérifié », contre les doubles ventes.</h2>
            <p className="mt-5 text-dk/70">
              Avant d&apos;afficher ce badge, notre équipe contrôle l&apos;identité du vendeur et les pièces du bien. Le contrôle est daté et renouvelé tous les 6 mois.
            </p>
            <Link href="/annonces?verifiees=1" className="btn-plein mt-8">
              Voir les biens vérifiés <IconeFleche className="size-4" />
            </Link>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              [IconeDocument, "Dépôt des pièces", "Titre foncier, bail ou délibération, plan et pièce d'identité, déposés en privé."],
              [IconeBouclier, "Contrôle", "Cohérence de l'identité, de la superficie, de la localisation et du numéro de titre."],
              [IconePin, "Visite terrain", "Si besoin, un agent vérifie les bornes et photographie le bien sur place."],
              [IconeCalendrier, "Badge daté", "Le badge s'affiche avec sa date de validité. La vente se conclut devant notaire."],
            ].map(([Icone, titre, texte], i) => {
              const I = Icone as typeof IconeDocument;
              return (
                <li key={String(titre)} className="rounded-2xl border border-dk/12 bg-blanc p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-dk text-blanc"><I /></span>
                    <span className="text-sm font-semibold text-dk/45">Étape {i + 1}</span>
                  </div>
                  <p className="mt-4 font-semibold">{String(titre)}</p>
                  <p className="mt-1 text-sm text-dk/65">{String(texte)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- Vendeurs & diaspora ---------- */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pt-20 sm:px-6 md:grid-cols-2">
        <div className="plan-grid-blanc rounded-[2rem] bg-dk p-10 text-blanc">
          <h3 className="text-2xl font-bold">Vous vendez un terrain ou un champ ?</h3>
          <p className="mt-3 text-blanc/80">Publiez gratuitement jusqu&apos;à 3 annonces. Dessinez votre parcelle sur la carte, ajoutez vos photos et recevez des demandes de visite.</p>
          <Link href="/publier" className="btn-blanc mt-8">Publier une annonce</Link>
        </div>
        <div className="rounded-[2rem] border border-dk/15 p-10">
          <h3 className="text-2xl font-bold">Vous vivez à l&apos;étranger ?</h3>
          <p className="mt-3 text-dk/70">Visitez à distance, échangez par la messagerie sécurisée sans partager votre numéro, et ne traitez que des biens vérifiés.</p>
          <Link href="/annonces?verifiees=1" className="btn-contour mt-8"><IconeMessage className="size-4" /> Découvrir les biens vérifiés</Link>
        </div>
      </section>
    </>
  );
}
