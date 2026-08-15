'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Startup } from '@/lib/data';
import styles from './StartupMap.module.css';

// Fix for Leaflet marker default icons in Next.js
const createCustomIcon = (sector: string, isSelected: boolean) => {
  const getSectorEmoji = (sec: string) => {
    switch (sec) {
      case 'AI / ML': return '🤖';
      case 'FinTech': return '💳';
      case 'EdTech': return '📚';
      case 'HealthTech': return '🌸';
      case 'AgriTech': return '🌿';
      case 'SaaS': return '🏷️';
      case 'eCommerce': return '⌚';
      case 'CleanTech': return '☀️';
      case 'Logistics': return '🚀';
      case 'Media': return '🎙️';
      default: return '📍';
    }
  };

  const html = `
    <div class="${styles.markerPin} ${isSelected ? styles.selected : ''}">
      <span class="${styles.markerIcon}">${getSectorEmoji(sector)}</span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-pin',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42],
  });
};

// Component to dynamically adjust bounds/center
function MapController({ startups, selectedStartup }: { startups: Startup[]; selectedStartup?: Startup | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStartup) {
      map.flyTo([selectedStartup.latitude, selectedStartup.longitude], 14, {
        duration: 1.2,
      });
    } else if (startups.length > 0) {
      const bounds = L.latLngBounds(startups.map((s) => [s.latitude, s.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [selectedStartup, startups, map]);

  return null;
}

interface StartupMapProps {
  startups: Startup[];
  selectedStartup: Startup | null;
  onSelectStartup: (startup: Startup) => void;
}

export default function StartupMap({
  startups,
  selectedStartup,
  onSelectStartup,
}: StartupMapProps) {
  // Jaipur City Center fallback coordinates
  const jaipurCenter: [number, number] = [26.9124, 75.7873];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={jaipurCenter}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController startups={startups} selectedStartup={selectedStartup} />

        {startups.map((startup) => {
          const isSelected = selectedStartup?.id === startup.id;
          return (
            <Marker
              key={startup.id}
              position={[startup.latitude, startup.longitude]}
              icon={createCustomIcon(startup.sector, isSelected)}
              eventHandlers={{
                click: () => onSelectStartup(startup),
              }}
            >
              <Popup className={styles.popup}>
                <div className={styles.popupContent}>
                  <div className={styles.popupHeader}>
                    <span className={styles.popupLogo}>{startup.logo}</span>
                    <div>
                      <h4 className={styles.popupTitle}>{startup.name}</h4>
                      <span className={styles.popupCategory}>
                        {startup.sector} · {startup.stage}
                      </span>
                    </div>
                  </div>
                  <p className={styles.popupTagline}>{startup.tagline}</p>
                  <p className={styles.popupLocation}>📍 {startup.location}</p>
                  <button
                    onClick={() => onSelectStartup(startup)}
                    className={styles.popupBtn}
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
