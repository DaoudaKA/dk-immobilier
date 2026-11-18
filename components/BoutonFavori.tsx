"use client";
import { IconeCoeur } from "./Icones";
import { useFavoris } from "@/lib/favoris";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseActif } from "@/lib/supabase/config";

export function BoutonFavori({ id, variante = "rond" }: { id: string; variante?: "rond" | "large" }) {
  const { estFavori, basculer } = useFavoris();
  const actif = estFavori(id);

  async function clic(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ajoute = basculer(id);
    if (!supabaseActif) return;
    const supabase = creerClientNavigateur();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    if (ajoute) await supabase.from("favoris").upsert({ utilisateur_id: data.user.id, annonce_id: id });
    else await supabase.from("favoris").delete().match({ utilisateur_id: data.user.id, annonce_id: id });
  }

  if (variante === "large") {
    return (
      <button type="button" onClick={clic} aria-pressed={actif} className={`btn ${actif ? "bg-dk text-blanc" : "border border-dk/20 hover:border-dk"}`}>
        <IconeCoeur className={`size-4 ${actif ? "fill-current" : ""}`} />
        {actif ? "Enregistré" : "Enregistrer"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={clic}
      aria-pressed={actif}
      aria-label={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex size-9 items-center justify-center rounded-full shadow-md transition hover:scale-110 ${actif ? "bg-dk text-blanc ring-2 ring-blanc" : "bg-blanc text-dk"}`}
    >
      <IconeCoeur className={`size-[18px] ${actif ? "fill-current" : ""}`} />
    </button>
  );
}
