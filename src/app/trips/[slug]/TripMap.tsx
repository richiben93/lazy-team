"use client";

import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import MapContainer from '@/components/map/MapContainer';

interface TripMapProps {
  geojsonUrl: string;
  bounds: [[number, number], [number, number]] | null;
}

export default function TripMap({ geojsonUrl, bounds }: TripMapProps) {
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(data => setGeojson(data));
  }, [geojsonUrl]);

  const initialViewState = bounds ? {
    longitude: (bounds[0][0] + bounds[1][0]) / 2,
    latitude: (bounds[0][1] + bounds[1][1]) / 2,
    zoom: 11
  } : undefined;

  return (
    <MapContainer initialViewState={initialViewState}>
      {geojson && (
        <Source type="geojson" data={geojson}>
          <Layer
            id="route"
            type="line"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#111',
              'line-width': 4,
              'line-opacity': 0.8
            }}
          />
        </Source>
      )}
    </MapContainer>
  );
}
