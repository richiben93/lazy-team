"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';
import { Trip, Member } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxGlobalMapProps {
  trips: Trip[];
  members: Member[];
}

// Black line for all routes
const lineLayer: LayerProps = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#000000',
    'line-width': 3,
    'line-opacity': 0.7,
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  }
};

const hoverLineLayer: LayerProps = {
  id: 'route-hover',
  type: 'line',
  paint: {
    'line-color': '#000000',
    'line-width': 6,
    'line-opacity': 1,
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  }
};

// Route marker emoji - simple point
const ROUTE_MARKER = '📍';

export default function MapboxGlobalMap({ trips, members }: MapboxGlobalMapProps) {
  const router = useRouter();
  const [tripRoutes, setTripRoutes] = useState<Record<string, any>>({});
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Create member lookup
  const memberMap = useMemo(() => {
    return members.reduce((acc, member) => {
      acc[member.slug] = member;
      return acc;
    }, {} as Record<string, Member>);
  }, [members]);

  useEffect(() => {
    const loadRoutes = async () => {
      for (const trip of trips) {
        try {
          const res = await fetch(trip.geojsonUrl);
          const data = await res.json();
          if (data.features && data.features[0]) {
            setTripRoutes(prev => ({ ...prev, [trip.slug]: data.features[0] }));
          }
        } catch (error) {
          console.error(`Failed to load route for ${trip.slug}:`, error);
        }
      }
    };
    loadRoutes();
  }, [trips]);

  const handleRouteClick = useCallback((trip: Trip) => {
    router.push(`/trips/${trip.slug}`);
  }, [router]);

  const handleRouteHover = useCallback((trip: Trip | null, event?: React.MouseEvent) => {
    setHoveredTrip(trip);
    if (event && trip) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    } else {
      setMousePosition(null);
    }
  }, []);

  const getRouteMidpoint = (route: any): [number, number] | null => {
    if (!route?.geometry?.coordinates) return null;
    const coords = route.geometry.coordinates;
    const midIndex = Math.floor(coords.length / 2);
    return [coords[midIndex][0], coords[midIndex][1]];
  };

  return (
    <div className="w-full relative">
      <div className="flex gap-6 h-auto">
        {/* Map Container */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Map - Square corners, no rounded */}
          <div className="relative h-[70vh] w-full overflow-hidden border border-foreground/10 shadow-2xl">
            <Map
              initialViewState={{
                longitude: 11,
                latitude: 44.5,
                zoom: 5.5
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/outdoors-v12"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibGF6eXRlYW0iLCJhIjoiY20zcTBrOXY5MGNvdzJrcjB1OXR2N3k5diJ9.placeholder'}
              scrollZoom={false}
              dragRotate={false}
              touchPitch={false}
              attributionControl={false}
              interactiveLayerIds={trips.map(t => `route-${t.slug}`)}
              onMouseMove={(e) => {
                if (e.features && e.features.length > 0) {
                  const feature = e.features[0];
                  if (feature.layer && feature.layer.id) {
                    const tripSlug = feature.layer.id.replace('route-', '');
                    const trip = trips.find(t => t.slug === tripSlug);
                    if (trip) {
                      handleRouteHover(trip, e.originalEvent as any);
                    }
                  }
                }
              }}
              onMouseLeave={() => handleRouteHover(null)}
              onClick={(e) => {
                if (e.features && e.features.length > 0) {
                  const feature = e.features[0];
                  if (feature.layer && feature.layer.id) {
                    const tripSlug = feature.layer.id.replace('route-', '');
                    const trip = trips.find(t => t.slug === tripSlug);
                    if (trip) {
                      handleRouteClick(trip);
                    }
                  }
                }
              }}
            >
              <NavigationControl position="top-right" showCompass={false} />

              {/* Render routes */}
              {trips.map(trip => {
                const route = tripRoutes[trip.slug];
                if (!route) return null;
                const isHovered = hoveredTrip?.slug === trip.slug;
                const layerToUse = isHovered ? hoverLineLayer : lineLayer;

                return (
                  <Source
                    key={trip.slug}
                    id={`route-source-${trip.slug}`}
                    type="geojson"
                    data={route}
                  >
                    <Layer
                      {...layerToUse}
                      id={`route-${trip.slug}`}
                      beforeId={isHovered ? undefined : hoveredTrip ? `route-${hoveredTrip.slug}` : undefined}
                    />
                  </Source>
                );
              })}

              {/* Marker emojis */}
              {trips.map((trip) => {
                const route = tripRoutes[trip.slug];
                const midpoint = getRouteMidpoint(route);
                if (!midpoint) return null;

                return (
                  <Marker
                    key={`marker-${trip.slug}`}
                    longitude={midpoint[0]}
                    latitude={midpoint[1]}
                    anchor="center"
                  >
                    <div
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => handleRouteClick(trip)}
                      onMouseEnter={(e) => handleRouteHover(trip, e)}
                      onMouseLeave={(e) => handleRouteHover(null, e)}
                    >
                      <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{ROUTE_MARKER}</span>
                    </div>
                  </Marker>
                );
              })}
            </Map>

            {/* Hover Tooltip */}
            {hoveredTrip && mousePosition && (
              <div
                className="fixed pointer-events-none z-[9999] tooltip-container"
                style={{
                  left: mousePosition.x + 20,
                  top: mousePosition.y - 100,
                }}
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-72 border-2 border-black/10">
                  <div className="relative h-40 w-full">
                    <Image
                      src={hoveredTrip.coverImage}
                      alt={hoveredTrip.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-bold text-sm mb-1">{hoveredTrip.title}</h4>
                      <p className="text-white/80 text-xs">{hoveredTrip.location}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600">
                        <span className="font-bold text-black">{(hoveredTrip.stats.distance / 1000).toFixed(1)}</span> km
                      </span>
                      <span className="text-gray-600">
                        <span className="font-bold text-black">{hoveredTrip.stats.elevationGain}</span> m+
                      </span>
                      <span className="text-gray-600">
                        {new Date(hoveredTrip.date).getFullYear()}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] rounded-full">
                        {hoveredTrip.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-full">
                        {hoveredTrip.terrain}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 italic line-clamp-2">
                      {hoveredTrip.excerpt}
                    </p>
                    <div className="mt-3 text-center">
                      <span className="text-xs font-bold text-blue-600">
                        Click to view →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
