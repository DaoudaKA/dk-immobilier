"use client";
import { useState } from "react";
import { IconePartage } from "./Icones";

export function BoutonPartage({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: titre, url }); return; } catch { /* annulé */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${titre} — ${url}`)}`, "_blank", "noopener");
    }
  }

  return (
    <button type="button" onClick={partager} className="btn border border-dk/20 hover:border-dk">
      <IconePartage className="size-4" /> {copie ? "Lien copié" : "Partager"}
    </button>
  );
}
