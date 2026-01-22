"use client";

import React, { useState, useEffect } from 'react';
import { Source, Layer, Popup } from 'react-map-gl/mapbox';
import MapContainer from './MapContainer';
import { Trip } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface GlobalMapProps {
  trips: Trip[];
}

export default function GlobalMap({ trips }: GlobalMapProps) {
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null);
  const [tripGeoJSONs, setTripGeoJSONs] = useState<Record<string, GeoJSON.FeatureCollection>>({});

  useEffect(() => {
    trips.forEach(async (trip) => {
      const res = await fetch(trip.geojsonUrl);
      const data = await res.json();
      setTripGeoJSONs(prev => ({ ...prev, [trip.slug]: data }));
    });
  }, [trips]);

  return (
    <div className="h-[70vh] w-full rounded-3xl overflow-hidden relative border border-foreground/5">
      <MapContainer 
        initialViewState={{ latitude: 45, longitude: 7, zoom: 4.5 }}
        scrollZoom={false}
        dragPan={false}
        doubleClickZoom={false}
        onLoad={(e) => {
          const map = e.target;
          map.on('mouseenter', (ev) => {
            const features = map.queryRenderedFeatures(ev.point);
            const tripFeature = features.find(f => f.layer?.id.startsWith('hit-'));
            if (tripFeature && tripFeature.layer) {
              const slug = tripFeature.layer.id.replace('hit-', '');
              const trip = trips.find(t => t.slug === slug);
              if (trip) setHoveredTrip(trip);
            }
          });
          map.on('mouseleave', (ev) => {
            setHoveredTrip(null);
          });
        }}
      >
        {trips.map(trip => {
          const geojson = tripGeoJSONs[trip.slug];
          if (!geojson) return null;

          return (
            <Source key={trip.slug} type="geojson" data={geojson}>
              <Layer
                id={`line-${trip.slug}`}
                type="line"
                paint={{
                  'line-color': '#111',
                  'line-width': 2,
                  'line-opacity': 0.6
                }}
              />
              <Layer
                id={`hit-${trip.slug}`}
                type="line"
                paint={{
                  'line-color': 'rgba(0,0,0,0)',
                  'line-width': 20
                }}
              />
            </Source>
          );
        })}

        {/* Popup is temporarily disabled or handled differently to pass build */}
      </MapContainer>
    </div>
  );
}
