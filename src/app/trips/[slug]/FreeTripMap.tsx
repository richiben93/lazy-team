"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const FreeMapContainer = dynamic(() => import('@/components/map/FreeMapContainer'), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const FitBounds = dynamic(() => import('@/components/map/FreeMapContainer').then(mod => mod.FitBounds), { ssr: false });

interface FreeTripMapProps {
  geojsonUrl: string;
  bounds: [[number, number], [number, number]] | null;
}

export default function FreeTripMap({ geojsonUrl, bounds }: FreeTripMapProps) {
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [center, setCenter] = useState<[number, number]>([46.8182, 8.2275]);

  useEffect(() => {
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(data => {
        if (data.features && data.features[0]?.geometry?.coordinates) {
          // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
          const coords = data.features[0].geometry.coordinates.map((coord: number[]) => 
            [coord[1], coord[0]] as [number, number]
          );
          setRoute(coords);
          
          // Calculate center
          if (coords.length > 0) {
            const midPoint = coords[Math.floor(coords.length / 2)];
            setCenter(midPoint);
          }
        }
      })
      .catch(err => console.error('Failed to load route:', err));
  }, [geojsonUrl]);

  // Convert bounds format if needed
  const leafletBounds = bounds 
    ? [[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]] as [[number, number], [number, number]]
    : undefined;

  return (
    <FreeMapContainer 
      initialViewState={{ 
        latitude: center[0], 
        longitude: center[1], 
        zoom: 11 
      }}
      scrollZoom={true}
      dragging={true}
    >
      {route.length > 0 && (
        <>
          <Polyline
            positions={route}
            pathOptions={{
              color: '#000000',
              weight: 4,
              opacity: 0.8,
            }}
          />
          {leafletBounds && <FitBounds bounds={leafletBounds} />}
        </>
      )}
    </FreeMapContainer>
  );
}
