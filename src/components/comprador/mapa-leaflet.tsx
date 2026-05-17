"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const COCHA = { lat: -17.3895, lng: -66.1568 };

const storeIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#007a4d;border:2px solid white;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.25)">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

type TiendaPin = {
  id: string;
  nombreTienda: string;
  lat: number;
  lng: number;
  zonaBarrio: string;
};

function FixIcon() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export function MapaLeaflet({
  tiendas,
  onSelect,
}: {
  tiendas: TiendaPin[];
  onSelect?: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[COCHA.lat, COCHA.lng]}
      zoom={14}
      className="h-full w-full rounded-none"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FixIcon />
      {tiendas.map((t) => (
        <Marker
          key={t.id}
          position={[t.lat, t.lng]}
          icon={storeIcon}
          eventHandlers={{
            click: () => onSelect?.(t.id),
          }}
        >
          <Popup>
            <strong>{t.nombreTienda}</strong>
            <br />
            {t.zonaBarrio}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
