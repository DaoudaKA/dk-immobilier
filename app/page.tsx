import Link from "next/link";
import { AnnonceCard } from "@/components/AnnonceCard";
import { BarreRecherche } from "@/components/BarreRecherche";
import {
  IconeBouclier, IconeCalendrier, IconeDocument, IconeFleche, IconeMessage, IconePin, IconeRecherche, IconeSurface,
} from "@/components/Icones";
import type { TypeScene } from "@/components/Scene";
import { Visuel } from "@/components/Visuel";
import { getCommunes, rechercherAnnonces } from "@/lib/data";
import { photo } from "@/lib/photos";

const REGIONS_VEDETTE: { nom: string; titre: string; texte: string; scene: TypeScene; photo: string; lien: string; regions: string[] }[] = [
  { nom: "dakar", titre: "Dakar", texte: "Appartements, villas, locaux", scene: "ville", photo: "dakar", lien: "/annonces?region=Dakar", regions: ["Dakar"] },
  { nom: "niayes", titre: "Les Niayes", texte: "Champs maraîchers, vergers", scene: "niayes", photo: "niayes", lien: "/annonces?region=Thiès&categorie=champ", regions: [] },
  { nom: "thies", titre: "Thiès et Petite-Côte", texte: "Terrains, résidences", scene: "cote", photo: "thies", lien: "/annonces?region=Thiès", regions: ["Thiès"] },
  { nom: "saint-louis", titre: "Saint-Louis et le Fleuve", texte: "Terres irriguées, rizières", scene: "fleuve", photo: "saint-louis", lien: "/annonces?region=Saint-Louis", regions: ["Saint-Louis"] },
  { nom: "casamance", titre: "Casamance", texte: "Vergers, terrains, maisons", scene: "casamance", photo: "casamance", lien: "/annonces?region=Ziguinchor", regions: ["Ziguinchor", "Sédhiou", "Kolda"] },
];

const FAQ = [
  ["Publier une annonce est-il payant ?", "Non. Les particuliers publient gratuitement jusqu'à 3 annonces. Les agences disposent d'abonnements dédiés."],
  ["Que garantit le badge « Bien vérifié » ?", "Notre équipe a contrôlé l'identité du vendeur et la cohérence des documents du bien. Le badge est daté et valable 6 mois. Il ne remplace pas l'acte passé devant notaire."],
  ["Je vis à l'étranger, puis-je acheter ?", "Oui. Échangez par la messagerie, demandez une visite vidéo et privilégiez les biens vérifiés. Ne versez jamais d'argent avant la signature chez le notaire."],
  ["Mon numéro est-il visible ?", "Non. Les acheteurs vous écrivent par la messagerie DK IMMOBILIER. Vous choisissez à qui communiquer votre numéro."],
];

