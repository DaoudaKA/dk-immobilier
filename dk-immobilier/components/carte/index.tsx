"use client";
import dynamic from "next/dynamic";

const chargement = () => <div className="plan-grid h-full min-h-80 animate-pulse rounded-[var(--radius-dk)] border border-dk/15" />;

// Leaflet a besoin du navigateur : chargement côté client uniquement.
export const CarteAnnonces = dynamic(() => import("./CarteAnnonces"), { ssr: false, loading: chargement });
export const SelecteurPosition = dynamic(() => import("./SelecteurPosition"), { ssr: false, loading: chargement });
