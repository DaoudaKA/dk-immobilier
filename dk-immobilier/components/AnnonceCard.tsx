import Link from "next/link";
import { IllustrationBien } from "./IllustrationBien";
import { IconeBouclier, IconePin, IconeSurface } from "./Icones";
import { formatPrix, formatSurface, LIBELLES_JURIDIQUE, LIBELLES_TRANSACTION } from "@/lib/format";
import { urlPhoto } from "@/lib/supabase/config";
import type { Annonce } from "@/lib/types";

export function BadgeVerifie({ petit = false }: { petit?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-blanc font-semibold text-dk ring-1 ring-dk/15 ${petit ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}`}>
      <IconeBouclier className={petit ? "size-3.5" : "size-4"} />
      Bien vérifié
    </span>
  );
}

export function AnnonceCard({ a }: { a: Annonce }) {
  const photo = a.photos?.[0];
  const suffixe = a.type_transaction === "location" ? " / mois" : a.type_transaction === "bail" ? " / an" : "";
  return (
    <Link
      href={`/annonces/${a.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-dk)] border border-dk/12 bg-blanc transition hover:-translate-y-0.5 hover:border-dk/40 hover:shadow-[0_18px_40px_-18px_rgb(11_60_140/.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={urlPhoto(photo)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <IllustrationBien categorie={a.categorie} graine={a.id} className="transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-dk px-2.5 py-1 text-[11px] font-semibold text-blanc ring-1 ring-blanc/40">
            {LIBELLES_TRANSACTION[a.type_transaction]}
          </span>
          {a.a_la_une && (
            <span className="rounded-full bg-blanc px-2.5 py-1 text-[11px] font-semibold text-dk">À la une</span>
          )}
        </div>
        {a.verifiee && (
          <div className="absolute bottom-3 left-3">
            <BadgeVerifie petit />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-bold tracking-tight">
          {formatPrix(a.prix_xof)}
          <span className="text-sm font-medium text-dk/60">{suffixe}</span>
        </p>
        <h3 className="line-clamp-2 font-medium leading-snug text-dk/90">{a.titre}</h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-dk/65">
          <span className="inline-flex items-center gap-1"><IconePin className="size-4" />{a.commune}</span>
          <span className="inline-flex items-center gap-1"><IconeSurface className="size-4" />{formatSurface(a.superficie_m2)}</span>
        </div>
        <div className="border-t border-dashed border-dk/15 pt-2 text-xs text-dk/55">{LIBELLES_JURIDIQUE[a.statut_juridique]} · {a.reference}</div>
      </div>
    </Link>
  );
}