export default async function Accueil() {
  const [toutes, communes] = await Promise.all([rechercherAnnonces({}, 100), getCommunes()]);
  const vedettes = toutes.slice(0, 8);
  const lieux = communes.map((c) => ({ nom: c.nom, region: c.region }));
  const compte = (r: (typeof REGIONS_VEDETTE)[number]) =>
    r.nom === "niayes"
      ? toutes.filter((a) => ["Mboro", "Darou Khoudoss", "Taïba Ndiaye", "Kayar", "Pout"].includes(a.commune)).length
      : toutes.filter((a) => r.regions.includes(a.region)).length;
  const photoAccueil = photo("accueil");

  return (
    <>
      {/* ================= Héros ================= */}
      <section className="relative isolate overflow-hidden bg-dk text-blanc">
        <div className="absolute inset-0 -z-10">
          <Visuel photo={photoAccueil} scene="niayes" priorite />
          <div className="absolute inset-0 bg-dk/45" />
          <div className="absolute inset-y-0 left-0 w-full bg-dk/50 md:w-[62%] md:[mask-image:linear-gradient(to_right,black_55%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-24">
          <p className="apparition inline-flex items-center gap-2 rounded-full bg-blanc/12 px-4 py-1.5 text-sm font-medium ring-1 ring-blanc/30 backdrop-blur">
            <IconeBouclier className="size-4" /> Annonces modérées · documents contrôlés
          </p>
          <h1 className="apparition mt-6 max-w-3xl text-[2.6rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: "60ms" }}>
            Trouvez la terre et le toit qui vous ressemblent.
          </h1>
          <p className="apparition mt-6 max-w-xl text-lg text-blanc/85" style={{ animationDelay: "120ms" }}>
            Terrains, champs et biens immobiliers à vendre ou à louer partout au Sénégal, géolocalisés et vérifiés par notre équipe foncière.
          </p>
          <div className="apparition mt-10 max-w-5xl" style={{ animationDelay: "180ms" }}>
            <BarreRecherche lieux={lieux} />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-blanc/85">
            <li className="inline-flex items-center gap-2"><IconeBouclier className="size-4" /> Badge « Bien vérifié »</li>
            <li className="inline-flex items-center gap-2"><IconeMessage className="size-4" /> Messagerie sans numéro</li>
            <li className="inline-flex items-center gap-2"><IconePin className="size-4" /> Biens localisés sur carte</li>
          </ul>
        </div>
      </section>

      {/* ================= Chiffres ================= */}
      <section className="border-b border-dk/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
          {[
            [toutes.length, "annonces en ligne"],
            [toutes.filter((a) => a.verifiee).length, "biens vérifiés"],
            [new Set(toutes.map((a) => a.commune)).size, "communes couvertes"],
            ["24 h", "objectif de modération"],
          ].map(([n, l], i) => (
            <div key={String(l)} className={`py-7 ${i % 2 ? "pl-6" : ""} md:pl-0 ${i ? "md:border-l md:border-dk/10 md:pl-8" : ""}`}>
              <p className="text-3xl font-extrabold tracking-tight">{n}</p>
              <p className="mt-0.5 text-sm text-dk/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Régions ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <EnTeteSection sur="Explorer" titre="Par région" lien={{ href: "/annonces", label: "Toutes les annonces" }} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {REGIONS_VEDETTE.map((r, i) => (
            <Link key={r.nom} href={r.lien} className={`group relative isolate overflow-hidden rounded-[var(--radius-dk)] ${i === 0 ? "row-span-2 aspect-[4/5] lg:aspect-auto" : "aspect-[4/3]"}`}>
              <div className="absolute inset-0 -z-10 transition duration-700 group-hover:scale-105">
                <Visuel photo={photo(r.photo)} scene={r.scene} graine={i} />
              </div>
              <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-dk/85 [mask-image:linear-gradient(to_top,black_35%,transparent)]" />
              <div className="flex h-full flex-col justify-end p-4 text-blanc sm:p-6">
                <p className={`font-bold tracking-tight ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>{r.titre}</p>
                <p className="hidden text-sm text-blanc/80 sm:block">{r.texte}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {compte(r) ? `${compte(r)} annonce${compte(r) > 1 ? "s" : ""}` : "Découvrir"} <IconeFleche className="size-4 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= Annonces ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <EnTeteSection sur="Sélection" titre="Annonces à la une et récentes" lien={{ href: "/annonces", label: "Voir tout" }} />
        <div className="defilement -mx-4 mt-8 flex gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {vedettes.map((a) => (
            <div key={a.id} className="w-[82%] shrink-0 sm:w-[46%] lg:w-[calc(25%-15px)]"><AnnonceCard a={a} /></div>
          ))}
        </div>
      </section>

      {/* ================= Comment ça marche ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <EnTeteSection sur="Simple et sûr" titre="Comment ça marche" lien={{ href: "/guide", label: "Lire le guide complet" }} />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[
            { titre: "Vous cherchez un bien", lien: "/annonces", cta: "Lancer une recherche", etapes: [
              [IconeRecherche, "Recherchez", "Filtrez par lieu, budget, surface et statut juridique, en liste ou sur la carte."],
              [IconeMessage, "Échangez", "Contactez le vendeur par la messagerie et demandez une visite."],
              [IconeDocument, "Sécurisez", "Faites vérifier les documents et signez chez le notaire avant tout paiement."],
            ] },
            { titre: "Vous vendez ou louez", lien: "/publier", cta: "Déposer une annonce", etapes: [
              [IconeSurface, "Décrivez", "Type de bien, superficie, prix, position exacte sur la carte et photos."],
              [IconeBouclier, "Faites vérifier", "Déposez vos documents en privé pour obtenir le badge « Bien vérifié »."],
              [IconeCalendrier, "Recevez des demandes", "Répondez aux messages et organisez les visites depuis votre espace."],
            ] },
          ].map((bloc, b) => (
            <div key={bloc.titre} className={`rounded-[2rem] p-8 md:p-10 ${b ? "plan-grid-blanc bg-dk text-blanc" : "border border-dk/12"}`}>
              <h3 className="text-2xl font-bold">{bloc.titre}</h3>
              <ol className="mt-8 space-y-6">
                {bloc.etapes.map(([I, t, d], i) => {
                  const Icone = I as typeof IconeRecherche;
                  return (
                    <li key={String(t)} className="flex gap-4">
                      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${b ? "bg-blanc text-dk" : "bg-dk text-blanc"}`}><Icone /></span>
                      <div>
                        <p className="font-semibold">{i + 1}. {String(t)}</p>
                        <p className={`mt-0.5 text-sm ${b ? "text-blanc/75" : "text-dk/65"}`}>{String(d)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <Link href={bloc.lien} className={`${b ? "btn-blanc" : "btn-plein"} mt-8`}>{bloc.cta} <IconeFleche className="size-4" /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Vérification ================= */}
      <section id="verification" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-24 sm:px-6">
        <div className="plan-grid grid items-center gap-10 rounded-[2rem] border border-dk/12 p-8 md:grid-cols-[1.1fr_1fr] md:p-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Notre engagement</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Un badge pour lutter contre les doubles ventes.</h2>
            <p className="mt-5 max-w-lg text-dk/70">
              Avant d&apos;afficher « Bien vérifié », notre équipe contrôle l&apos;identité du vendeur, le numéro du titre ou de la délibération, la superficie et la position du bien. Le contrôle est daté et renouvelé tous les 6 mois.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/annonces?verifiees=1" className="btn-plein">Voir les biens vérifiés</Link>
              <Link href="/guide#verification" className="btn-contour">Comment ça marche</Link>
            </div>
          </div>
          <div className="rounded-[var(--radius-dk)] border border-dk/12 bg-blanc p-6 shadow-[0_30px_60px_-35px_rgb(11_60_140/.6)]">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Rapport de vérification</p>
              <span className="rounded-full bg-dk px-2.5 py-1 text-xs font-semibold text-blanc">Validé</span>
            </div>
            <ul className="mt-5 divide-y divide-dashed divide-dk/15">
              {["Identité du vendeur", "Document foncier présenté", "Numéro de titre ou de délibération", "Superficie déclarée", "Position et bornage", "Absence de signalement"].map((c) => (
                <li key={c} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-dk/75">{c}</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-dk text-blanc">
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5 9-10" /></svg>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-dk/50">Exemple de contrôle · valable 6 mois</p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-24 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Questions fréquentes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Vous avez une question ?</h2>
          <p className="mt-4 text-dk/65">Le guide détaille chaque étape, de la recherche à la signature chez le notaire.</p>
          <Link href="/guide" className="btn-plein mt-6">Ouvrir le guide</Link>
        </div>
        <div className="divide-y divide-dk/10 border-y border-dk/10">
          {FAQ.map(([q, r]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dk/20 transition group-open:rotate-45 group-open:bg-dk group-open:text-blanc">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-dk/70">{r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= Appel final ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-dk px-8 py-14 text-blanc md:px-14">
          <div className="absolute inset-0 -z-10 opacity-60"><Visuel scene="savane" graine={3} /></div>
          <div className="absolute inset-0 -z-10 bg-dk/55" />
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Vous avez un terrain, un champ ou une maison à vendre ?</h2>
          <p className="mt-3 max-w-xl text-blanc/80">Publiez gratuitement en moins de 5 minutes et touchez des acheteurs au Sénégal et dans la diaspora.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/publier" className="btn-blanc">Déposer une annonce</Link>
            <Link href="/guide#vendre" className="btn border border-blanc/40 text-blanc hover:bg-blanc/10">Conseils pour bien vendre</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EnTeteSection({ sur, titre, lien }: { sur: string; titre: string; lien?: { href: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">{sur}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{titre}</h2>
      </div>
      {lien && (
        <Link href={lien.href} className="hidden items-center gap-1.5 font-semibold underline-offset-4 hover:underline sm:inline-flex">
          {lien.label} <IconeFleche className="size-4" />
        </Link>
      )}
    </div>
  );
}
