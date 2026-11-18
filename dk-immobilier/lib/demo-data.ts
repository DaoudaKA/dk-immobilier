// Données fictives utilisées quand Supabase n'est pas encore configuré.
import type { Annonce, Commune } from "./types";

export const COMMUNES_DEMO: Commune[] = [
  { id: 1, nom: "Dakar Plateau", departement: "Dakar", region: "Dakar", lat: 14.668, lng: -17.437 },
  { id: 2, nom: "Ngor-Almadies", departement: "Dakar", region: "Dakar", lat: 14.745, lng: -17.51 },
  { id: 3, nom: "Mermoz-Sacré-Cœur", departement: "Dakar", region: "Dakar", lat: 14.711, lng: -17.475 },
  { id: 4, nom: "Pikine", departement: "Pikine", region: "Dakar", lat: 14.755, lng: -17.39 },
  { id: 5, nom: "Guédiawaye", departement: "Guédiawaye", region: "Dakar", lat: 14.776, lng: -17.395 },
  { id: 6, nom: "Keur Massar", departement: "Keur Massar", region: "Dakar", lat: 14.783, lng: -17.311 },
  { id: 7, nom: "Rufisque", departement: "Rufisque", region: "Dakar", lat: 14.716, lng: -17.273 },
  { id: 8, nom: "Diamniadio", departement: "Rufisque", region: "Dakar", lat: 14.723, lng: -17.183 },
  { id: 9, nom: "Bargny", departement: "Rufisque", region: "Dakar", lat: 14.698, lng: -17.228 },
  { id: 10, nom: "Sangalkam", departement: "Rufisque", region: "Dakar", lat: 14.787, lng: -17.229 },
  { id: 11, nom: "Thiès", departement: "Thiès", region: "Thiès", lat: 14.79, lng: -16.926 },
  { id: 12, nom: "Pout", departement: "Thiès", region: "Thiès", lat: 14.77, lng: -17.06 },
  { id: 13, nom: "Kayar", departement: "Thiès", region: "Thiès", lat: 14.917, lng: -17.117 },
  { id: 14, nom: "Mbour", departement: "Mbour", region: "Thiès", lat: 14.42, lng: -16.964 },
  { id: 15, nom: "Saly", departement: "Mbour", region: "Thiès", lat: 14.447, lng: -17.013 },
  { id: 16, nom: "Somone", departement: "Mbour", region: "Thiès", lat: 14.488, lng: -17.083 },
  { id: 17, nom: "Tivaouane", departement: "Tivaouane", region: "Thiès", lat: 14.95, lng: -16.817 },
  { id: 18, nom: "Mboro", departement: "Tivaouane", region: "Thiès", lat: 15.137, lng: -16.884 },
  { id: 19, nom: "Darou Khoudoss", departement: "Tivaouane", region: "Thiès", lat: 15.1, lng: -16.8 },
  { id: 20, nom: "Taïba Ndiaye", departement: "Tivaouane", region: "Thiès", lat: 15.05, lng: -16.9 },
  { id: 21, nom: "Louga", departement: "Louga", region: "Louga", lat: 15.618, lng: -16.224 },
  { id: 22, nom: "Kébémer", departement: "Kébémer", region: "Louga", lat: 15.37, lng: -16.44 },
  { id: 23, nom: "Saint-Louis", departement: "Saint-Louis", region: "Saint-Louis", lat: 16.03, lng: -16.49 },
  { id: 24, nom: "Richard-Toll", departement: "Dagana", region: "Saint-Louis", lat: 16.462, lng: -15.7 },
  { id: 25, nom: "Touba", departement: "Mbacké", region: "Diourbel", lat: 14.85, lng: -15.88 },
  { id: 26, nom: "Kaolack", departement: "Kaolack", region: "Kaolack", lat: 14.15, lng: -16.07 },
  { id: 27, nom: "Ziguinchor", departement: "Ziguinchor", region: "Ziguinchor", lat: 12.56, lng: -16.27 },
];

const c = (nom: string) => COMMUNES_DEMO.find((x) => x.nom === nom)!;

type Base = Omit<Annonce, "commune" | "departement" | "region" | "lat" | "lng" | "vues" | "vendeur_id" | "statut" | "photos" | "categorie_libelle"> & {
  communeNom: string;
  dLat: number;
  dLng: number;
};

const LIBELLE: Record<string, string> = {
  terrain: "Terrain",
  champ: "Champ / terre agricole",
  maison: "Maison / villa",
  appartement: "Appartement",
  local: "Local professionnel",
};

