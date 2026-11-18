import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnonceCard, suffixePrix } from "@/components/AnnonceCard";
import { BoutonFavori } from "@/components/BoutonFavori";
import { BoutonPartage } from "@/components/BoutonPartage";
import { CarteAnnonces } from "@/components/carte";
import { ContactVendeur } from "@/components/ContactVendeur";
import { Galerie } from "@/components/Galerie";
import {
  IconeBouclier, IconeCalendrier, IconeDocument, IconeOeil, IconePin, IconeSurface, IconeUtilisateur,
} from "@/components/Icones";
import { getAnnonce, getSimilaires, getVendeur, rechercherAnnonces } from "@/lib/data";
import {
  formatDate, formatPrix, formatSurface, LIBELLES_CARACTERISTIQUES, LIBELLES_JURIDIQUE, LIBELLES_TRANSACTION, prixAuM2,
} from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAnnonce((await params).id);
  if (!a) return { title: "Annonce introuvable" };
  return {
    title: a.titre,
    description: `${formatPrix(a.prix_xof)} · ${formatSurface(a.superficie_m2)} · ${a.commune}, ${a.region}. ${a.description.slice(0, 120)}`,
  };
}

const EXPLICATIONS: Record<string, string> = {
  titre_foncier: "Droit de propriété définitif, inscrit au Livre foncier. C'est le statut le plus sûr.",
  bail: "Droit d'occupation accordé par l'État pour une durée donnée, parfois transformable en titre foncier.",
  deliberation: "Droit d'usage d'une terre du domaine national, accordé par le conseil municipal.",
  acte_cession: "Document de transfert entre particuliers : à faire contrôler avec soin par un notaire.",
  autre: "Statut à préciser avec le vendeur et à faire contrôler par un notaire.",
};

