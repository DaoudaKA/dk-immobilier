import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IconeBouclier, IconeDocument } from "@/components/Icones";
import { getUtilisateur } from "@/lib/data";
import { ANNONCES_DEMO } from "@/lib/demo-data";
import { formatDate, formatPrix, formatSurface, LIBELLES_JURIDIQUE } from "@/lib/format";
import { supabaseActif } from "@/lib/supabase/config";
import { creerClientServeur } from "@/lib/supabase/server";
import type { StatutJuridique } from "@/lib/types";

export const metadata: Metadata = { title: "Administration" };

type EnAttente = {
  id: string; reference: string; titre: string; prix_xof: number; superficie_m2: number;
  statut_juridique: StatutJuridique; cree_le: string; documents: { id: string; chemin: string }[];
};
type Signalement = { id: string; motif: string; details: string | null; cree_le: string; annonce_id: string };

async function moderer(formData: FormData) {
  "use server";
  const supabase = await creerClientServeur();
  const { data: u } = await supabase.auth.getUser();
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));
  const maj =
    decision === "verifier"
      ? { statut: "publiee", verifiee: true, verifiee_jusquau: new Date(Date.now() + 182 * 864e5).toISOString().slice(0, 10) }
      : decision === "publier"
        ? { statut: "publiee" }
        : { statut: "refusee", motif_refus: String(formData.get("motif") || "Annonce non conforme") };
  await supabase.from("annonces").update(maj).eq("id", id);
  if (u.user) {
    await supabase.from("verifications").insert({
      annonce_id: id, verificateur_id: u.user.id,
      decision: decision === "refuser" ? "refuse" : "valide",
      commentaire: String(formData.get("motif") ?? ""),
    });
  }
  revalidatePath("/admin");
}

async function traiterSignalement(formData: FormData) {
  "use server";
  const supabase = await creerClientServeur();
  await supabase.from("signalements").update({ statut: String(formData.get("statut")) }).eq("id", String(formData.get("id")));
  revalidatePath("/admin");
}

export default async function PageAdmin() {
  let attente: EnAttente[] = ANNONCES_DEMO.slice(4, 8).map((a) => ({ ...a, cree_le: a.publiee_le ?? "", documents: [{ id: "d", chemin: "titre.pdf" }] }));
  let signalements: Signalement[] = [{ id: "s1", motif: "Double vente ou bien déjà vendu", details: "Le même terrain est proposé par une autre personne.", cree_le: "2026-11-16", annonce_id: "a10" }];
  let stats = { publiees: 12, verifiees: 6, utilisateurs: 38 };

  if (supabaseActif) {
    const session = await getUtilisateur();
    if (!session) redirect("/connexion?suite=/admin");
    if (!["moderateur", "admin"].includes(session.profil?.role ?? "")) redirect("/");
    const supabase = await creerClientServeur();
    const [a, s, p, v, u] = await Promise.all([
      supabase.from("annonces").select("id, reference, titre, prix_xof, superficie_m2, statut_juridique, cree_le, documents(id, chemin)").eq("statut", "en_attente").order("cree_le"),
      supabase.from("signalements").select("id, motif, details, cree_le, annonce_id").in("statut", ["ouvert", "en_cours"]).order("cree_le"),
      supabase.from("annonces").select("*", { count: "exact", head: true }).eq("statut", "publiee"),
      supabase.from("annonces").select("*", { count: "exact", head: true }).eq("verifiee", true),
      supabase.from("profils").select("*", { count: "exact", head: true }),
    ]);
    attente = (a.data ?? []) as EnAttente[];
    signalements = (s.data ?? []) as Signalement[];
    stats = { publiees: p.count ?? 0, verifiees: v.count ?? 0, utilisateurs: u.count ?? 0 };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Back-office</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Modération et vérification</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          ["En attente", attente.length],
          ["Publiées", stats.publiees],
          ["Vérifiées", stats.verifiees],
          ["Utilisateurs", stats.utilisateurs],
        ].map(([l, n], i) => (
          <div key={String(l)} className={`rounded-[var(--radius-dk)] p-5 ${i === 0 ? "bg-dk text-blanc" : "border border-dk/12"}`}>
            <p className="text-3xl font-extrabold">{String(n)}</p>
            <p className={`text-sm ${i === 0 ? "text-blanc/75" : "text-dk/60"}`}>{String(l)}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">File de modération</h2>
      <div className="mt-4 space-y-3">
        {attente.length === 0 && <p className="text-dk/60">Aucune annonce en attente.</p>}
        {attente.map((a) => (
          <div key={a.id} className="grid gap-4 rounded-[var(--radius-dk)] border border-dk/12 p-5 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold text-dk/50">{a.reference} · reçue le {formatDate(a.cree_le)}</p>
              <Link href={`/annonces/${a.id}`} className="mt-1 block text-lg font-semibold hover:underline">{a.titre}</Link>
              <p className="mt-1 text-sm text-dk/65">{formatPrix(a.prix_xof)} · {formatSurface(a.superficie_m2)} · {LIBELLES_JURIDIQUE[a.statut_juridique]}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm">
                <IconeDocument className="size-4" /> {a.documents?.length ?? 0} document{(a.documents?.length ?? 0) > 1 ? "s" : ""} déposé{(a.documents?.length ?? 0) > 1 ? "s" : ""}
              </p>
            </div>
            <form action={moderer} className="flex flex-wrap items-center gap-2 self-center">
              <input type="hidden" name="id" value={a.id} />
              <input name="motif" placeholder="Motif ou commentaire" className="champ w-56 py-2" />
              <button name="decision" value="refuser" disabled={!supabaseActif} className="btn-contour py-2">Refuser</button>
              <button name="decision" value="publier" disabled={!supabaseActif} className="btn-contour py-2">Publier</button>
              <button name="decision" value="verifier" disabled={!supabaseActif} className="btn-plein py-2"><IconeBouclier className="size-4" /> Publier + badge</button>
            </form>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Signalements ouverts</h2>
      <div className="mt-4 space-y-3">
        {signalements.length === 0 && <p className="text-dk/60">Aucun signalement.</p>}
        {signalements.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-dk)] border border-dashed border-dk/30 p-5">
            <div>
              <p className="font-semibold">{s.motif}</p>
              <p className="text-sm text-dk/65">{s.details}</p>
              <Link href={`/annonces/${s.annonce_id}`} className="text-sm underline">Voir l&apos;annonce</Link>
            </div>
            <form action={traiterSignalement} className="flex gap-2">
              <input type="hidden" name="id" value={s.id} />
              <button name="statut" value="rejete" disabled={!supabaseActif} className="btn-contour py-2">Rejeter</button>
              <button name="statut" value="traite" disabled={!supabaseActif} className="btn-plein py-2">Marquer traité</button>
            </form>
          </div>
        ))}
      </div>
      {!supabaseActif && <p className="mt-8 text-sm text-dk/55">Mode démonstration : les actions sont désactivées.</p>}
    </div>
  );
}
