import type { Metadata } from "next";
import Link from "next/link";
import { AnnonceCard } from "@/components/AnnonceCard";
import { CarteAnnonces } from "@/components/carte";
import { IconeCarte, IconeListe, IconeRecherche } from "@/components/Icones";
import { rechercherAnnonces } from "@/lib/data";
import { LIBELLES_CATEGORIE, REGIONS } from "@/lib/format";
import type { Categorie, Filtres, TypeTransaction } from "@/lib/types";

export const metadata: Metadata = { title: "Annonces" };

type SP = Record<string, string | string[] | undefined>;
const un = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const nombre = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export default async function PageAnnonces({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filtres: Filtres = {
    q: un(sp.q),
    categorie: un(sp.categorie) as Categorie | undefined,
    transaction: un(sp.transaction) as TypeTransaction | undefined,
    region: un(sp.region),
    prixMin: nombre(un(sp.prixMin)),
    prixMax: nombre(un(sp.prixMax)),
    surfaceMin: nombre(un(sp.surfaceMin)),
    verifiees: un(sp.verifiees) === "1",
    tri: (un(sp.tri) as Filtres["tri"]) ?? "recent",
  };
  const vue = un(sp.vue) === "carte" ? "carte" : "liste";
  const annonces = await rechercherAnnonces(filtres);

  const lienVue = (v: string) => {
    const p = new URLSearchParams(Object.entries(sp).flatMap(([k, val]) => (val ? [[k, String(un(val))]] : [])));
    p.set("vue", v);
    return `/annonces?${p.toString()}`;
  };

  const titre = filtres.categorie ? `${LIBELLES_CATEGORIE[filtres.categorie]}s` : "Toutes les annonces";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{titre}{filtres.region ? ` · ${filtres.region}` : ""}</h1>
          <p className="mt-1 text-dk/60">{annonces.length} résultat{annonces.length > 1 ? "s" : ""}{filtres.q ? ` pour « ${filtres.q} »` : ""}</p>
        </div>
        <div className="flex rounded-full border border-dk/15 p-1">
          <Link href={lienVue("liste")} className={`btn px-4 py-2 ${vue === "liste" ? "bg-dk text-blanc" : ""}`}><IconeListe className="size-4" /> Liste</Link>
          <Link href={lienVue("carte")} className={`btn px-4 py-2 ${vue === "carte" ? "bg-dk text-blanc" : ""}`}><IconeCarte className="size-4" /> Carte</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[290px_1fr]">
        {/* ---------- Filtres ---------- */}
        <form action="/annonces" className="h-fit space-y-5 rounded-[var(--radius-dk)] border border-dk/12 p-5 lg:sticky lg:top-28">
          <input type="hidden" name="vue" value={vue} />
          <div>
            <label className="etiquette" htmlFor="q">Mot-clé ou lieu</label>
            <div className="relative">
              <IconeRecherche className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dk/50" />
              <input id="q" name="q" defaultValue={filtres.q} placeholder="Ex. Mboro, forage…" className="champ pl-10" />
            </div>
          </div>
          <div>
            <label className="etiquette" htmlFor="categorie">Type de bien</label>
            <select id="categorie" name="categorie" defaultValue={filtres.categorie ?? ""} className="champ">
              <option value="">Tous</option>
              {Object.entries(LIBELLES_CATEGORIE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="etiquette">Transaction</legend>
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-dk/15 p-1 text-sm">
              {[["", "Tout"], ["vente", "Achat"], ["location", "Location"], ["bail", "Bail"]].map(([v, l]) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="transaction" value={v} defaultChecked={(filtres.transaction ?? "") === v} className="peer sr-only" />
                  <span className="block rounded-lg py-2 text-center font-medium text-dk/70 peer-checked:bg-dk peer-checked:text-blanc">{l}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="etiquette" htmlFor="region">Région</label>
            <select id="region" name="region" defaultValue={filtres.region ?? ""} className="champ">
              <option value="">Tout le Sénégal</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <span className="etiquette">Prix (FCFA)</span>
            <div className="grid grid-cols-2 gap-2">
              <input name="prixMin" inputMode="numeric" defaultValue={filtres.prixMin} placeholder="Min" className="champ" />
              <input name="prixMax" inputMode="numeric" defaultValue={filtres.prixMax} placeholder="Max" className="champ" />
            </div>
          </div>
          <div>
            <label className="etiquette" htmlFor="surfaceMin">Surface minimale (m²)</label>
            <input id="surfaceMin" name="surfaceMin" inputMode="numeric" defaultValue={filtres.surfaceMin} placeholder="Ex. 10000 pour 1 ha" className="champ" />
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dk/15 px-4 py-3">
            <span className="font-medium">Biens vérifiés uniquement</span>
            <input type="checkbox" name="verifiees" value="1" defaultChecked={filtres.verifiees} className="size-5 accent-[#0B3C8C]" />
          </label>
          <div>
            <label className="etiquette" htmlFor="tri">Trier par</label>
            <select id="tri" name="tri" defaultValue={filtres.tri} className="champ">
              <option value="recent">Plus récentes</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="surface">Plus grande surface</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-plein flex-1">Appliquer</button>
            <Link href="/annonces" className="btn-contour">Effacer</Link>
          </div>
        </form>

        {/* ---------- Résultats ---------- */}
        <div>
          {annonces.length === 0 ? (
            <div className="plan-grid rounded-[var(--radius-dk)] border border-dashed border-dk/25 p-14 text-center">
              <p className="text-xl font-semibold">Aucune annonce ne correspond.</p>
              <p className="mt-2 text-dk/60">Élargissez la zone, le budget ou retirez un filtre.</p>
              <Link href="/annonces" className="btn-plein mt-6">Voir toutes les annonces</Link>
            </div>
          ) : vue === "carte" ? (
            <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
              <div className="h-[70vh] min-h-[480px]"><CarteAnnonces annonces={annonces} /></div>
              <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
                {annonces.map((a) => <div key={a.id} className="shrink-0"><AnnonceCard a={a} /></div>)}
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {annonces.map((a) => <AnnonceCard key={a.id} a={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