export default async function PageAnnonce({ params }: Props) {
  const a = await getAnnonce((await params).id);
  if (!a) notFound();
  const [vendeur, similaires, memeZone] = await Promise.all([
    getVendeur(a.vendeur_id),
    getSimilaires(a),
    rechercherAnnonces({ categorie: a.categorie, region: a.region, transaction: a.type_transaction }, 100),
  ]);
  const caracs = Object.entries(a.caracteristiques ?? {});
  const comparables = memeZone.filter((x) => x.id !== a.id);
  const moyenneM2 = comparables.length ? comparables.reduce((s, x) => s + x.prix_xof / x.superficie_m2, 0) / comparables.length : null;
  const sonM2 = a.prix_xof / a.superficie_m2;
  const ecart = moyenneM2 ? Math.round(((sonM2 - moyenneM2) / moyenneM2) * 100) : null;

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="text-sm text-dk/55" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-dk">Accueil</Link> ›{" "}
            <Link href="/annonces" className="hover:text-dk">Annonces</Link> ›{" "}
            <Link href={`/annonces?region=${encodeURIComponent(a.region)}`} className="hover:text-dk">{a.region}</Link> ›{" "}
            <Link href={`/annonces?region=${encodeURIComponent(a.region)}&categorie=${a.categorie}`} className="hover:text-dk">{a.categorie_libelle}</Link>
          </nav>
          <div className="flex gap-2">
            <BoutonPartage titre={a.titre} />
            <BoutonFavori id={a.id} variante="large" />
          </div>
        </div>

        <div className="mt-4"><Galerie a={a} /></div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-dk/50">{a.categorie_libelle} · {LIBELLES_TRANSACTION[a.type_transaction]}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-[2.5rem] md:leading-tight">{a.titre}</h1>
            <p className="mt-3 inline-flex items-center gap-1.5 text-dk/65">
              <IconePin className="size-4" /> {a.quartier ? `${a.quartier}, ` : ""}{a.commune} · {a.departement}, région de {a.region}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-dk/10 py-6">
              <p className="text-4xl font-extrabold tracking-tight">{formatPrix(a.prix_xof)}<span className="text-lg font-medium text-dk/55">{suffixePrix(a)}</span></p>
              <p className="pb-1 text-dk/60">
                {a.type_transaction === "vente" ? `${prixAuM2(a.prix_xof, a.superficie_m2)} · ` : ""}{a.negociable ? "Prix négociable" : "Prix ferme"}
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                [IconeSurface, "Superficie", formatSurface(a.superficie_m2)],
                [IconeDocument, "Statut juridique", LIBELLES_JURIDIQUE[a.statut_juridique]],
                [IconeCalendrier, "Publiée le", formatDate(a.publiee_le)],
                [IconeOeil, "Consultations", `${a.vues} vues`],
              ].map(([I, l, v]) => {
                const Icone = I as typeof IconeSurface;
                return (
                  <div key={String(l)} className="rounded-2xl bg-dk/[0.035] p-4">
                    <Icone className="size-5 text-dk/60" />
                    <dt className="mt-3 text-xs font-medium uppercase tracking-wider text-dk/50">{String(l)}</dt>
                    <dd className="mt-0.5 font-semibold">{String(v)}</dd>
                  </div>
                );
              })}
            </dl>

            <section className="mt-12">
              <h2 className="text-xl font-bold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-[17px] leading-relaxed text-dk/80">{a.description}</p>
              <p className="mt-4 text-sm text-dk/50">Référence de l&apos;annonce : {a.reference}</p>
            </section>

            {caracs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold">Caractéristiques</h2>
                <dl className="mt-4 grid overflow-hidden rounded-2xl border border-dk/12 sm:grid-cols-2">
                  {caracs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-dashed border-dk/15 px-5 py-3.5 sm:odd:border-r">
                      <dt className="text-dk/65">{LIBELLES_CARACTERISTIQUES[k] ?? k}</dt>
                      <dd className="text-right font-medium">{v === true ? "Oui" : v === false ? "Non" : String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="mt-12">
              <h2 className="text-xl font-bold">Statut juridique : {LIBELLES_JURIDIQUE[a.statut_juridique]}</h2>
              <p className="mt-2 text-dk/70">{EXPLICATIONS[a.statut_juridique]} <Link href="/guide#documents" className="font-semibold underline">En savoir plus</Link></p>
            </section>

            {a.type_transaction === "vente" && moyenneM2 && ecart !== null && (
              <section className="mt-12 rounded-[var(--radius-dk)] border border-dk/12 p-6">
                <h2 className="text-xl font-bold">Prix par rapport au secteur</h2>
                <p className="mt-1 text-sm text-dk/60">Comparé à {comparables.length} annonce{comparables.length > 1 ? "s" : ""} du même type dans la région de {a.region}.</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-dk/60">Ce bien</p><p className="text-xl font-bold">{prixAuM2(a.prix_xof, a.superficie_m2)}</p></div>
                  <div><p className="text-sm text-dk/60">Moyenne du secteur</p><p className="text-xl font-bold">{prixAuM2(moyenneM2, 1)}</p></div>
                </div>
                <div className="relative mt-5 h-2 rounded-full bg-dk/10">
                  <div className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blanc bg-dk shadow" style={{ left: `${Math.max(5, Math.min(95, 50 + ecart / 2))}%` }} />
                  <div className="absolute left-1/2 top-[-6px] h-5 w-px bg-dk/40" />
                </div>
                <p className="mt-3 text-sm font-medium">
                  {Math.abs(ecart) < 5 ? "Dans la moyenne du secteur." : ecart < 0 ? `${Math.abs(ecart)} % en dessous de la moyenne.` : `${ecart} % au-dessus de la moyenne.`}
                  <span className="font-normal text-dk/55"> Indication basée sur les annonces en ligne, pas une estimation officielle.</span>
                </p>
              </section>
            )}

            <section className="mt-12">
              <h2 className="text-xl font-bold">Localisation</h2>
              <p className="mt-1 text-sm text-dk/60">{a.commune}, {a.region} · position indicative communiquée par le vendeur</p>
              <div className="mt-4 h-[360px]"><CarteAnnonces annonces={[a]} zoomUnique={14} /></div>
            </section>

            <section className={`mt-12 rounded-[var(--radius-dk)] p-6 md:p-8 ${a.verifiee ? "bg-dk text-blanc" : "plan-grid border border-dk/15"}`}>
              <div className="flex items-start gap-4">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${a.verifiee ? "bg-blanc text-dk" : "bg-dk text-blanc"}`}><IconeBouclier className="size-6" /></span>
                <div>
                  <h2 className="text-lg font-bold">{a.verifiee ? "Bien vérifié par DK IMMOBILIER" : "Ce bien n'est pas encore vérifié"}</h2>
                  <p className={`mt-1 ${a.verifiee ? "text-blanc/80" : "text-dk/70"}`}>
                    {a.verifiee
                      ? "L'identité du vendeur et les documents du bien ont été contrôlés. Faites tout de même conclure la vente par un notaire."
                      : "Demandez les documents au vendeur et faites-les contrôler par un notaire ou un géomètre avant tout versement."}
                  </p>
                </div>
              </div>
              <ul className={`mt-6 grid gap-2 text-sm sm:grid-cols-2 ${a.verifiee ? "text-blanc/85" : "text-dk/75"}`}>
                {["Visitez le bien avant de vous engager", "Vérifiez les bornes avec un géomètre", "Signez uniquement chez un notaire", "Ne payez jamais d'acompte en espèces"].map((c) => (
                  <li key={c} className="flex gap-2"><span aria-hidden>✓</span>{c}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* ----- Colonne contact ----- */}
          <aside id="contact" className="scroll-mt-28 space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[var(--radius-dk)] border border-dk/15 p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-dk text-blanc"><IconeUtilisateur /></span>
                <div>
                  <p className="font-semibold">{vendeur?.nom_complet || "Vendeur"}</p>
                  <p className="text-sm text-dk/60">
                    {vendeur?.identite_verifiee ? "Identité vérifiée · " : ""}Membre depuis {formatDate(vendeur?.cree_le ?? null).replace(/^\d+ /, "")}
                  </p>
                </div>
              </div>
            </div>
            <ContactVendeur annonceId={a.id} vendeurId={a.vendeur_id} titre={a.titre} />
            <p className="text-center text-sm text-dk/55">
              Un doute sur cette annonce ? <Link href={`/signaler/${a.id}`} className="font-medium underline">Signalez-la</Link>
            </p>
          </aside>
        </div>

        {similaires.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight">Vous aimerez aussi</h2>
            <div className="defilement -mx-4 mt-6 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
              {similaires.map((s) => <div key={s.id} className="w-[80%] shrink-0 sm:w-auto"><AnnonceCard a={s} /></div>)}
            </div>
          </section>
        )}
      </div>

      {/* Barre de contact mobile */}
      <div className="fixed inset-x-0 bottom-0 z-[900] flex items-center justify-between gap-3 border-t border-dk/10 bg-blanc/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{formatPrix(a.prix_xof)}<span className="text-sm font-medium text-dk/55">{suffixePrix(a)}</span></p>
          <p className="truncate text-xs text-dk/55">{a.commune} · {formatSurface(a.superficie_m2)}</p>
        </div>
        <a href="#contact" className="btn-plein shrink-0">Contacter</a>
      </div>
    </div>
  );
}
