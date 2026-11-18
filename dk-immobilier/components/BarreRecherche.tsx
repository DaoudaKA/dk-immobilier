import { IconeRecherche } from "./Icones";
import { REGIONS } from "@/lib/format";

export function BarreRecherche({ variante = "hero" }: { variante?: "hero" | "compacte" }) {
  const hero = variante === "hero";
  return (
    <form
      action="/annonces"
      className={`grid gap-2 rounded-[1.6rem] bg-blanc p-2 text-dk ${hero ? "shadow-[0_30px_60px_-25px_rgb(0_0_0/.45)] md:grid-cols-[1.4fr_1fr_1fr_auto]" : "border border-dk/15 md:grid-cols-[1.4fr_1fr_1fr_auto]"}`}
    >
      <label className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-dk/5">
        <IconeRecherche className="size-5 shrink-0 text-dk/60" />
        <span className="flex w-full flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">Où ?</span>
          <input name="q" placeholder="Commune, quartier, mot-clé…" className="w-full bg-transparent font-medium outline-none placeholder:text-dk/40" />
        </span>
      </label>
      <label className="flex flex-col rounded-2xl px-4 py-3 hover:bg-dk/5 md:border-l md:border-dk/10">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">Type de bien</span>
        <select name="categorie" className="bg-transparent font-medium outline-none" defaultValue="">
          <option value="">Tous les biens</option>
          <option value="terrain">Terrain</option>
          <option value="champ">Champ / terre agricole</option>
          <option value="maison">Maison / villa</option>
          <option value="appartement">Appartement</option>
          <option value="local">Local professionnel</option>
        </select>
      </label>
      <label className="flex flex-col rounded-2xl px-4 py-3 hover:bg-dk/5 md:border-l md:border-dk/10">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-dk/50">Région</span>
        <select name="region" className="bg-transparent font-medium outline-none" defaultValue="">
          <option value="">Tout le Sénégal</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <button className="btn-plein h-full min-h-14 rounded-2xl px-7 text-base">
        <IconeRecherche />
        Rechercher
      </button>
    </form>
  );
}
