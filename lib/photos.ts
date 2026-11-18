import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Renvoie l'URL d'une photo déposée dans public/photos, ou null si absente. */
export function photo(nom: string): string | null {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (existsSync(join(process.cwd(), "public", "photos", `${nom}.${ext}`))) return `/photos/${nom}.${ext}`;
  }
  return null;
}
