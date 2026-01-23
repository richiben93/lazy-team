"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Trip } from "@/types";
import { useRef } from "react";

interface TripCardProps {
  trip: Trip;
  index: number;
}

export default function TripCard({ trip, index }: TripCardProps) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/trips/${trip.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 mb-6">
          <motion.div 
            style={{ y: prefersReducedMotion ? 0 : y, height: "120%", top: "-10%" }} 
            className="absolute inset-0"
          >
            <Image
              src={trip.coverImage}
              alt={trip.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2">
              {trip.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded-full font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-tight group-hover:text-muted transition-colors">{trip.title}</h3>
            <p className="text-sm text-secondary font-medium">{trip.location} — {new Date(trip.date).getFullYear()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{(trip.stats.distance / 1000).toFixed(0)}km</p>
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{trip.stats.elevationGain}m+</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
