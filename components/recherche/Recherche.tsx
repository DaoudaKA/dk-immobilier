"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { IconeRecherche } from "../Icones";
import { Resultats } from "./Resultats";
import { enregistrerRecherche } from "@/lib/favoris";
import { formatPrixCourt, LIBELLES_CATEGORIE, LIBELLES_JURIDIQUE, REGIONS } from "@/lib/format";
import type { Annonce, Filtres } from "@/lib/types";

type Valeurs = Record<string, string>;

const TRI = [["recent", "Plus récentes"], ["prix_asc", "Prix croissant"], ["prix_desc", "Prix décroissant"], ["surface", "Plus grande surface"]];
const PRIX = [["", "Indifférent"], ["5000000", "5 M"], ["10000000", "10 M"], ["20000000", "20 M"], ["50000000", "50 M"], ["100000000", "100 M"], ["300000000", "300 M"]];
const SURFACES = [["", "Indifférent"], ["150", "150 m²"], ["300", "300 m²"], ["500", "500 m²"], ["1000", "1 000 m²"], ["10000", "1 ha"], ["50000", "5 ha"]];

function versValeurs(f: Filtres): Valeurs {
  const v: Valeurs = {};
  if (f.q) v.q = f.q;
  if (f.categorie) v.categorie = f.categorie;
  if (f.transaction) v.transaction = f.transaction;
  if (f.region) v.region = f.region;
  if (f.prixMin) v.prixMin = String(f.prixMin);
  if (f.prixMax) v.prixMax = String(f.prixMax);
  if (f.surfaceMin) v.surfaceMin = String(f.surfaceMin);
  if (f.verifiees) v.verifiees = "1";
  if (f.juridique) v.juridique = f.juridique;
  if (f.tri && f.tri !== "recent") v.tri = f.tri;
  return v;
}

