"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { formatPrix, formatPrixCourt, formatSurface } from "@/lib/format";
import type { Annonce } from "@/lib/types";

function Cadrer({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 13);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function CarteAnnonces({ annonces, hauteur = "100%" }: { annonces: Annonce[]; hauteur?: string }) {
  const points = useMemo(() => annonces.map((a) => [a.lat, a.lng] as [number, number]), [annonces]);

  return (
    <div className="carte-dk relative h-full overflow-hidden rounded-[var(--radius-dk)] border border-dk/15" style={{ height: hauteur }}>
      <MapContainer center={[14.75, -17.2]} zoom={8} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Cadrer points={points} />
        {annonces.map((a) => (
          <Marker
            key={a.id}
            position={[a.lat, a.lng]}
            icon={L.divIcon({
              className: "sans-fond",
              html: `<span class="marqueur-prix${a.verifiee ? "" : " actif"}">${formatPrixCourt(a.prix_xof)}</span>`,
              iconSize: [0, 0],
            })}
          >
            <Popup>
              <div className="min-w-48">
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
