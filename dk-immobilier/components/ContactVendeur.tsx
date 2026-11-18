"use client";
import Link from "next/link";
import { useState } from "react";
import { IconeCalendrier, IconeCoeur, IconeMessage, IconePartage, IconeTelephone } from "./Icones";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseActif } from "@/lib/supabase/config";

type Onglet = "message" | "visite";

export function ContactVendeur({ annonceId, vendeurId, titre }: { annonceId: string; vendeurId: string; titre: string }) {
  const [onglet, setOnglet] = useState<Onglet>("message");
  const [message, setMessage] = useState(`Bonjour, votre annonce « ${titre} » m'intéresse. Est-elle toujours disponible ?`);
  const [creneau, setCreneau] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "connexion" | "erreur">("repos");
  const [favori, setFavori] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    if (!supabaseActif) {
      await new Promise((r) => setTimeout(r, 600));
      setEtat("ok");
      return;
    }
    const supabase = creerClientNavigateur();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setEtat("connexion");
    try {
      if (onglet === "message") {
        const { data: conv } = await supabase
          .from("conversations")
          .upsert({ annonce_id: annonceId, acheteur_id: u.user.id, vendeur_id: vendeurId }, { onConflict: "annonce_id,acheteur_id" })
          .select("id")
          .single();
        if (!conv) throw new Error();
        const { error } = await supabase.from("messages").insert({ conversation_id: conv.id, auteur_id: u.user.id, contenu: message });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("visites").insert({ annonce_id: annonceId, acheteur_id: u.user.id, creneau: new Date(creneau).toISOString(), message });
        if (error) throw error;
      }
      setEtat("ok");
    } catch {
      setEtat("erreur");
    }
  }

  async function basculerFavori() {
    setFavori((f) => !f);
    if (!supabaseActif) return;
    const supabase = creerClientNavigateur();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (!favori) await supabase.from("favoris").insert({ utilisateur_id: u.user.id, annonce_id: annonceId });
    else await supabase.from("favoris").delete().match({ utilisateur_id: u.user.id, annonce_id: annonceId });
  }

  function partager() {
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${titre} — ${url}`)}`, "_blank", "noopener");
  }

  return (
    <div className="rounded-[var(--radius-dk)] border border-dk/15 p-5">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-dk/15 p-1 text-sm font-semibold">
        {(["message", "visite"] as Onglet[]).map((o) => (
          <button key={o} type="button" onClick={() => { setOnglet(o); setEtat("repos"); }} className={`rounded-full py-2 transition ${onglet === o ? "bg-dk text-blanc" : "text-dk/70"}`}>
            {o === "message" ? "Envoyer un message" : "Demander une visite"}
          </button>
        ))}
      </div>

      {etat === "ok" ? (
        <div className="mt-5 rounded-2xl bg-dk p-5 text-blanc">
          <p className="font-semibold">{onglet === "message" ? "Message envoyé." : "Demande de visite envoyée."}</p>
          <p className="mt-1 text-sm text-blanc/80">Le vendeur vous répondra dans votre messagerie DK IMMOBILIER.</p>
        </div>
      ) : (
        <form onSubmit={envoyer} className="mt-5 space-y-3">
          {onglet === "visite" && (
            <div>
              <label className="etiquette" htmlFor="creneau">Date et heure souhaitées</label>
              <input id="creneau" type="datetime-local" required value={creneau} onChange={(e) => setCreneau(e.target.value)} className="champ" />
            </div>
          )}
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required className="champ resize-none" />
          {etat === "connexion" && (
            <p className="text-sm">Connectez-vous pour contacter le vendeur. <Link href="/connexion" className="font-semibold underline">Se connecter</Link></p>
          )}
          {etat === "erreur" && <p className="text-sm font-medium">L&apos;envoi a échoué, réessayez dans un instant.</p>}
          <button disabled={etat === "envoi"} className="btn-plein w-full">
            {onglet === "message" ? <IconeMessage className="size-4" /> : <IconeCalendrier className="size-4" />}
            {etat === "envoi" ? "Envoi…" : onglet === "message" ? "Envoyer" : "Proposer ce créneau"}
          </button>
        </form>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={basculerFavori} className={`btn-contour px-2 ${favori ? "border-dk bg-dk text-blanc" : ""}`} aria-pressed={favori}>
          <IconeCoeur className="size-4" /> <span className="text-xs">{favori ? "Enregistré" : "Favori"}</span>
        </button>
        <button type="button" onClick={partager} className="btn-contour px-2"><IconePartage className="size-4" /> <span className="text-xs">Partager</span></button>
        <Link href={supabaseActif ? "/connexion" : "#"} className="btn-contour px-2"><IconeTelephone className="size-4" /> <span className="text-xs">Appeler</span></Link>
      </div>
      <p className="mt-3 text-center text-xs text-dk/55">Le numéro du vendeur s&apos;affiche une fois connecté.</p>
    </div>
  );
}