const base: Base[] = [
  {
    id: "a1", reference: "DK-7Q2M4A", titre: "Champ maraîcher de 2 ha avec forage", communeNom: "Mboro", dLat: 0.012, dLng: 0.01,
    description: "Champ en pleine zone des Niayes, sol sablo-humifère idéal pour l'oignon, la carotte et le chou. Forage équipé d'une pompe solaire, bassin de 30 m³, clôture en grillage sur trois côtés. Accès par piste à 800 m de la route Mboro–Tivaouane.",
    prix_xof: 18_000_000, negociable: true, superficie_m2: 20_000, type_transaction: "vente", statut_juridique: "deliberation",
    verifiee: true, a_la_une: true, quartier: "Ndiogo", categorie: "champ", publiee_le: "2026-11-14T09:00:00Z",
    caracteristiques: { eau: "Forage + pompe solaire", sol: "Sablo-humifère (dior-deck)", cloture: "Grillage, 3 côtés", route: "800 m" },
  },
  {
    id: "a2", reference: "DK-3KD8PL", titre: "Terrain 300 m² viabilisé à Diamniadio", communeNom: "Diamniadio", dLat: -0.004, dLng: 0.006,
    description: "Parcelle d'angle dans un lotissement viabilisé (eau, électricité, voirie). À 5 minutes du Centre international de conférences et de l'autoroute à péage. Idéal pour une villa R+1.",
    prix_xof: 13_500_000, negociable: false, superficie_m2: 300, type_transaction: "vente", statut_juridique: "titre_foncier",
    verifiee: true, a_la_une: false, quartier: "Lotissement Sococim", categorie: "terrain", publiee_le: "2026-11-15T10:00:00Z",
    caracteristiques: { viabilise: true, electricite: "Senelec", route: "Bitumée" },
  },
  {
    id: "a3", reference: "DK-9PL2XX", titre: "Villa F5 avec jardin aux Almadies", communeNom: "Ngor-Almadies", dLat: 0.002, dLng: -0.004,
    description: "Villa récente de 5 pièces sur 420 m² de terrain : 4 chambres dont 2 suites, salon double, cuisine équipée, jardin arboré et garage pour 2 voitures. Quartier calme à 3 minutes de la plage.",
    prix_xof: 285_000_000, negociable: true, superficie_m2: 420, type_transaction: "vente", statut_juridique: "titre_foncier",
    verifiee: true, a_la_une: true, quartier: "Almadies", categorie: "maison", publiee_le: "2026-11-12T08:00:00Z",
    caracteristiques: { pieces: 5, chambres: 4, salles_de_bain: 3, etat: "Très bon", parking: "2 places" },
  },
  {
    id: "a4", reference: "DK-5TR6YB", titre: "Appartement F3 meublé à Mermoz", communeNom: "Mermoz-Sacré-Cœur", dLat: 0.001, dLng: 0.003,
    description: "Appartement lumineux au 2e étage d'un immeuble sécurisé : 2 chambres climatisées, salon, cuisine américaine, balcon. Gardien 24 h/24 et groupe électrogène.",
    prix_xof: 450_000, negociable: true, superficie_m2: 95, type_transaction: "location", statut_juridique: "titre_foncier",
    verifiee: false, a_la_une: false, quartier: "Mermoz Pyrotechnie", categorie: "appartement", publiee_le: "2026-11-16T12:00:00Z",
    caracteristiques: { pieces: 3, chambres: 2, salles_de_bain: 1, etage: 2, meuble: true },
  },
  {
    id: "a5", reference: "DK-1WQ7ZC", titre: "Terre agricole de 5 ha à Darou Khoudoss", communeNom: "Darou Khoudoss", dLat: -0.008, dLng: 0.012,
    description: "Grande parcelle plate, adaptée à l'arboriculture (manguiers, agrumes) ou au maraîchage. Nappe phréatique à faible profondeur, deux puits existants. Possibilité de morcellement.",
    prix_xof: 30_000_000, negociable: true, superficie_m2: 50_000, type_transaction: "vente", statut_juridique: "deliberation",
    verifiee: false, a_la_une: false, quartier: "Village de Khondio", categorie: "champ", publiee_le: "2026-11-10T09:00:00Z",
    caracteristiques: { eau: "2 puits", sol: "Sableux", cloture: "Non", route: "2 km" },
  },
  {
    id: "a6", reference: "DK-8HN3JU", titre: "Terrain 500 m² près de la plage de Saly", communeNom: "Saly", dLat: 0.006, dLng: -0.002,
    description: "Terrain résidentiel à 400 m de la plage, dans une zone de résidences secondaires. Eau et électricité en bordure. Bail transformable en titre foncier.",
    prix_xof: 22_000_000, negociable: true, superficie_m2: 500, type_transaction: "vente", statut_juridique: "bail",
    verifiee: true, a_la_une: false, quartier: "Saly Niakh Niakhal", categorie: "terrain", publiee_le: "2026-11-09T09:00:00Z",
    caracteristiques: { viabilise: "Partiel", route: "Latérite" },
  },
  {
    id: "a7", reference: "DK-4BV9KM", titre: "Magasin 60 m² sur l'avenue à Thiès", communeNom: "Thiès", dLat: 0.003, dLng: 0.002,
    description: "Local commercial en rez-de-chaussée sur axe passant, vitrine de 6 m, arrière-boutique et toilettes. Idéal boutique, pharmacie ou agence.",
    prix_xof: 250_000, negociable: false, superficie_m2: 60, type_transaction: "location", statut_juridique: "titre_foncier",
    verifiee: false, a_la_une: false, quartier: "Escale", categorie: "local", publiee_le: "2026-11-13T09:00:00Z",
    caracteristiques: { etat: "Bon", electricite: "Compteur individuel" },
  },
  {
    id: "a8", reference: "DK-6CX2NR", titre: "Maison familiale R+1 à Keur Massar", communeNom: "Keur Massar", dLat: -0.003, dLng: 0.004,
    description: "Maison de 7 pièces sur 200 m² : 5 chambres, 2 salons, terrasse aménageable. Proche marché, écoles et transports (BRT à 10 minutes).",
    prix_xof: 48_000_000, negociable: true, superficie_m2: 200, type_transaction: "vente", statut_juridique: "acte_cession",
    verifiee: false, a_la_une: false, quartier: "Unité 3", categorie: "maison", publiee_le: "2026-11-11T09:00:00Z",
    caracteristiques: { pieces: 7, chambres: 5, salles_de_bain: 2, etat: "À rafraîchir" },
  },
  {
    id: "a9", reference: "DK-2ZA5QE", titre: "Verger de manguiers 3 ha à Pout", communeNom: "Pout", dLat: 0.01, dLng: -0.008,
    description: "Verger en production : 280 manguiers Kent et Keitt, 40 citronniers. Logement de gardien, magasin de stockage, forage. Récolte 2026 incluse.",
    prix_xof: 42_000_000, negociable: true, superficie_m2: 30_000, type_transaction: "vente", statut_juridique: "titre_foncier",
    verifiee: true, a_la_une: false, quartier: "Keur Mbir Ndao", categorie: "champ", publiee_le: "2026-11-08T09:00:00Z",
    caracteristiques: { eau: "Forage", sol: "Argilo-sableux", cloture: "Mur + grillage", route: "300 m" },
  },
  {
    id: "a10", reference: "DK-0MK4TT", titre: "Terrain 150 m² à Sangalkam", communeNom: "Sangalkam", dLat: 0.004, dLng: 0.005,
    description: "Petite parcelle dans une zone en plein développement, parfaite pour un premier projet de construction. Documents disponibles pour vérification.",
    prix_xof: 6_500_000, negociable: true, superficie_m2: 150, type_transaction: "vente", statut_juridique: "deliberation",
    verifiee: false, a_la_une: false, quartier: "Bambilor", categorie: "terrain", publiee_le: "2026-11-16T09:00:00Z",
    caracteristiques: { viabilise: "Non", route: "Piste" },
  },
  {
    id: "a11", reference: "DK-7YU1PO", titre: "Champ irrigué 1 ha en bail à Richard-Toll", communeNom: "Richard-Toll", dLat: 0.005, dLng: 0.01,
    description: "Parcelle aménagée en bordure de canal, adaptée au riz ou à la tomate. Bail de 3 ans renouvelable, paiement par campagne possible.",
    prix_xof: 600_000, negociable: true, superficie_m2: 10_000, type_transaction: "bail", statut_juridique: "deliberation",
    verifiee: true, a_la_une: false, quartier: "Thiago", categorie: "champ", publiee_le: "2026-11-07T09:00:00Z",
    caracteristiques: { eau: "Canal d'irrigation", sol: "Argileux", route: "1 km" },
  },
  {
    id: "a12", reference: "DK-3RE8WS", titre: "Immeuble R+3 de rapport à Pikine", communeNom: "Pikine", dLat: 0.002, dLng: -0.003,
    description: "Immeuble de 8 appartements tous loués, rendement brut d'environ 9 %. Titre foncier individuel, gestion locative transférable.",
    prix_xof: 165_000_000, negociable: true, superficie_m2: 250, type_transaction: "vente", statut_juridique: "titre_foncier",
    verifiee: false, a_la_une: false, quartier: "Pikine Icotaf", categorie: "maison", publiee_le: "2026-11-06T09:00:00Z",
    caracteristiques: { pieces: 24, etat: "Bon", parking: "Non" },
  },
];

export const ANNONCES_DEMO: Annonce[] = base.map(({ communeNom, dLat, dLng, ...a }, i) => {
  const co = c(communeNom);
  return {
    ...a,
    commune: co.nom,
    departement: co.departement,
    region: co.region,
    lat: co.lat + dLat,
    lng: co.lng + dLng,
    vues: 40 + ((i * 37) % 300),
    vendeur_id: "demo",
    statut: "publiee",
    photos: [],
    categorie_libelle: LIBELLE[a.categorie],
  };
});
