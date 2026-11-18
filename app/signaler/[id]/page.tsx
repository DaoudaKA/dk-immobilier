import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnnonce } from "@/lib/data";
import { supabaseActif } from "@/lib/supabase/config";
import { creerClientServeur } from "@/lib/supabase/server";

const MOTIFS = ["Double vente ou bien déjà vendu", "Faux documents", "Prix ou photos trompeurs", "Le vendeur demande un paiement avant visite", "Autre"];

async function signaler(formData: FormData) {
  "use server";
  const id = String(formData.get("annonce_id"));
  if (supabaseActif) {
    const supabase = await creerClientServeur();
    const { data } = await supabase.auth.getUser();
    await supabase.from("signalements").insert({
      annonce_id: id,
      auteur_id: data.user?.id ?? null,
      motif: String(formData.get("motif")),
      details: String(formData.get("details") ?? ""),
    });
  }
  redirect(`/signaler/${id}?envoye=1`);
}

export default async function PageSignaler({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ envoye?: string }> }) {
  const { id } = await params;
  const { envoye } = await searchParams;
  const a = await getAnnonce(id);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Signaler une annonce</h1>
      {a && <p className="mt-2 text-dk/60">{a.titre} · {a.reference}</p>}
      {envoye ? (
        <div className="mt-8 rounded-[var(--radius-dk)] bg-dk p-6 text-blanc">
          <p className="font-semibold">Merci, votre signalement a été transmis à l&apos;équipe de modération.</p>
          <Link href="/annonces" className="btn-blanc mt-5">Retour aux annonces</Link>
        </div>
      ) : (
        <form action={signaler} className="mt-8 space-y-4">
          <input type="hidden" name="annonce_id" value={id} />
          <fieldset className="space-y-2">
            <legend className="etiquette">Motif</legend>
            {MOTIFS.map((m, i) => (
              <label key={m} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dk/15 px-4 py-3 has-[:checked]:border-dk">
                <input type="radio" name="motif" value={m} defaultChecked={i === 0} className="accent-[#0B3C8C]" /> {m}
              </label>
            ))}
          </fieldset>
          <div>
            <label className="etiquette" htmlFor="details">Détails (facultatif)</label>
            <textarea id="details" name="details" rows={4} className="champ" />
          </div>
          <button className="btn-plein w-full">Envoyer le signalement</button>
        </form>
      )}
    </div>
  );
}
