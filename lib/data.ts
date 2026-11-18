import "server-only";
import { ANNONCES_DEMO, COMMUNES_DEMO } from "./demo-data";
import { supabaseActif } from "./supabase/config";
import { creerClientServeur } from "./supabase/server";
import type { Annonce, Commune, Filtres } from "./types";

function filtrerDemo(f: Filtres): Annonce[] {
  const q = f.q?.trim().toLowerCase();
  let res = ANNONCES_DEMO.filter((a) => {
    if (q && !`${a.titre} ${a.description} ${a.commune} ${a.quartier ?? ""} ${a.region}`.toLowerCase().includes(q)) return false;
    if (f.categorie && a.categorie !== f.categorie) return false;
    if (f.transaction && a.type_transaction !== f.transaction) return false;
    if (f.region && a.region !== f.region) return false;
    if (f.prixMin && a.prix_xof < f.prixMin) return false;
    if (f.prixMax && a.prix_xof > f.prixMax) return false;
    if (f.surfaceMin && a.superficie_m2 < f.surfaceMin) return false;
    if (f.verifiees && !a.verifiee) return false;
    if (f.juridique && a.statut_juridique !== f.juridique) return false;
    return true;
  });
  const tri = f.tri ?? "recent";
  res = [...res].sort((a, b) => {
    if (a.a_la_une !== b.a_la_une) return a.a_la_une ? -1 : 1;
    if (tri === "prix_asc") return a.prix_xof - b.prix_xof;
    if (tri === "prix_desc") return b.prix_xof - a.prix_xof;
    if (tri === "surface") return b.superficie_m2 - a.superficie_m2;
    return (b.publiee_le ?? "").localeCompare(a.publiee_le ?? "");
  });
  return res;
}

export async function rechercherAnnonces(f: Filtres, limite = 48): Promise<Annonce[]> {
  if (!supabaseActif) return filtrerDemo(f).slice(0, limite);
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc("rechercher_annonces", {
    q: f.q ?? null,
    p_categorie: f.categorie ?? null,
    p_transaction: f.transaction ?? null,
    p_region: f.region ?? null,
    prix_min: f.prixMin ?? null,
    prix_max: f.prixMax ?? null,
    surface_min: f.surfaceMin ?? null,
    verifiees: f.verifiees ?? false,
    p_juridique: f.juridique ?? null,
    tri: f.tri ?? "recent",
    p_limite: limite,
  });
  if (error) {
    console.error("rechercher_annonces", error.message);
    return [];
  }
  return (data ?? []) as Annonce[];
}

export async function getAnnonce(id: string): Promise<Annonce | null> {
  if (!supabaseActif) return ANNONCES_DEMO.find((a) => a.id === id) ?? null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from("annonces_publiques").select("*").eq("id", id).maybeSingle();
  if (data) await supabase.rpc("incrementer_vues", { p_annonce: id });
  return (data as Annonce) ?? null;
}

export async function getSimilaires(a: Annonce): Promise<Annonce[]> {
  const liste = await rechercherAnnonces({ categorie: a.categorie }, 8);
  return liste.filter((x) => x.id !== a.id).slice(0, 3);
}

export async function getVendeur(id: string) {
  if (!supabaseActif) {
    return { nom_complet: "Vendeur de démonstration", identite_verifiee: true, localite: "Thiès", cree_le: "2026-06-01" };
  }
  const supabase = await creerClientServeur();
  const { data } = await supabase.from("vendeurs").select("*").eq("id", id).maybeSingle();
  return data as { nom_complet: string; identite_verifiee: boolean; localite: string | null; cree_le: string } | null;
}

export async function getCommunes(): Promise<Commune[]> {
  if (!supabaseActif) return COMMUNES_DEMO;
  const supabase = await creerClientServeur();
  const { data } = await supabase
    .from("communes")
    .select("id, nom, centre, departements(nom, regions(nom))")
    .order("nom");
  type Ligne = { id: number; nom: string; departements: { nom: string; regions: { nom: string } } };
  // Les coordonnées du centre servent seulement à centrer la carte ; à défaut, Dakar.
  return ((data ?? []) as unknown as Ligne[]).map((l) => ({
    id: l.id,
    nom: l.nom,
    departement: l.departements?.nom ?? "",
    region: l.departements?.regions?.nom ?? "",
    lat: COMMUNES_DEMO.find((c) => c.nom === l.nom)?.lat ?? 14.7167,
    lng: COMMUNES_DEMO.find((c) => c.nom === l.nom)?.lng ?? -17.4677,
  }));
}

export async function getStatistiques() {
  const toutes = supabaseActif ? await rechercherAnnonces({}, 100) : ANNONCES_DEMO;
  return {
    total: toutes.length,
    verifiees: toutes.filter((a) => a.verifiee).length,
    champs: toutes.filter((a) => a.categorie === "champ").length,
    regions: new Set(toutes.map((a) => a.region)).size,
  };
}

export async function getUtilisateur() {
  if (!supabaseActif) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profil } = await supabase.from("profils").select("*").eq("id", data.user.id).maybeSingle();
  return { user: data.user, profil: profil as { nom_complet: string; role: string; statut_kyc: string; telephone: string | null } | null };
}
