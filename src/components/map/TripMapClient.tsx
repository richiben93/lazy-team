"use client";

import dynamic from "next/dynamic";

// Use Mapbox GL JS for beautiful, responsive maps with 3D terrain
const MapboxTripMap = dynamic(() => import("./MapboxTripMap"), { ssr: false });

export default function TripMapClient({ geojsonUrl, bounds }: { geojsonUrl: string; bounds: [[number, number], [number, number]] | null }) {
  return <MapboxTripMap geojsonUrl={geojsonUrl} bounds={bounds} />;
}
