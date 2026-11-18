"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SelecteurPosition } from "./carte";
import { IconeCamera, IconeDocument, IconeFleche } from "./Icones";
import { IllustrationBien } from "./IllustrationBien";
import { formatPrix, formatSurface, LIBELLES_JURIDIQUE } from "@/lib/format";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseActif } from "@/lib/supabase/config";
import type { Categorie, Commune, StatutJuridique, TypeTransaction } from "@/lib/types";

const ETAPES = ["Le bien", "Localisation", "Prix et détails", "Photos et documents"];

const CATS: { code: Categorie; label: string }[] = [
  { code: "terrain", label: "Terrain" },
  { code: "champ", label: "Champ" },
  { code: "maison", label: "Maison" },
  { code: "appartement", label: "Appartement" },
  { code: "local", label: "Local pro" },
];

const CHAMPS_SPECIFIQUES: Record<Categorie, { cle: string; label: string; placeholder: string }[]> = {
  terrain: [
    { cle: "viabilise", label: "Viabilisé", placeholder: "Oui, partiel, non" },
    { cle: "route", label: "Accès", placeholder: "Route bitumée, latérite, piste" },
  ],
  champ: [
    { cle: "eau", label: "Accès à l'eau", placeholder: "Forage, puits, canal…" },
    { cle: "sol", label: "Type de sol", placeholder: "Sableux, dior, deck…" },
    { cle: "cloture", label: "Clôture", placeholder: "Grillage, mur, haie, non" },
    { cle: "route", label: "Distance à la route", placeholder: "Ex. 500 m" },
  ],
  maison: [
    { cle: "pieces", label: "Pièces", placeholder: "Ex. 5" },
    { cle: "chambres", label: "Chambres", placeholder: "Ex. 3" },
    { cle: "salles_de_bain", label: "Salles de bain", placeholder: "Ex. 2" },
    { cle: "etat", label: "État", placeholder: "Neuf, bon, à rénover" },
  ],
  appartement: [
    { cle: "pieces", label: "Pièces", placeholder: "Ex. 3" },
    { cle: "chambres", label: "Chambres", placeholder: "Ex. 2" },
    { cle: "etage", label: "Étage", placeholder: "Ex. 2" },
    { cle: "meuble", label: "Meublé", placeholder: "Oui / non" },
  ],
  local: [
    { cle: "etat", label: "État", placeholder: "Bon, à aménager" },
    { cle: "electricite", label: "Électricité", placeholder: "Compteur individuel…" },
  ],
};

