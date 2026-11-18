import type { Categorie, StatutJuridique, TypeTransaction } from "./types";

export function formatPrix(xof: number): string {
  return new Intl.NumberFormat("fr-FR").format(xof).replace(/ | /g, " ") + " FCFA";
}

export function formatPrixCourt(xof: number): string {
  if (xof >= 1_000_000_000) return `${(xof / 1_000_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Md`;
  if (xof >= 1_000_000) return `${(xof / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  if (xof >= 1_000) return `${Math.round(xof / 1_000)} k`;
  return String(xof);
}

export function formatSurface(m2: number): string {
  if (m2 >= 10_000) {
    return `${(m2 / 10_000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ha`;
  }
  return `${new Intl.NumberFormat("fr-FR").format(m2).replace(/ | /g, " ")} m²`;
}

export function prixAuM2(prix: number, m2: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(prix / m2)).replace(/ | /g, " ")} FCFA/m²`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export const LIBELLES_CATEGORIE: Record<Categorie, string> = {
  terrain: "Terrain",
  champ: "Champ",
  maison: "Maison / villa",
  appartement: "Appartement",
  local: "Local pro",
};

export const LIBELLES_TRANSACTION: Record<TypeTransaction, string> = {
  vente: "À vendre",
  location: "À louer",
  bail: "Bail",
};

export const LIBELLES_JURIDIQUE: Record<StatutJuridique, string> = {
  titre_foncier: "Titre foncier",
  bail: "Bail",
  deliberation: "Délibération communale",
  acte_cession: "Acte de cession",
  autre: "Autre",
};

export const LIBELLES_CARACTERISTIQUES: Record<string, string> = {
  eau: "Accès à l'eau",
  sol: "Type de sol",
  cloture: "Clôture",
  route: "Distance route",
  electricite: "Électricité",
  pieces: "Pièces",
  chambres: "Chambres",
  salles_de_bain: "Salles de bain",
  etage: "Étage",
  etat: "État",
  viabilise: "Viabilisé",
  meuble: "Meublé",
  parking: "Parking",
};

export const REGIONS = [
  "Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Kolda",
  "Kédougou", "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Ziguinchor",
];
