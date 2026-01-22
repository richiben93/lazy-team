"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  children?: React.ReactNode;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  className?: string;
  onLoad?: (e: { target: mapboxgl.Map }) => void;
  scrollZoom?: boolean;
  dragPan?: boolean;
  doubleClickZoom?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapContainer({ 
  children, 
  initialViewState = { latitude: 46.8182, longitude: 8.2275, zoom: 4 },
  className = "h-full w-full",
  onLoad,
  scrollZoom = false,
  dragPan = true,
  doubleClickZoom = true
}: MapContainerProps) {
  const [mapError, setMapError] = useState(!MAPBOX_TOKEN);

  if (mapError || !MAPBOX_TOKEN) {
    return (
      <div className={`${className} relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl`}>
        <Image 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80"
          alt="Map Placeholder"
          fill
          className="object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg text-center max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">Map Demo Mode</h3>
            <p className="text-sm opacity-80">
              Add <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable interactive maps
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={onLoad}
        onError={() => setMapError(true)}
        scrollZoom={scrollZoom}
        dragPan={dragPan}
        doubleClickZoom={doubleClickZoom}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {children}
      </Map>
    </div>
  );
}
