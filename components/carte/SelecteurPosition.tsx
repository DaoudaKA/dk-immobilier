"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

const icone = L.divIcon({
  className: "sans-fond",
  html: `<svg width="34" height="44" viewBox="0 0 34 44" style="transform:translate(-50%,-100%)"><path d="M17 43S2 28.5 2 17a15 15 0 0 1 30 0c0 11.5-15 26-15 26Z" fill="#0B3C8C" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="17" r="5.5" fill="#fff"/></svg>`,
  iconSize: [0, 0],
});

function Clic({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) });
  return null;
}

function Recentrer({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 13));
  }, [map, lat, lng]);
  return null;
}

export default function SelecteurPosition({
  lat, lng, onChange,
}: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  return (
    <div className="carte-dk relative h-80 overflow-hidden rounded-[var(--radius-dk)] border border-dk/15">
      <MapContainer center={[lat, lng]} zoom={13} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Clic onChange={onChange} />
        <Recentrer lat={lat} lng={lng} />
        <Marker
          position={[lat, lng]}
          icon={icone}
          draggable
          eventHandlers={{ dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onChange(p.lat, p.lng); } }}
        />
      </MapContainer>
      <div className="teinte" />
      <p className="absolute bottom-3 left-3 z-[400] rounded-full bg-blanc px-3 py-1.5 text-xs font-medium text-dk shadow">
        Cliquez sur la carte ou déplacez le repère
      </p>
    </div>
  );
}
