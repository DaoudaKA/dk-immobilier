"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { supabaseActif } from "@/lib/supabase/config";

export function FormulaireConnexion({ suite }: { suite: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"telephone" | "email">("telephone");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");
  const [etape, setEtape] = useState<"saisie" | "code" | "lien">("saisie");
  const [charge, setCharge] = useState(false);
  const [message, setMessage] = useState("");

  const numero = "+221" + telephone.replace(/\D/g, "").replace(/^221/, "");

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!supabaseActif) {
      setMessage("Mode démonstration : configurez Supabase pour activer la connexion.");
      return;
    }
    setCharge(true);
    const supabase = creerClientNavigateur();
    if (mode === "telephone") {
      const { error } = await supabase.auth.signInWithOtp({ phone: numero, options: { data: { nom_complet: nom } } });
      setCharge(false);
      if (error) return setMessage(error.message);
      setEtape("code");
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { data: { nom_complet: nom }, emailRedirectTo: `${window.location.origin}/auth/callback?suite=${encodeURIComponent(suite)}` },
      });
      setCharge(false);
      if (error) return setMessage(error.message);
      setEtape("lien");
    }
  }

  async function verifier(e: React.FormEvent) {
    e.preventDefault();
    setCharge(true);
    const supabase = creerClientNavigateur();
    const { error } = await supabase.auth.verifyOtp({ phone: numero, token: code, type: "sms" });
    setCharge(false);
    if (error) return setMessage("Code incorrect ou expiré.");
    router.push(suite);
    router.refresh();
  }

  if (etape === "lien") {
    return (
      <div className="mt-8 rounded-[var(--radius-dk)] bg-dk p-6 text-blanc">
        <p className="font-semibold">Lien envoyé à {email}.</p>
        <p className="mt-1 text-sm text-blanc/80">Ouvrez l&apos;e-mail et cliquez sur le lien pour vous connecter.</p>
      </div>
    );
  }

  if (etape === "code") {
    return (
      <form onSubmit={verifier} className="mt-8 space-y-4">
        <p className="text-dk/70">Code envoyé au <strong>{numero}</strong>.</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          className="champ text-center text-2xl font-bold tracking-[0.6em]"
        />
        {message && <p className="text-sm font-medium">{message}</p>}
        <button disabled={charge || code.length < 6} className="btn-plein w-full">{charge ? "Vérification…" : "Valider le code"}</button>
        <button type="button" onClick={() => setEtape("saisie")} className="w-full text-sm underline">Changer de numéro</button>
      </form>
    );
  }

  return (
    <form onSubmit={envoyer} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-dk/15 p-1 text-sm font-semibold">
        {(["telephone", "email"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full py-2 ${mode === m ? "bg-dk text-blanc" : "text-dk/70"}`}>
            {m === "telephone" ? "Téléphone" : "E-mail"}
          </button>
        ))}
      </div>
      <div>
        <label className="etiquette" htmlFor="nom">Nom complet (nouvel utilisateur)</label>
        <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Awa Diop" className="champ" />
      </div>
      {mode === "telephone" ? (
        <div>
          <label className="etiquette" htmlFor="tel">Numéro de téléphone</label>
          <div className="flex">
            <span className="flex items-center rounded-l-xl border border-r-0 border-dk/20 bg-dk/5 px-4 font-semibold">+221</span>
            <input id="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)} inputMode="tel" placeholder="77 123 45 67" className="champ rounded-l-none" />
          </div>
        </div>
      ) : (
        <div>
          <label className="etiquette" htmlFor="email">Adresse e-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="champ" />
        </div>
      )}
      {message && <p className="text-sm font-medium">{message}</p>}
      <button disabled={charge} className="btn-plein w-full">{charge ? "Envoi…" : mode === "telephone" ? "Recevoir le code par SMS" : "Recevoir un lien de connexion"}</button>
      <p className="text-center text-xs text-dk/55">En continuant, vous acceptez les conditions d&apos;utilisation et la politique de confidentialité de DK IMMOBILIER.</p>
    </form>
  );
}
