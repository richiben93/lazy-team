"use client";

import dynamic from "next/dynamic";
import { Trip } from "@/types";

const GlobalMap = dynamic(() => import("./GlobalMap"), { ssr: false });

export default function GlobalMapClient({ trips }: { trips: Trip[] }) {
  return <GlobalMap trips={trips} />;
}
