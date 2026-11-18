export type Categorie = "terrain" | "champ" | "maison" | "appartement" | "local";
export type TypeTransaction = "vente" | "location" | "bail";
export type StatutJuridique = "titre_foncier" | "bail" | "deliberation" | "acte_cession" | "autre";
export type StatutAnnonce = "brouillon" | "en_attente" | "publiee" | "en_pause" | "vendue" | "refusee";

export interface Annonce {
  id: string;
  reference: string;
  titre: string;
  description: string;
  prix_xof: number;
  negociable: boolean;
  superficie_m2: number;
  type_transaction: TypeTransaction;
  statut_juridique: StatutJuridique;
  statut: StatutAnnonce;
  verifiee: boolean;
  a_la_une: boolean;
  quartier: string | null;
  caracteristiques: Record<string, string | number | boolean>;
  publiee_le: string | null;
  vues: number;
  vendeur_id: string;
  categorie: Categorie;
  categorie_libelle: string;
  commune: string;
  departement: string;
  region: string;
  lat: number;
  lng: number;
  photos: string[];
}

export interface Filtres {
  q?: string;
  categorie?: Categorie;
  transaction?: TypeTransaction;
  region?: string;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  verifiees?: boolean;
  tri?: "recent" | "prix_asc" | "prix_desc" | "surface";
}

export interface Commune {
  id: number;
  nom: string;
  departement: string;
  region: string;
  lat: number;
  lng: number;
}