export function FormulaireAnnonce({ communes }: { communes: Commune[] }) {
  const [etape, setEtape] = useState(0);
  const [categorie, setCategorie] = useState<Categorie>("terrain");
  const [transaction, setTransaction] = useState<TypeTransaction>("vente");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [communeId, setCommuneId] = useState<number>(communes[0]?.id ?? 1);
  const [quartier, setQuartier] = useState("");
  const commune = useMemo(() => communes.find((c) => c.id === communeId), [communes, communeId]);
  const [pos, setPos] = useState<{ lat: number; lng: number }>({ lat: communes[0]?.lat ?? 14.7167, lng: communes[0]?.lng ?? -17.4677 });
  const [prix, setPrix] = useState("");
  const [negociable, setNegociable] = useState(true);
  const [surface, setSurface] = useState("");
  const [unite, setUnite] = useState<"m2" | "ha">("m2");
  const [juridique, setJuridique] = useState<StatutJuridique>("titre_foncier");
  const [caracs, setCaracs] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur" | "connexion">("repos");
  const [erreur, setErreur] = useState("");

  const surfaceM2 = Number(surface.replace(",", ".")) * (unite === "ha" ? 10_000 : 1);
  const prixNum = Number(prix.replace(/\s/g, ""));

  const valide = [
    titre.trim().length >= 8,
    Boolean(communeId),
    prixNum > 0 && surfaceM2 > 0,
    true,
  ];

  function changerCommune(id: number) {
    setCommuneId(id);
    const c = communes.find((x) => x.id === id);
    if (c) setPos({ lat: c.lat, lng: c.lng });
  }

  async function publier(brouillon: boolean) {
    setEtat("envoi");
    setErreur("");
    if (!supabaseActif) {
      await new Promise((r) => setTimeout(r, 800));
      setEtat("ok");
      return;
    }
    const supabase = creerClientNavigateur();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setEtat("connexion");

    const { data: id, error } = await supabase.rpc("creer_annonce", {
      p_categorie: categorie,
      p_commune_id: communeId,
      p_transaction: transaction,
      p_titre: titre.trim(),
      p_description: description.trim(),
      p_prix: prixNum,
      p_negociable: negociable,
      p_superficie: surfaceM2,
      p_statut_juridique: juridique,
      p_quartier: quartier.trim() || null,
      p_lat: pos.lat,
      p_lng: pos.lng,
      p_caracteristiques: Object.fromEntries(Object.entries(caracs).filter(([, v]) => v.trim())),
      p_brouillon: brouillon,
    });
    if (error || !id) {
      setErreur(error?.message ?? "Erreur inconnue");
      return setEtat("erreur");
    }

    // Photos publiques
    for (const [i, f] of photos.entries()) {
      const chemin = `${u.user.id}/${id}/${Date.now()}-${i}-${f.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("annonces").upload(chemin, f, { contentType: f.type });
      if (!up.error) await supabase.from("medias").insert({ annonce_id: id, chemin, ordre: i });
    }
    // Documents privés
    for (const f of documents) {
      const chemin = `${u.user.id}/${id}/${Date.now()}-${f.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("documents").upload(chemin, f, { contentType: f.type });
      if (!up.error) await supabase.from("documents").insert({ annonce_id: id, type: juridique, chemin });
    }
    setEtat("ok");
  }

  if (etat === "ok") {
    return (
      <div className="plan-grid-blanc mt-10 rounded-[2rem] bg-dk p-10 text-blanc">
        <h2 className="text-2xl font-bold">Annonce envoyée en modération.</h2>
        <p className="mt-2 text-blanc/80">
          {supabaseActif ? "Vous recevrez une notification dès sa publication." : "Mode démonstration : rien n'a été enregistré. Configurez Supabase pour publier réellement."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/compte" className="btn-blanc">Voir mes annonces</Link>
          <button onClick={() => { setEtat("repos"); setEtape(0); }} className="btn border border-blanc/40 text-blanc">Publier une autre annonce</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        {/* Étapes */}
        <ol className="grid grid-cols-4 gap-2">
          {ETAPES.map((e, i) => (
            <li key={e}>
              <button
                type="button"
                onClick={() => i <= etape && setEtape(i)}
                className={`w-full border-t-4 pt-2 text-left text-xs font-semibold sm:text-sm ${i <= etape ? "border-dk text-dk" : "border-dk/15 text-dk/40"}`}
              >
                {i + 1}. {e}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-6">
          {etape === 0 && (
            <>
              <fieldset>
                <legend className="etiquette">Type de bien</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {CATS.map((c) => (
                    <button
                      type="button"
                      key={c.code}
                      onClick={() => { setCategorie(c.code); setCaracs({}); }}
                      className={`overflow-hidden rounded-2xl border text-sm font-semibold transition ${categorie === c.code ? "border-dk ring-4 ring-dk/10" : "border-dk/15"}`}
                    >
                      <div className="aspect-[4/3]"><IllustrationBien categorie={c.code} graine={c.code} /></div>
                      <span className="block py-2">{c.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="etiquette">Transaction</legend>
                <div className="grid grid-cols-3 gap-2">
                  {([["vente", "Vente"], ["location", "Location"], ["bail", "Bail"]] as [TypeTransaction, string][]).map(([v, l]) => (
                    <button type="button" key={v} onClick={() => setTransaction(v)} className={`btn ${transaction === v ? "bg-dk text-blanc" : "border border-dk/20"}`}>{l}</button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className="etiquette" htmlFor="titre">Titre de l&apos;annonce</label>
                <input id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} maxLength={120} placeholder="Ex. Champ maraîcher de 2 ha avec forage" className="champ" />
                <p className="mt-1 text-xs text-dk/50">{titre.length}/120 · 8 caractères minimum</p>
              </div>
              <div>
                <label className="etiquette" htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="État, accès, voisinage, documents disponibles…" className="champ" />
              </div>
            </>
          )}

          {etape === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="etiquette" htmlFor="commune">Commune</label>
                  <select id="commune" value={communeId} onChange={(e) => changerCommune(Number(e.target.value))} className="champ">
                    {communes.map((c) => <option key={c.id} value={c.id}>{c.nom} ({c.region})</option>)}
                  </select>
                </div>
                <div>
                  <label className="etiquette" htmlFor="quartier">Quartier ou village</label>
                  <input id="quartier" value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Ex. Ndiogo" className="champ" />
                </div>
              </div>
              <div>
                <span className="etiquette">Position exacte du bien</span>
                <SelecteurPosition lat={pos.lat} lng={pos.lng} onChange={(lat, lng) => setPos({ lat, lng })} />
                <p className="mt-2 text-xs text-dk/55">{pos.lat.toFixed(5)}, {pos.lng.toFixed(5)}</p>
              </div>
            </>
          )}

          {etape === 2 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="etiquette" htmlFor="prix">Prix (FCFA){transaction === "location" ? " par mois" : transaction === "bail" ? " par an" : ""}</label>
                  <input id="prix" inputMode="numeric" value={prix} onChange={(e) => setPrix(e.target.value.replace(/[^\d\s]/g, ""))} placeholder="Ex. 15 000 000" className="champ" />
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={negociable} onChange={(e) => setNegociable(e.target.checked)} className="accent-[#0B3C8C]" /> Prix négociable
                  </label>
                </div>
                <div>
                  <label className="etiquette" htmlFor="surface">Superficie</label>
                  <div className="flex gap-2">
                    <input id="surface" inputMode="decimal" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder={unite === "ha" ? "Ex. 2" : "Ex. 300"} className="champ" />
                    <select value={unite} onChange={(e) => setUnite(e.target.value as "m2" | "ha")} className="champ w-28">
                      <option value="m2">m²</option>
                      <option value="ha">ha</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="etiquette" htmlFor="juridique">Statut juridique</label>
                <select id="juridique" value={juridique} onChange={(e) => setJuridique(e.target.value as StatutJuridique)} className="champ">
                  {Object.entries(LIBELLES_JURIDIQUE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {CHAMPS_SPECIFIQUES[categorie].map((ch) => (
                  <div key={ch.cle}>
                    <label className="etiquette" htmlFor={ch.cle}>{ch.label}</label>
                    <input id={ch.cle} value={caracs[ch.cle] ?? ""} onChange={(e) => setCaracs({ ...caracs, [ch.cle]: e.target.value })} placeholder={ch.placeholder} className="champ" />
                  </div>
                ))}
              </div>
            </>
          )}

          {etape === 3 && (
            <>
              <label className="plan-grid flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-dk)] border-2 border-dashed border-dk/25 p-10 text-center hover:border-dk">
                <IconeCamera className="size-8" />
                <span className="mt-3 font-semibold">Ajouter des photos (15 max.)</span>
                <span className="text-sm text-dk/55">JPG ou PNG · les photos de jour, prises de plusieurs angles, attirent plus de visites</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setPhotos([...photos, ...Array.from(e.target.files ?? [])].slice(0, 15))} />
              </label>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {photos.map((f, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-dk/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-blanc px-2 text-sm font-bold">×</button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-4 rounded-[var(--radius-dk)] border border-dk/15 p-5 hover:border-dk">
                <span className="flex size-11 items-center justify-center rounded-xl bg-dk text-blanc"><IconeDocument /></span>
                <span className="flex-1">
                  <span className="block font-semibold">Documents du bien (privés)</span>
                  <span className="text-sm text-dk/60">{documents.length ? documents.map((d) => d.name).join(", ") : "Titre foncier, bail, délibération, plan… Visibles uniquement par nos vérificateurs."}</span>
                </span>
                <input type="file" accept="image/*,application/pdf" multiple className="sr-only" onChange={(e) => setDocuments(Array.from(e.target.files ?? []))} />
              </label>
            </>
          )}
        </div>

        {etat === "connexion" && <p className="mt-6 font-medium">Connectez-vous pour publier. <Link href="/connexion?suite=/publier" className="underline">Se connecter</Link></p>}
        {etat === "erreur" && <p className="mt-6 font-medium">La publication a échoué : {erreur}</p>}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-dk/10 pt-6">
          <button type="button" onClick={() => setEtape(Math.max(0, etape - 1))} disabled={etape === 0} className="btn-contour">Retour</button>
          <div className="flex gap-2">
            {etape === 3 && <button type="button" onClick={() => publier(true)} disabled={etat === "envoi"} className="btn-contour">Enregistrer en brouillon</button>}
            {etape < 3 ? (
              <button type="button" onClick={() => setEtape(etape + 1)} disabled={!valide[etape]} className="btn-plein">Continuer <IconeFleche className="size-4" /></button>
            ) : (
              <button type="button" onClick={() => publier(false)} disabled={etat === "envoi" || !valide.every(Boolean)} className="btn-plein">{etat === "envoi" ? "Envoi…" : "Envoyer en modération"}</button>
            )}
          </div>
        </div>
      </div>

      {/* Aperçu */}
      <aside className="h-fit rounded-[var(--radius-dk)] border border-dk/15 lg:sticky lg:top-28">
        <p className="border-b border-dk/10 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-dk/50">Aperçu</p>
        <div className="aspect-[16/10] overflow-hidden">
          {photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(photos[0])} alt="" className="h-full w-full object-cover" />
          ) : (
            <IllustrationBien categorie={categorie} graine={titre || categorie} />
          )}
        </div>
        <div className="space-y-1 p-5">
          <p className="text-lg font-bold">{prixNum > 0 ? formatPrix(prixNum) : "Prix"}</p>
          <p className="font-medium text-dk/85">{titre || "Titre de votre annonce"}</p>
          <p className="text-sm text-dk/60">{commune?.nom ?? "Commune"}{surfaceM2 > 0 ? ` · ${formatSurface(surfaceM2)}` : ""}</p>
        </div>
      </aside>
    </div>
  );
}
