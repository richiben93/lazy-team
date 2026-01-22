"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  photos: string[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 border-t border-foreground/5">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 mb-12">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <motion.div
            key={photo}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl group"
            onClick={() => setIndex(i)}
          >
            <Image
              src={photo}
              alt={`Gallery image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIndex(null)}
          >
            <button 
              className="absolute top-10 right-10 text-white hover:opacity-50 transition-opacity z-10"
              onClick={() => setIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-4 md:left-10 text-white hover:opacity-50 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((index - 1 + photos.length) % photos.length);
              }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <div className="relative w-full h-full max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={photos[index]}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button 
              className="absolute right-4 md:right-10 text-white hover:opacity-50 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((index + 1) % photos.length);
              }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
              {index + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
