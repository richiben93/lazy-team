"use client";

import React, { useEffect, useState, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, LayerProps } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxTripMapProps {
  geojsonUrl: string;
  bounds: [[number, number], [number, number]] | null;
}

// Line layer style for trip route
const routeLayer: LayerProps = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#000000',
    'line-width': 4,
    'line-opacity': 0.8,
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  }
};

// Start/end points
const pointLayer: LayerProps = {
  id: 'points',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    'circle-color': '#FFC107',
    'circle-stroke-color': '#000000',
    'circle-stroke-width': 2,
  }
};

export default function MapboxTripMap({ geojsonUrl, bounds }: MapboxTripMapProps) {
  const [routeData, setRouteData] = useState<any>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    // Load route data
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(data => {
        if (data.features && data.features[0]) {
          setRouteData(data.features[0]);
        }
      })
      .catch(err => console.error('Failed to load route:', err));
  }, [geojsonUrl]);

  useEffect(() => {
    // Fit bounds when route is loaded
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(
        [
          [bounds[0][0], bounds[0][1]], // southwest
          [bounds[1][0], bounds[1][1]]  // northeast
        ],
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000
        }
      );
    }
  }, [bounds, routeData]);

  // Extract start and end points
  const getStartEndPoints = (): GeoJSON.FeatureCollection | null => {
    if (!routeData?.geometry?.coordinates) return null;
    
    const coords = routeData.geometry.coordinates;
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: coords[0]
          },
          properties: { type: 'start' }
        },
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: coords[coords.length - 1]
          },
          properties: { type: 'end' }
        }
      ]
    };
  };

  const startEndPoints = getStartEndPoints();

  return (
    <div className="h-[60vh] md:h-[70vh] w-full rounded-2xl overflow-hidden border border-foreground/10 shadow-xl">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: bounds ? (bounds[0][0] + bounds[1][0]) / 2 : 11,
          latitude: bounds ? (bounds[0][1] + bounds[1][1]) / 2 : 44.5,
          zoom: 11
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibGF6eXRlYW0iLCJhIjoiY20zcTBrOXY5MGNvdzJrcjB1OXR2N3k5diJ9.placeholder'}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" showCompass={true} />
        
        {/* Terrain source for 3D effect */}
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {/* Route line */}
        {routeData && (
          <Source
            id="route-source"
            type="geojson"
            data={routeData}
          >
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* Start/End points */}
        {startEndPoints && (
          <Source
            id="points-source"
            type="geojson"
            data={startEndPoints}
          >
            <Layer {...pointLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}
