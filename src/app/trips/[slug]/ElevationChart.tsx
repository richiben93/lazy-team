"use client";

import React, { useEffect, useState, useMemo } from 'react';

interface ElevationChartProps {
  geojsonUrl: string;
}

export default function ElevationChart({ geojsonUrl }: ElevationChartProps) {
  const [points, setPoints] = useState<{ distance: number; elevation: number }[]>([]);

  useEffect(() => {
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(data => {
        if (data.features && data.features[0] && data.features[0].geometry.coordinates) {
          const coords = data.features[0].geometry.coordinates;
          // In GeoJSON from gpxParser, coords are [lon, lat, ele] or similar
          // Let's assume the 3rd element is elevation if available
          
          let totalDist = 0;
          const processed = coords.map((c: number[], i: number) => {
            if (i > 0) {
              const prev = coords[i-1];
              const d = haversine(prev[1], prev[0], c[1], c[0]);
              totalDist += d;
            }
            return { distance: totalDist, elevation: c[2] || 0 };
          });
          setPoints(processed);
        }
      });
  }, [geojsonUrl]);

  const chartData = useMemo(() => {
    if (points.length === 0) return null;

    const minEle = Math.min(...points.map(p => p.elevation));
    const maxEle = Math.max(...points.map(p => p.elevation));
    const totalDist = points[points.length - 1].distance;
    
    const padding = (maxEle - minEle) * 0.1;
    const yMin = Math.max(0, minEle - padding);
    const yMax = maxEle + padding;

    const width = 400;
    const height = 150;

    const pathData = points.map((p, i) => {
      const x = (p.distance / totalDist) * width;
      const y = height - ((p.elevation - yMin) / (yMax - yMin)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const areaData = `${pathData} L ${width} ${height} L 0 ${height} Z`;

    return { pathData, areaData, width, height, maxEle, totalDist };
  }, [points]);

  if (!chartData) return <div className="h-[150px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />;

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">
        <span>0 km</span>
        <span>Elevation Profile</span>
        <span>{(chartData.totalDist / 1000).toFixed(1)} km</span>
      </div>
      <svg 
        viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <path d={chartData.areaData} fill="currentColor" className="opacity-5 text-foreground" />
        <path d={chartData.pathData} fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
      </svg>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Peak</p>
          <p className="text-sm font-bold">{chartData.maxEle.toFixed(0)}m</p>
        </div>
      </div>
    </div>
  );
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
