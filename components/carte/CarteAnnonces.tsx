"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { formatPrix, formatPrixCourt, formatSurface } from "@/lib/format";
import type { Annonce } from "@/lib/types";

function Cadrer({ points, cle }: { points: [number, number][]; cle: string }) {
  const map = useMap();
  const derniere = useRef("");
  useEffect(() => {
    if (cle === derniere.current) return;
    derniere.current = cle;
    if (points.length === 1) map.setView(points[0], 13);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 13 });
  }, [map, points, cle]);
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export default function CarteAnnonces({
  annonces, survolId, onSurvol, zoomUnique = 13,
}: { annonces: Annonce[]; survolId?: string | null; onSurvol?: (id: string | null) => void; zoomUnique?: number }) {
  const points = useMemo(() => annonces.map((a) => [a.lat, a.lng] as [number, number]), [annonces]);
  const cle = annonces.map((a) => a.id).join(",");

  return (
    <div className="carte-dk relative h-full overflow-hidden rounded-[var(--radius-dk)] border border-dk/15">
      <MapContainer center={[14.75, -17.2]} zoom={annonces.length === 1 ? zoomUnique : 8} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Cadrer points={points} cle={cle} />
        {annonces.map((a) => (
          <Marker
            key={a.id}
            position={[a.lat, a.lng]}
            zIndexOffset={survolId === a.id ? 1000 : 0}
            eventHandlers={{ mouseover: () => onSurvol?.(a.id), mouseout: () => onSurvol?.(null) }}
            icon={L.divIcon({
              className: "sans-fond",
              html: `<span class="marqueur-prix${survolId === a.id ? " survol" : ""}">${a.verifiee ? "✓ " : ""}${formatPrixCourt(a.prix_xof)}</span>`,
              iconSize: [0, 0],
            })}
          >
            <Popup>
              <div className="min-w-52">
                <p className="text-base font-bold">{formatPrix(a.prix_xof)}</p>
                <p className="mt-1 font-medium">{a.titre}</p>
                <p className="mt-1 text-xs opacity-70">{a.commune} · {formatSurface(a.superficie_m2)}{a.verifiee ? " · Bien vérifié" : ""}</p>
                <Link href={`/annonces/${a.id}`} className="mt-2 inline-block font-semibold underline">Voir l&apos;annonce</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="teinte" />
    </div>
  );
}