export function Recherche({ annonces, filtres }: { annonces: Annonce[]; filtres: Filtres }) {
  const router = useRouter();
  const chemin = usePathname();
  const [enCours, demarrer] = useTransition();
  const [valeurs, setValeurs] = useState<Valeurs>(versValeurs(filtres));
  const [texte, setTexte] = useState(filtres.q ?? "");
  const [panneau, setPanneau] = useState(false);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [enregistree, setEnregistree] = useState(false);
  const [carteVisible, setCarteVisible] = useState(true);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  function appliquer(maj: Valeurs) {
    const suivant = { ...valeurs, ...maj };
    Object.keys(suivant).forEach((k) => !suivant[k] && delete suivant[k]);
    setValeurs(suivant);
    setEnregistree(false);
    const qs = new URLSearchParams(suivant).toString();
    demarrer(() => router.replace(`${chemin}${qs ? `?${qs}` : ""}`, { scroll: false }));
  }

  useEffect(() => {
    if (texte === (valeurs.q ?? "")) return;
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => appliquer({ q: texte }), 450);
    return () => { if (minuteur.current) clearTimeout(minuteur.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texte]);

  // Synchronise l'état quand l'URL change ailleurs (menu, lien, retour arrière)
  const signature = JSON.stringify(filtres);
  useEffect(() => {
    const v = versValeurs(filtres);
    setValeurs(v);
    setTexte((t) => (document.activeElement?.tagName === "INPUT" ? t : v.q ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    const fermer = () => setOuvert(null);
    window.addEventListener("click", fermer);
    return () => window.removeEventListener("click", fermer);
  }, []);

  const puces: [string, string][] = [];
  if (valeurs.categorie) puces.push(["categorie", LIBELLES_CATEGORIE[valeurs.categorie as keyof typeof LIBELLES_CATEGORIE]]);
  if (valeurs.transaction) puces.push(["transaction", { vente: "Achat", location: "Location", bail: "Bail" }[valeurs.transaction] ?? ""]);
  if (valeurs.region) puces.push(["region", valeurs.region]);
  if (valeurs.prixMin) puces.push(["prixMin", `Dès ${formatPrixCourt(+valeurs.prixMin)} FCFA`]);
  if (valeurs.prixMax) puces.push(["prixMax", `Jusqu'à ${formatPrixCourt(+valeurs.prixMax)} FCFA`]);
  if (valeurs.surfaceMin) puces.push(["surfaceMin", `≥ ${SURFACES.find((s) => s[0] === valeurs.surfaceMin)?.[1] ?? valeurs.surfaceMin + " m²"}`]);
  if (valeurs.juridique) puces.push(["juridique", LIBELLES_JURIDIQUE[valeurs.juridique as keyof typeof LIBELLES_JURIDIQUE]]);
  if (valeurs.verifiees) puces.push(["verifiees", "Vérifiés uniquement"]);
  if (valeurs.q) puces.push(["q", `« ${valeurs.q} »`]);

  const titre =
    (valeurs.categorie ? `${LIBELLES_CATEGORIE[valeurs.categorie as keyof typeof LIBELLES_CATEGORIE]}s` : "Biens")
    + (valeurs.transaction === "location" ? " à louer" : valeurs.transaction === "vente" ? " à vendre" : valeurs.transaction === "bail" ? " en bail" : "")
    + (valeurs.region ? ` · ${valeurs.region}` : valeurs.q ? ` · ${valeurs.q}` : " au Sénégal");

  function Liste({ id, label, actif, options, cle }: { id: string; label: string; actif: boolean; options: string[][]; cle: string }) {
    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setOuvert(ouvert === id ? null : id)}
          className={`btn whitespace-nowrap py-2.5 ${actif ? "bg-dk text-blanc" : "border border-dk/20 hover:border-dk"}`}
        >
          {label} <span className={`text-xs transition ${ouvert === id ? "rotate-180" : ""}`}>▾</span>
        </button>
        {ouvert === id && (
          <div className="apparition absolute left-0 top-full z-[950] mt-2 w-60 rounded-2xl border border-dk/12 bg-blanc p-2 shadow-2xl">
            {options.map(([v, l]) => (
              <button
                key={v}
                onClick={() => { appliquer({ [cle]: v }); setOuvert(null); }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-dk/5 ${(valeurs[cle] ?? "") === v ? "bg-dk/5" : ""}`}
              >
                {l}{(valeurs[cle] ?? "") === v && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* ----- Barre de filtres collante ----- */}
      <div className="sticky top-[72px] z-[950] border-b border-dk/10 bg-blanc/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:overflow-visible">
          <label className="relative min-w-56 flex-1 lg:max-w-sm">
            <IconeRecherche className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-dk/50" />
            <input value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Ville, quartier, mot-clé…" className="champ rounded-full py-2.5 pl-11" />
          </label>
          <div className="flex shrink-0 rounded-full border border-dk/20 p-1">
            {[["", "Tout"], ["vente", "Acheter"], ["location", "Louer"], ["bail", "Bail"]].map(([v, l]) => (
              <button key={v} onClick={() => appliquer({ transaction: v })} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${(valeurs.transaction ?? "") === v ? "bg-dk text-blanc" : "text-dk/70 hover:text-dk"}`}>{l}</button>
            ))}
          </div>
          <Liste id="cat" cle="categorie" label={valeurs.categorie ? LIBELLES_CATEGORIE[valeurs.categorie as keyof typeof LIBELLES_CATEGORIE] : "Type de bien"} actif={!!valeurs.categorie} options={[["", "Tous les biens"], ...Object.entries(LIBELLES_CATEGORIE)]} />
          <Liste id="prix" cle="prixMax" label={valeurs.prixMax ? `≤ ${formatPrixCourt(+valeurs.prixMax)}` : "Prix max."} actif={!!valeurs.prixMax} options={PRIX.map(([v, l]) => [v, v ? `${l} FCFA` : l])} />
          <Liste id="surf" cle="surfaceMin" label={valeurs.surfaceMin ? `≥ ${SURFACES.find((s) => s[0] === valeurs.surfaceMin)?.[1]}` : "Surface"} actif={!!valeurs.surfaceMin} options={SURFACES} />
          <button onClick={() => setPanneau(true)} className="btn shrink-0 whitespace-nowrap border border-dk/20 py-2.5 hover:border-dk">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
            Plus de filtres
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{titre}</h1>
            <p className="mt-1 text-dk/60">
              {enCours ? "Recherche en cours…" : `${annonces.length} annonce${annonces.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setCarteVisible((v) => !v)} className="btn hidden border border-dk/20 py-2 hover:border-dk lg:inline-flex">
              {carteVisible ? "Masquer la carte" : "Afficher la carte"}
            </button>
            <button
              onClick={() => {
                enregistrerRecherche({ nom: titre, url: `${chemin}?${new URLSearchParams(valeurs)}`, date: new Date().toISOString() });
                setEnregistree(true);
              }}
              className={`btn py-2 ${enregistree ? "bg-dk text-blanc" : "border border-dk/20 hover:border-dk"}`}
            >
              {enregistree ? "✓ Recherche enregistrée" : "Enregistrer la recherche"}
            </button>
            <select value={valeurs.tri ?? "recent"} onChange={(e) => appliquer({ tri: e.target.value === "recent" ? "" : e.target.value })} className="champ w-auto rounded-full py-2 text-sm font-medium">
              {TRI.map(([v, l]) => <option key={v} value={v}>Trier : {l}</option>)}
            </select>
          </div>
        </div>

        {puces.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {puces.map(([cle, label]) => (
              <button key={cle} onClick={() => { if (cle === "q") setTexte(""); appliquer({ [cle]: "" }); }} className="inline-flex items-center gap-1.5 rounded-full bg-dk/5 px-3 py-1.5 text-sm font-medium ring-1 ring-dk/15 hover:ring-dk">
                {label} <span aria-hidden>×</span>
              </button>
            ))}
            <button onClick={() => { setTexte(""); setValeurs({}); demarrer(() => router.replace(chemin, { scroll: false })); }} className="px-2 text-sm font-semibold underline">Tout effacer</button>
          </div>
        )}

        <div className="mt-6">
          {annonces.length === 0 && !enCours ? (
            <div className="plan-grid rounded-[var(--radius-dk)] border border-dashed border-dk/25 p-14 text-center">
              <p className="text-xl font-semibold">Aucune annonce ne correspond à ces critères.</p>
              <p className="mt-2 text-dk/60">Élargissez la zone, augmentez le budget ou retirez un filtre.</p>
              <button onClick={() => { setTexte(""); setValeurs({}); router.replace(chemin); }} className="btn-plein mt-6">Effacer les filtres</button>
            </div>
          ) : (
            <Resultats annonces={annonces} enCours={enCours} carteVisible={carteVisible} />
          )}
        </div>
      </div>

      {/* ----- Panneau « Plus de filtres » ----- */}
      <div className={`fixed inset-0 z-[2000] ${panneau ? "" : "pointer-events-none"}`}>
        <div onClick={() => setPanneau(false)} className={`absolute inset-0 bg-dk/40 transition-opacity ${panneau ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-blanc shadow-2xl transition-transform duration-300 ${panneau ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-dk/10 p-5">
            <p className="text-lg font-bold">Tous les filtres</p>
            <button onClick={() => setPanneau(false)} className="flex size-10 items-center justify-center rounded-full border border-dk/15 text-xl" aria-label="Fermer">×</button>
          </div>
          <div className="flex-1 space-y-7 overflow-y-auto p-5">
            <div>
              <p className="etiquette">Région</p>
              <select value={valeurs.region ?? ""} onChange={(e) => appliquer({ region: e.target.value })} className="champ">
                <option value="">Tout le Sénégal</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <p className="etiquette">Prix (FCFA)</p>
              <div className="grid grid-cols-2 gap-2">
                <input inputMode="numeric" defaultValue={valeurs.prixMin} onBlur={(e) => appliquer({ prixMin: e.target.value.replace(/\D/g, "") })} placeholder="Minimum" className="champ" />
                <input inputMode="numeric" defaultValue={valeurs.prixMax} onBlur={(e) => appliquer({ prixMax: e.target.value.replace(/\D/g, "") })} placeholder="Maximum" className="champ" />
              </div>
            </div>
            <div>
              <p className="etiquette">Surface minimale</p>
              <div className="flex flex-wrap gap-2">
                {SURFACES.map(([v, l]) => (
                  <button key={v} onClick={() => appliquer({ surfaceMin: v })} className={`rounded-full px-3.5 py-2 text-sm font-medium ${(valeurs.surfaceMin ?? "") === v ? "bg-dk text-blanc" : "ring-1 ring-dk/20"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="etiquette">Statut juridique</p>
              <div className="flex flex-wrap gap-2">
                {[["", "Tous"], ...Object.entries(LIBELLES_JURIDIQUE)].map(([v, l]) => (
                  <button key={v} onClick={() => appliquer({ juridique: v })} className={`rounded-full px-3.5 py-2 text-sm font-medium ${(valeurs.juridique ?? "") === v ? "bg-dk text-blanc" : "ring-1 ring-dk/20"}`}>{l}</button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dk/15 p-4">
              <span>
                <span className="block font-semibold">Biens vérifiés uniquement</span>
                <span className="text-sm text-dk/60">Documents contrôlés par DK IMMOBILIER</span>
              </span>
              <input type="checkbox" checked={!!valeurs.verifiees} onChange={(e) => appliquer({ verifiees: e.target.checked ? "1" : "" })} className="size-5 accent-[#0B3C8C]" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-dk/10 p-5">
            <button onClick={() => { setTexte(""); setValeurs({}); router.replace(chemin); }} className="btn-contour">Tout effacer</button>
            <button onClick={() => setPanneau(false)} className="btn-plein">Voir {annonces.length} annonce{annonces.length > 1 ? "s" : ""}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
