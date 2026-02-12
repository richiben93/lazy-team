"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Trip } from '@/types';
import Link from 'next/link';

// Dynamically import Leaflet components (client-side only)
const FreeMapContainer = dynamic(() => import('./FreeMapContainer'), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface GlobalMapProps {
  trips: Trip[];
}

export default function FreeGlobalMap({ trips }: GlobalMapProps) {
  const [tripRoutes, setTripRoutes] = useState<Record<string, Array<[number, number]>>>({});
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // Load all trip GeoJSON data
    const loadRoutes = async () => {
      for (const trip of trips) {
        try {
          const res = await fetch(trip.geojsonUrl);
          const data = await res.json();
          
          // Extract coordinates from GeoJSON
          if (data.features && data.features[0]?.geometry?.coordinates) {
            const coords = data.features[0].geometry.coordinates.map((coord: number[]) => 
              [coord[1], coord[0]] as [number, number] // Leaflet uses [lat, lng]
            );
            setTripRoutes(prev => ({ ...prev, [trip.slug]: coords }));
          }
        } catch (error) {
          console.error(`Failed to load route for ${trip.slug}:`, error);
        }
      }
    };
    
    loadRoutes();
  }, [trips]);

  return (
    <div className="h-[70vh] w-full rounded-3xl overflow-hidden relative border border-foreground/5 shadow-2xl z-0">
      <FreeMapContainer 
        initialViewState={{ latitude: 45, longitude: 7, zoom: 5 }}
        scrollZoom={false}
        dragging={true}
      >
        {trips.map(trip => {
          const route = tripRoutes[trip.slug];
          if (!route || route.length === 0) return null;

          return (
            <Polyline
              key={trip.slug}
              positions={route}
              pathOptions={{
                color: '#FFC107',
                weight: 4,
                opacity: 0.8,
              }}
              eventHandlers={{
                click: () => setSelectedTrip(trip),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    color: '#FFDE00',
                    weight: 6,
                    opacity: 1,
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    color: '#FFC107',
                    weight: 4,
                    opacity: 0.8,
                  });
                }
              }}
            >
              {selectedTrip?.slug === trip.slug && (
                <Popup
                  eventHandlers={{
                    remove: () => setSelectedTrip(null)
                  }}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-sm mb-1">{trip.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{trip.location}</p>
                    <p className="text-xs mb-2">
                      {(trip.stats.distance / 1000).toFixed(0)}km • {trip.stats.elevationGain}m+
                    </p>
                    <Link 
                      href={`/trips/${trip.slug}`}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View Trip →
                    </Link>
                  </div>
                </Popup>
              )}
            </Polyline>
          );
        })}
      </FreeMapContainer>
      
      {/* Attribution - Required for OpenStreetMap */}
      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[8px] text-gray-600 z-[1000]">
        100% Free • No API Key Required
      </div>
    </div>
  );
}
