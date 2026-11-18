import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnonceCard, BadgeVerifie } from "@/components/AnnonceCard";
import { CarteAnnonces } from "@/components/carte";
import { ContactVendeur } from "@/components/ContactVendeur";
import { IllustrationBien } from "@/components/IllustrationBien";
import { IconeBouclier, IconeDocument, IconeOeil, IconePin, IconeSurface, IconeUtilisateur } from "@/components/Icones";
import { getAnnonce, getSimilaires, getVendeur } from "@/lib/data";
import {
  formatDate, formatPrix, formatSurface, LIBELLES_CARACTERISTIQUES, LIBELLES_JURIDIQUE, LIBELLES_TRANSACTION, prixAuM2,
} from "@/lib/format";
import { urlPhoto } from "@/lib/supabase/config";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAnnonce((await params).id);
  if (!a) return { title: "Annonce introuvable" };
  return {
    title: a.titre,
    description: `${formatPrix(a.prix_xof)} · ${formatSurface(a.superficie_m2)} · ${a.commune}, ${a.region}`,
  };
}

export default async function PageAnnonce({ params }: Props) {
  const a = await getAnnonce((await params).id);
  if (!a) notFound();
  const [vendeur, similaires] = await Promise.all([getVendeur(a.vendeur_id), getSimilaires(a)]);
  const suffixe = a.type_transaction === "location" ? " / mois" : a.type_transaction === "bail" ? " / an" : "";
  const caracs = Object.entries(a.caracteristiques ?? {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-dk/55">
        <Link href="/annonces" className="hover:text-dk">Annonces</Link> /{" "}
        <Link href={`/annonces?categorie=${a.categorie}`} className="hover:text-dk">{a.categorie_libelle}</Link> /{" "}
        <Link href={`/annonces?region=${encodeURIComponent(a.region)}`} className="hover:text-dk">{a.region}</Link>
      </nav>

      {/* ---------- Galerie ---------- */}
      <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-dk)]">
          {a.photos?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={urlPhoto(a.photos[0])} alt={a.titre} className="h-full w-full object-cover" />
          ) : (
            <IllustrationBien categorie={a.categorie} graine={a.id} />
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-dk px-3 py-1 text-xs font-semibold text-blanc ring-1 ring-blanc/40">{LIBELLES_TRANSACTION[a.type_transaction]}</span>
            {a.verifiee && <BadgeVerifie />}
          </div>
        </div>
        <div className="relative hidden md:block"><div className="absolute inset-0 grid grid-rows-2 gap-3">
          {[1, 2].map((i) =>
            a.photos?.[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={urlPhoto(a.photos[i])} alt="" className="min-h-0 h-full w-full rounded-[var(--radius-dk)] object-cover" />
            ) : (
              <div key={i} className="min-h-0 overflow-hidden rounded-[var(--radius-dk)]">
                <IllustrationBien categorie={i === 1 ? a.categorie : "terrain"} graine={a.id + i} />
              </div>
            ),
          )}
        </div></div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{a.titre}</h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-dk/65">
                <IconePin className="size-4" /> {a.quartier ? `${a.quartier}, ` : ""}{a.commune} · {a.departement}, {a.region}
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">{formatPrix(a.prix_xof)}<span className="text-base font-medium text-dk/60">{suffixe}</span></p>
              <p className="text-sm text-dk/60">{a.type_transaction === "vente" ? prixAuM2(a.prix_xof, a.superficie_m2) : ""}{a.negociable ? " · Négociable" : " · Prix ferme"}</p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [IconeSurface, "Superficie", formatSurface(a.superficie_m2)],
              [IconeDocument, "Statut juridique", LIBELLES_JURIDIQUE[a.statut_juridique]],
              [IconeOeil, "Vues", String(a.vues)],
              [IconeBouclier, "Référence", a.reference],
            ].map(([I, l, v]) => {
              const Icone = I as typeof IconeSurface;
              return (
                <div key={String(l)} className="rounded-2xl border border-dk/12 p-4">
                  <Icone className="size-5 text-dk/60" />
                  <dt className="mt-3 text-xs font-medium uppercase tracking-wider text-dk/50">{String(l)}</dt>
                  <dd className="mt-0.5 font-semibold">{String(v)}</dd>
                </div>
              );
            })}
          </dl>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-dk/80">{a.description}</p>
          </section>

          {caracs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold">Caractéristiques</h2>
              <dl className="mt-4 divide-y divide-dashed divide-dk/15 rounded-2xl border border-dk/12">
                {caracs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-5 py-3">
                    <dt className="text-dk/65">{LIBELLES_CARACTERISTIQUES[k] ?? k}</dt>
                    <dd className="text-right font-medium">{v === true ? "Oui" : v === false ? "Non" : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-bold">Localisation</h2>
            <p className="mt-1 text-sm text-dk/60">Position indicative communiquée par le vendeur.</p>
            <div className="mt-4 h-80"><CarteAnnonces annonces={[a]} /></div>
          </section>

          <section className="plan-grid mt-10 rounded-[var(--radius-dk)] border border-dk/15 p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-dk text-blanc"><IconeBouclier /></span>
              <div>
                <h2 className="font-bold">{a.verifiee ? "Ce bien a été vérifié par DK IMMOBILIER" : "Ce bien n'est pas encore vérifié"}</h2>
                <p className="mt-1 text-sm text-dk/70">
                  {a.verifiee
                    ? "Nous avons contrôlé l'identité du vendeur et les pièces du bien. Faites tout de même conclure la vente par un notaire."
                    : "Demandez les documents au vendeur et faites-les contrôler par un notaire ou un géomètre avant tout versement."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ---------- Colonne contact ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
          <div className="flex items-center gap-4 rounded-[var(--radius-dk)] border border-dk/15 p-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-dk text-blanc"><IconeUtilisateur /></span>
            <div>
              <p className="font-semibold">{vendeur?.nom_complet || "Vendeur"}</p>
              <p className="text-sm text-dk/60">
                {vendeur?.identite_verifiee ? "Identité vérifiée · " : ""}Membre depuis {formatDate(vendeur?.cree_le ?? null).replace(/^\d+ /, "")}
              </p>
            </div>
          </div>
          <ContactVendeur annonceId={a.id} vendeurId={a.vendeur_id} titre={a.titre} />
          <p className="text-center text-sm text-dk/55">
            Publiée le {formatDate(a.publiee_le)} · <Link href={`/signaler/${a.id}`} className="underline">Signaler l&apos;annonce</Link>
          </p>
        </aside>
      </div>

      {similaires.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold">Annonces similaires</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((s) => <AnnonceCard key={s.id} a={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
