"use client";

import dynamic from "next/dynamic";

// Use the FREE version - no API keys needed!
const FreeTripMap = dynamic(() => import("@/app/trips/[slug]/FreeTripMap"), { ssr: false });

export default function TripMapClient({ geojsonUrl, bounds }: { geojsonUrl: string; bounds: [[number, number], [number, number]] | null }) {
  return <FreeTripMap geojsonUrl={geojsonUrl} bounds={bounds} />;
}
