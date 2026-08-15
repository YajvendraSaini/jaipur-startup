'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Startup } from '@/lib/data';
import styles from './StartupMap.module.css';

// Fix for Leaflet marker default icons in Next.js
const createCustomIcon = (startup: Startup, isSelected: boolean) => {
  const html = `
    <div class="${styles.markerPin} ${isSelected ? styles.selectedPin : ''}">
      <div class="${styles.markerInner}">
        <span class="${styles.markerLogo}">${startup.logo}</span>
      </div>
      <div class="${styles.pinTip}"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-pin',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -44],
  });
};

// Component to dynamically adjust bounds/center and map controls
function MapController({
  startups,
  selectedStartup,
}: {
  startups: Startup[];
  selectedStartup?: Startup | null;
}) {
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

// Controls overlay inside map
function CustomMapControls() {
  const map = useMap();

  const handleMyLocation = () => {
    map.flyTo([26.9124, 75.7873], 13, { duration: 1 });
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <>
      <button
        onClick={handleMyLocation}
        className={styles.myLocationBtn}
        type="button"
      >
        <span className={styles.locIcon}>📍</span> My Location
      </button>

      <div className={styles.zoomControls}>
        <button onClick={handleZoomIn} className={styles.zoomBtn} type="button">
          +
        </button>
        <button onClick={handleZoomOut} className={styles.zoomBtn} type="button">
          −
        </button>
      </div>
    </>
  );
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
  const jaipurCenter: [number, number] = [26.9124, 75.7873];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={jaipurCenter}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={true}
        className={styles.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController startups={startups} selectedStartup={selectedStartup} />
        <CustomMapControls />

        {startups.map((startup) => {
          const isSelected = selectedStartup?.id === startup.id;
          return (
            <Marker
              key={startup.id}
              position={[startup.latitude, startup.longitude]}
              icon={createCustomIcon(startup, isSelected)}
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
