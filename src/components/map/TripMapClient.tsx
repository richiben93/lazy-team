"use client";

import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/app/trips/[slug]/TripMap"), { ssr: false });

export default function TripMapClient({ geojsonUrl, bounds }: { geojsonUrl: string; bounds: [[number, number], [number, number]] | null }) {
  return <TripMap geojsonUrl={geojsonUrl} bounds={bounds} />;
}
