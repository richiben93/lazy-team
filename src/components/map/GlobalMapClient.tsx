"use client";

import dynamic from "next/dynamic";
import { Trip, Member } from "@/types";

// Use Mapbox GL JS for beautiful, responsive maps
const MapboxGlobalMap = dynamic(() => import("./MapboxGlobalMap"), { ssr: false });

export default function GlobalMapClient({ trips, members }: { trips: Trip[]; members: Member[] }) {
  return <MapboxGlobalMap trips={trips} members={members} />;
}
