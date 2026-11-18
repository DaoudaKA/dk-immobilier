"use client";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { IconePin, IconeRecherche } from "./Icones";

type Lieu = { nom: string; region: string };
const ONGLETS = [
  { cle: "vente", label: "Acheter" },
  { cle: "location", label: "Louer" },
  { cle: "agricole", label: "Terres agricoles" },
] as const;

const BUDGETS = [
  ["", "Budget max."],
  ["5000000", "5 M FCFA"],
  ["15000000", "15 M FCFA"],
  ["30000000", "30 M FCFA"],
  ["50000000", "50 M FCFA"],
  ["100000000", "100 M FCFA"],
  ["300000000", "300 M FCFA"],
];
const LOYERS = [["", "Loyer max."], ["150000", "150 000 FCFA"], ["300000", "300 000 FCFA"], ["500000", "500 000 FCFA"], ["1000000", "1 M FCFA"]];

const sansAccent = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function BarreRecherche({ lieux }: { lieux: Lieu[] }) {
  const router = useRouter();
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]["cle"]>("vente");
  const [q, setQ] = useState("");
  const [categorie, setCategorie] = useState("");
  const [budget, setBudget] = useState("");
  const [focus, setFocus] = useState(false);
  const [actifIdx, setActifIdx] = useState(0);
  const champ = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const t = sansAccent(q.trim());
    const regions = [...new Set(lieux.map((l) => l.region))].map((r) => ({ nom: r, region: "Région" }));
    const tous = [...regions, ...lieux];
    return (t ? tous.filter((l) => sansAccent(l.nom).includes(t)) : tous.filter((l) => ["Dakar", "Thiès", "Mboro", "Diamniadio", "Saly", "Darou Khoudoss"].includes(l.nom))).slice(0, 7);
  }, [q, lieux]);

  function rechercher(lieu?: Lieu) {
    const p = new URLSearchParams();
    if (onglet === "agricole") p.set("categorie", "champ");
    else {
      p.set("transaction", onglet);
      if (categorie) p.set("categorie", categorie);
    }
    if (lieu?.region === "Région") p.set("region", lieu.nom);
    else if (lieu) p.set("q", lieu.nom);
    else if (q.trim()) p.set("q", q.trim());
    if (budget) p.set("prixMax", budget);
    router.push(`/annonces?${p.toString()}`);
  }

  return (
    <div className="w-full">
      <div className="flex gap-1" role="tablist">
        {ONGLETS.map((o) => (
          <button
            key={o.cle}
            role="tab"
            aria-selected={onglet === o.cle}
            onClick={() => { setOnglet(o.cle); setBudget(""); }}
            className={`rounded-t-2xl px-5 py-3 text-sm font-semibold transition ${onglet === o.cle ? "bg-blanc text-dk" : "bg-dk/60 text-blanc/85 backdrop-blur hover:bg-dk/80"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); rechercher(); }}
        className="grid gap-2 rounded-b-[1.6rem] rounded-tr-[1.6rem] bg-blanc p-2.5 text-dk shadow-[0_30px_70px_-25px_rgb(0_0_0/.5)] md:grid-cols-[1.6fr_1fr_1fr_auto]"
      >
        <div className="relative">
          <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-dk/5">
            <IconeRecherche className="size-5 shrink-0 text-dk/55" />
            <span className="flex w-full flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">Localisation</span>
              <input
                ref={champ}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActifIdx(0); }}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 150)}
                onKeyDown={(e) => {
                  if (!focus || !suggestions.length) return;
                  if (e.key === "ArrowDown") { e.preventDefault(); setActifIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActifIdx((i) => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && q.trim()) { e.preventDefault(); rechercher(suggestions[actifIdx]); }
                }}
                placeholder="Ville, commune, quartier…"
                autoComplete="off"
                className="w-full bg-transparent font-medium outline-none placeholder:text-dk/40"
              />
            </span>
          </label>
          {focus && suggestions.length > 0 && (
            <ul className="apparition absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-dk/12 bg-blanc py-2 shadow-2xl md:right-[-40%]">
              {!q && <li className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-dk/45">Recherches fréquentes</li>}
              {suggestions.map((s, i) => (
                <li key={s.nom + s.region}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => rechercher(s)}
                    onMouseEnter={() => setActifIdx(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${i === actifIdx ? "bg-dk/5" : ""}`}
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-dk/8 text-dk"><IconePin className="size-4" /></span>
                    <span>
                      <span className="block font-medium">{s.nom}</span>
                      <span className="block text-xs text-dk/55">{s.region === "Région" ? "Toute la région" : `Région de ${s.region}`}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label className="flex flex-col rounded-2xl px-4 py-3 transition hover:bg-dk/5 md:border-l md:border-dk/10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">Type de bien</span>
          <select value={onglet === "agricole" ? "champ" : categorie} onChange={(e) => setCategorie(e.target.value)} disabled={onglet === "agricole"} className="bg-transparent font-medium outline-none">
            <option value="">Tous les biens</option>
            <option value="terrain">Terrain</option>
            <option value="champ">Champ / terre agricole</option>
            <option value="maison">Maison / villa</option>
            <option value="appartement">Appartement</option>
            <option value="local">Local professionnel</option>
          </select>
        </label>
        <label className="flex flex-col rounded-2xl px-4 py-3 transition hover:bg-dk/5 md:border-l md:border-dk/10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">{onglet === "location" ? "Loyer" : "Budget"}</span>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="bg-transparent font-medium outline-none">
            {(onglet === "location" ? LOYERS : BUDGETS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <button className="btn-plein min-h-14 rounded-2xl px-8 text-base">
          <IconeRecherche />
          Rechercher
        </button>
      </form>
    </div>
  );
}
