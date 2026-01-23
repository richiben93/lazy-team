"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface FreeMapContainerProps {
  children?: React.ReactNode;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  className?: string;
  scrollZoom?: boolean;
  dragging?: boolean;
}

// Component to fit bounds when route is loaded
function FitBounds({ bounds }: { bounds?: [[number, number], [number, number]] }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

export default function FreeMapContainer({ 
  children, 
  initialViewState = { latitude: 46.8182, longitude: 8.2275, zoom: 4 },
  className = "h-full w-full",
  scrollZoom = false,
  dragging = true
}: FreeMapContainerProps) {
  
  return (
    <div className={className}>
      <MapContainer
        center={[initialViewState.latitude, initialViewState.longitude]}
        zoom={initialViewState.zoom}
        scrollWheelZoom={scrollZoom}
        dragging={dragging}
        className="h-full w-full rounded-2xl"
        zoomControl={true}
      >
        {/* Free OpenStreetMap tiles - no API key required! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}

// Export additional components for route visualization
export { Polyline, Marker, Popup, FitBounds };
