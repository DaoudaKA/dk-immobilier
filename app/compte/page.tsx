import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IconeCalendrier, IconeCoeur, IconeMessage, IconePlus } from "@/components/Icones";
import { getUtilisateur } from "@/lib/data";
import { ANNONCES_DEMO } from "@/lib/demo-data";
import { formatPrix } from "@/lib/format";
import { supabaseActif } from "@/lib/supabase/config";
import { creerClientServeur } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mon compte" };

type Ligne = { id: string; titre: string; statut: string; prix_xof: number; verifiee: boolean; vues: number; motif_refus?: string | null };

const STATUTS: Record<string, string> = {
  brouillon: "Brouillon", en_attente: "En modération", publiee: "Publiée", en_pause: "En pause", vendue: "Vendue / louée", refusee: "Refusée",
};

async function changerStatut(formData: FormData) {
  "use server";
  const supabase = await creerClientServeur();
  await supabase.from("annonces").update({ statut: String(formData.get("statut")) }).eq("id", String(formData.get("id")));
  revalidatePath("/compte");
}

export default async function PageCompte() {
  let nom = "Compte de démonstration";
  let lignes: Ligne[] = ANNONCES_DEMO.slice(0, 3).map((a, i) => ({ ...a, statut: ["publiee", "en_attente", "brouillon"][i] }));
  let compteurs = { favoris: 4, messages: 2, visites: 1 };
  let kyc = "valide";

  if (supabaseActif) {
    const session = await getUtilisateur();
    if (!session) redirect("/connexion?suite=/compte");
    const supabase = await creerClientServeur();
    nom = session.profil?.nom_complet || session.user.phone || session.user.email || "Mon compte";
    kyc = session.profil?.statut_kyc ?? "non_soumis";
    const uid = session.user.id;
    const [{ data }, f, m, v] = await Promise.all([
      supabase.from("annonces").select("id, titre, statut, prix_xof, verifiee, vues, motif_refus").eq("vendeur_id", uid).order("cree_le", { ascending: false }),
      supabase.from("favoris").select("*", { count: "exact", head: true }).eq("utilisateur_id", uid),
      supabase.from("conversations").select("*", { count: "exact", head: true }).or(`acheteur_id.eq.${uid},vendeur_id.eq.${uid}`),
      supabase.from("visites").select("*", { count: "exact", head: true }).eq("acheteur_id", uid),
    ]);
    lignes = (data ?? []) as Ligne[];
    compteurs = { favoris: f.count ?? 0, messages: m.count ?? 0, visites: v.count ?? 0 };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Mon espace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Bonjour, {nom}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/publier" className="btn-plein"><IconePlus className="size-4" /> Nouvelle annonce</Link>
          {supabaseActif && (
            <form action="/auth/deconnexion" method="post"><button className="btn-contour">Se déconnecter</button></form>
          )}
        </div>
      </div>

      {kyc !== "valide" && (
        <div className="mt-6 rounded-[var(--radius-dk)] border border-dk p-5">
          <p className="font-semibold">Vérifiez votre identité pour publier.</p>
          <p className="mt-1 text-sm text-dk/65">Envoyez une photo de votre CNI ou passeport et un selfie. Statut actuel : {kyc.replace("_", " ")}.</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [IconeCoeur, "Favoris", compteurs.favoris],
          [IconeMessage, "Conversations", compteurs.messages],
          [IconeCalendrier, "Visites demandées", compteurs.visites],
        ].map(([I, l, n]) => {
          const Icone = I as typeof IconeCoeur;
          return (
            <div key={String(l)} className="flex items-center gap-4 rounded-[var(--radius-dk)] border border-dk/12 p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-dk text-blanc"><Icone /></span>
              <div>
                <p className="text-2xl font-bold">{String(n)}</p>
                <p className="text-sm text-dk/60">{String(l)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 text-xl font-bold">Mes annonces</h2>
      {lignes.length === 0 ? (
        <div className="plan-grid mt-4 rounded-[var(--radius-dk)] border border-dashed border-dk/25 p-10 text-center">
          <p className="font-semibold">Vous n&apos;avez pas encore d&apos;annonce.</p>
          <Link href="/publier" className="btn-plein mt-4">Publier ma première annonce</Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-dk)] border border-dk/12">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-dk text-blanc">
              <tr>
                <th className="px-5 py-3 font-semibold">Annonce</th>
                <th className="px-5 py-3 font-semibold">Prix</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Vues</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dk/10">
              {lignes.map((l) => (
                <tr key={l.id}>
                  <td className="px-5 py-4">
                    <Link href={`/annonces/${l.id}`} className="font-medium hover:underline">{l.titre}</Link>
                    {l.verifiee && <span className="ml-2 rounded-full bg-dk px-2 py-0.5 text-[11px] font-semibold text-blanc">Vérifiée</span>}
                    {l.motif_refus && <p className="mt-1 text-xs text-dk/60">Motif du refus : {l.motif_refus}</p>}
                  </td>
                  <td className="px-5 py-4">{formatPrix(l.prix_xof)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${l.statut === "publiee" ? "bg-dk text-blanc" : "border border-dk/25"}`}>{STATUTS[l.statut] ?? l.statut}</span>
                  </td>
                  <td className="px-5 py-4">{l.vues}</td>
                  <td className="px-5 py-4">
                    {supabaseActif ? (
                      <form action={changerStatut} className="flex gap-2">
                        <input type="hidden" name="id" value={l.id} />
                        {l.statut === "publiee" && <button name="statut" value="en_pause" className="underline">Mettre en pause</button>}
                        {l.statut === "en_pause" && <button name="statut" value="en_attente" className="underline">Republier</button>}
                        {l.statut === "brouillon" && <button name="statut" value="en_attente" className="underline">Envoyer en modération</button>}
                        {["publiee", "en_pause"].includes(l.statut) && <button name="statut" value="vendue" className="underline">Marquer vendue</button>}
                      </form>
                    ) : (
                      <span className="text-dk/45">Démo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
