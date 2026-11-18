"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnnonceCard } from "./AnnonceCard";
import { IconeCoeur, IconeRecherche } from "./Icones";
import { lireRecherches, useFavoris, type RechercheEnregistree } from "@/lib/favoris";
import { formatDate } from "@/lib/format";
import type { Annonce } from "@/lib/types";

export function ListeFavoris({ annonces }: { annonces: Annonce[] }) {
  const { favoris } = useFavoris();
  const [recherches, setRecherches] = useState<RechercheEnregistree[]>([]);
  useEffect(() => setRecherches(lireRecherches()), []);
  const liste = annonces.filter((a) => favoris.includes(a.id));

  return (
    <div className="mt-10 grid gap-12">
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold"><IconeCoeur /> Annonces enregistrées ({liste.length})</h2>
        {liste.length === 0 ? (
          <div className="plan-grid mt-4 rounded-[var(--radius-dk)] border border-dashed border-dk/25 p-12 text-center">
            <p className="font-semibold">Aucune annonce enregistrée pour l&apos;instant.</p>
            <p className="mt-1 text-dk/60">Touchez le cœur sur une annonce pour la retrouver ici.</p>
            <Link href="/annonces" className="btn-plein mt-5">Parcourir les annonces</Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {liste.map((a) => <AnnonceCard key={a.id} a={a} />)}
          </div>
        )}
      </section>
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold"><IconeRecherche /> Recherches enregistrées</h2>
        {recherches.length === 0 ? (
          <p className="mt-3 text-dk/60">Utilisez « Enregistrer la recherche » sur la page des annonces pour la retrouver ici.</p>
        ) : (
          <ul className="mt-4 divide-y divide-dk/10 rounded-[var(--radius-dk)] border border-dk/12">
            {recherches.map((r) => (
              <li key={r.url}>
                <Link href={r.url} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-dk/[0.03]">
                  <span className="font-medium">{r.nom}</span>
                  <span className="shrink-0 text-sm text-dk/55">{formatDate(r.date)} ›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
