import Link from "next/link";
import { BoutonFavori } from "./BoutonFavori";
import { IllustrationBien } from "./IllustrationBien";
import { IconeBouclier, IconeDocument, IconePin, IconeSurface } from "./Icones";
import { sceneDeRegion, type TypeScene } from "./Scene";

const SCENES: TypeScene[] = ["niayes", "cote", "ville", "fleuve", "savane", "casamance"];
import { Visuel } from "./Visuel";
import { formatPrix, formatSurface, LIBELLES_JURIDIQUE, LIBELLES_TRANSACTION, prixAuM2 } from "@/lib/format";
import { urlPhoto } from "@/lib/supabase/config";
import type { Annonce } from "@/lib/types";

export function BadgeVerifie({ petit = false }: { petit?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-blanc font-semibold text-dk shadow-sm ring-1 ring-dk/15 ${petit ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}`}>
      <IconeBouclier className={petit ? "size-3.5" : "size-4"} />
      Bien vérifié
    </span>
  );
}

export function suffixePrix(a: Pick<Annonce, "type_transaction">) {
  return a.type_transaction === "location" ? " / mois" : a.type_transaction === "bail" ? " / an" : "";
}

export function graineDe(id: string) {
  return [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
}

export function VisuelAnnonce({ a, index = 0, className = "" }: { a: Annonce; index?: number; className?: string }) {
  const p = a.photos?.[index];
  if (p) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={urlPhoto(p)} alt="" className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const principale = sceneDeRegion(a.region, a.categorie);
  if (index === 1) return <IllustrationBien categorie={a.categorie} graine={a.id + index} className={className} />;
  if (index === 3) return <IllustrationBien categorie={a.categorie === "terrain" ? "champ" : "terrain"} graine={a.id + index} className={className} />;
  if (index === 2) {
    const autres = SCENES.filter((x) => x !== principale);
    return <Visuel scene={autres[graineDe(a.id) % autres.length]} graine={graineDe(a.id) + 2} className={className} />;
  }
  return <Visuel scene={principale} graine={graineDe(a.id) + index} className={className} />;
}

function estNouveau(iso: string | null) {
  return iso ? Date.now() - new Date(iso).getTime() < 4 * 864e5 : false;
}

export function AnnonceCard({ a, compacte = false }: { a: Annonce; compacte?: boolean }) {
  const chambres = a.caracteristiques?.chambres;
  return (
    <Link
      href={`/annonces/${a.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-dk)] border border-dk/12 bg-blanc transition duration-300 hover:-translate-y-0.5 hover:border-dk/30 hover:shadow-[0_22px_44px_-22px_rgb(11_60_140/.5)]"
    >
      <div className={`relative overflow-hidden ${compacte ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <VisuelAnnonce a={a} className="transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-dk px-2.5 py-1 text-[11px] font-semibold text-blanc ring-1 ring-blanc/40">{LIBELLES_TRANSACTION[a.type_transaction]}</span>
            {a.a_la_une && <span className="rounded-full bg-blanc px-2.5 py-1 text-[11px] font-semibold text-dk shadow-sm">À la une</span>}
            {estNouveau(a.publiee_le) && <span className="rounded-full bg-blanc px-2.5 py-1 text-[11px] font-semibold text-dk shadow-sm">Nouveau</span>}
          </div>
          <BoutonFavori id={a.id} />
        </div>
        {a.verifiee && <div className="absolute bottom-3 left-3"><BadgeVerifie petit /></div>}
        <span className="absolute bottom-3 right-3 rounded-full bg-dk/80 px-2 py-0.5 text-[11px] font-medium text-blanc backdrop-blur">{a.categorie_libelle}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-[19px] font-bold tracking-tight">
            {formatPrix(a.prix_xof)}
            <span className="text-sm font-medium text-dk/55">{suffixePrix(a)}</span>
          </p>
          {a.type_transaction === "vente" && <p className="shrink-0 text-xs text-dk/50">{prixAuM2(a.prix_xof, a.superficie_m2)}</p>}
        </div>
        <h3 className="mt-1 line-clamp-2 font-medium leading-snug text-dk/85">{a.titre}</h3>
        <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-dk/60"><IconePin className="size-4 shrink-0" /><span className="truncate">{a.quartier ? `${a.quartier}, ` : ""}{a.commune}</span></p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-dk/15 pt-3 text-[13px] text-dk/70">
          <span className="inline-flex items-center gap-1"><IconeSurface className="size-4" />{formatSurface(a.superficie_m2)}</span>
          <span className="inline-flex items-center gap-1"><IconeDocument className="size-4" />{LIBELLES_JURIDIQUE[a.statut_juridique]}</span>
          {chambres ? <span>{String(chambres)} ch.</span> : null}
        </div>
      </div>
    </Link>
  );
}
