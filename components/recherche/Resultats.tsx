"use client";
import { useEffect, useState } from "react";
import { AnnonceCard } from "../AnnonceCard";
import { CarteAnnonces } from "../carte";
import { IconeCarte, IconeListe } from "../Icones";
import type { Annonce } from "@/lib/types";

const PAR_PAGE = 12;

export function Resultats({ annonces, enCours, carteVisible }: { annonces: Annonce[]; enCours: boolean; carteVisible: boolean }) {
  const [survol, setSurvol] = useState<string | null>(null);
  const [vueMobile, setVueMobile] = useState<"liste" | "carte">("liste");
  const [limite, setLimite] = useState(PAR_PAGE);

  const [bureau, setBureau] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const maj = () => setBureau(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  useEffect(() => setLimite(PAR_PAGE), [annonces]);
  const affichees = annonces.slice(0, limite);

  return (
    <div className={`transition-opacity duration-200 ${enCours ? "opacity-50" : ""}`}>
      <div className={`grid gap-6 ${carteVisible ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]" : ""}`}>
        <div className={vueMobile === "carte" ? "hidden lg:block" : ""}>
          <div className={`grid gap-5 sm:grid-cols-2 ${carteVisible ? "" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
            {affichees.map((a, i) => (
              <div
                key={a.id}
                onMouseEnter={() => setSurvol(a.id)}
                onMouseLeave={() => setSurvol(null)}
                className={`apparition rounded-[calc(var(--radius-dk)+3px)] transition ${survol === a.id ? "ring-2 ring-dk ring-offset-2" : ""}`}
                style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
              >
                <AnnonceCard a={a} />
              </div>
            ))}
          </div>
          {annonces.length > limite && (
            <div className="mt-8 text-center">
              <p className="text-sm text-dk/55">{limite} sur {annonces.length} annonces</p>
              <div className="mx-auto mt-2 h-1 max-w-xs overflow-hidden rounded-full bg-dk/10">
                <div className="h-full bg-dk" style={{ width: `${(limite / annonces.length) * 100}%` }} />
              </div>
              <button onClick={() => setLimite((l) => l + PAR_PAGE)} className="btn-contour mt-5">Afficher plus d&apos;annonces</button>
            </div>
          )}
        </div>

        {carteVisible && (
          <div className={`${vueMobile === "carte" ? "block" : "hidden"} h-[calc(100dvh-220px)] lg:sticky lg:top-[150px] lg:block lg:h-[calc(100dvh-170px)]`}>
            {(bureau || vueMobile === "carte") && <CarteAnnonces annonces={annonces} survolId={survol} onSurvol={setSurvol} />}
          </div>
        )}
      </div>

      {/* Bascule liste / carte sur mobile */}
      <button
        onClick={() => setVueMobile((v) => (v === "liste" ? "carte" : "liste"))}
        className="btn-plein fixed bottom-5 left-1/2 z-[900] -translate-x-1/2 px-6 shadow-[0_15px_35px_-10px_rgb(11_60_140/.7)] lg:hidden"
      >
        {vueMobile === "liste" ? <><IconeCarte className="size-4" /> Carte</> : <><IconeListe className="size-4" /> Liste</>}
      </button>
    </div>
  );
}
