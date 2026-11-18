"use client";
import { useCallback, useEffect, useState } from "react";
import { BadgeVerifie, VisuelAnnonce } from "./AnnonceCard";
import { IconeCamera } from "./Icones";
import { LIBELLES_TRANSACTION } from "@/lib/format";
import type { Annonce } from "@/lib/types";

export function Galerie({ a }: { a: Annonce }) {
  const total = Math.max(a.photos?.length ?? 0, 5);
  const [ouvert, setOuvert] = useState<number | null>(null);

  const suivant = useCallback(() => setOuvert((i) => (i === null ? i : (i + 1) % total)), [total]);
  const precedent = useCallback(() => setOuvert((i) => (i === null ? i : (i - 1 + total) % total)), [total]);

  useEffect(() => {
    if (ouvert === null) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(null);
      if (e.key === "ArrowRight") suivant();
      if (e.key === "ArrowLeft") precedent();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", touche);
    return () => { window.removeEventListener("keydown", touche); document.body.style.overflow = ""; };
  }, [ouvert, suivant, precedent]);

  return (
    <>
      <div className="relative grid h-[300px] gap-2 overflow-hidden rounded-[var(--radius-dk)] sm:h-[420px] md:grid-cols-4 md:grid-rows-2 lg:h-[480px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setOuvert(i)}
            className={`group relative overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : "hidden md:block"}`}
            aria-label={`Voir l'image ${i + 1}`}
          >
            <VisuelAnnonce a={a} index={i} className="transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-dk/0 transition group-hover:bg-dk/10" />
          </button>
        ))}
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-dk px-3 py-1 text-xs font-semibold text-blanc ring-1 ring-blanc/40">{LIBELLES_TRANSACTION[a.type_transaction]}</span>
          {a.verifiee && <BadgeVerifie />}
        </div>
        <button onClick={() => setOuvert(0)} className="btn-blanc absolute bottom-4 right-4 py-2 text-sm shadow-lg">
          <IconeCamera className="size-4" /> Voir les {total} visuels
        </button>
      </div>

      {ouvert !== null && (
        <div className="apparition fixed inset-0 z-[3000] flex flex-col bg-dk text-blanc" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between p-4">
            <p className="font-medium">{ouvert + 1} / {total}</p>
            <p className="hidden truncate px-4 font-semibold sm:block">{a.titre}</p>
            <button onClick={() => setOuvert(null)} className="flex size-11 items-center justify-center rounded-full border border-blanc/30 text-2xl" aria-label="Fermer">×</button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <div className="aspect-[16/10] max-h-full w-full max-w-6xl overflow-hidden rounded-2xl">
              <VisuelAnnonce a={a} index={ouvert} />
            </div>
            <button onClick={precedent} className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-blanc text-2xl text-dk sm:left-4" aria-label="Précédente">‹</button>
            <button onClick={suivant} className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-blanc text-2xl text-dk sm:right-4" aria-label="Suivante">›</button>
          </div>
          <div className="defilement flex justify-center gap-2 overflow-x-auto p-4">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => setOuvert(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg transition ${i === ouvert ? "ring-2 ring-blanc" : "opacity-50 hover:opacity-100"}`}>
                <VisuelAnnonce a={a} index={i} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
