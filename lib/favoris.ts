"use client";
import { useCallback, useSyncExternalStore } from "react";

// Favoris et recherches enregistrés dans le navigateur (fonctionne sans compte).
// Quand Supabase est actif, ils sont aussi synchronisés dans la table « favoris ».
const CLE = "dk-favoris";
const EVT = "dk-favoris-maj";

function lire(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CLE) ?? "[]");
  } catch {
    return [];
  }
}

let cache: string[] | null = null;
let brut = "";

function instantane(): string[] {
  let actuel = "[]";
  try { actuel = localStorage.getItem(CLE) ?? "[]"; } catch {}
  if (cache === null || actuel !== brut) {
    brut = actuel;
    cache = lire();
  }
  return cache;
}

const VIDE: string[] = [];

function abonner(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useFavoris() {
  const favoris = useSyncExternalStore(abonner, instantane, () => VIDE);
  const basculer = useCallback((id: string) => {
    const liste = lire();
    const nouvelle = liste.includes(id) ? liste.filter((x) => x !== id) : [id, ...liste];
    try { localStorage.setItem(CLE, JSON.stringify(nouvelle)); } catch {}
    window.dispatchEvent(new Event(EVT));
    return nouvelle.includes(id);
  }, []);
  return { favoris, basculer, estFavori: (id: string) => favoris.includes(id) };
}

export type RechercheEnregistree = { nom: string; url: string; date: string };
const CLE_R = "dk-recherches";

export function enregistrerRecherche(r: RechercheEnregistree) {
  try {
    const l: RechercheEnregistree[] = JSON.parse(localStorage.getItem(CLE_R) ?? "[]");
    localStorage.setItem(CLE_R, JSON.stringify([r, ...l.filter((x) => x.url !== r.url)].slice(0, 10)));
  } catch {}
}

export function lireRecherches(): RechercheEnregistree[] {
  try {
    return JSON.parse(localStorage.getItem(CLE_R) ?? "[]");
  } catch {
    return [];
  }
}
