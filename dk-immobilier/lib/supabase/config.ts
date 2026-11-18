export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Vrai quand les clés Supabase sont renseignées ; sinon l'app tourne en mode démo. */
export const supabaseActif = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function urlPhoto(chemin: string): string {
  if (chemin.startsWith("http")) return chemin;
  return `${SUPABASE_URL}/storage/v1/object/public/annonces/${chemin}`;
}
