"use client";

import dynamic from "next/dynamic";
import { Trip } from "@/types";

// Use the FREE version - no API keys needed!
const FreeGlobalMap = dynamic(() => import("./FreeGlobalMap"), { ssr: false });

export default function GlobalMapClient({ trips }: { trips: Trip[] }) {
  return <FreeGlobalMap trips={trips} />;
}
