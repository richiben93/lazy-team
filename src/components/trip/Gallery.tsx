"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  photos: string[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const goNext = useCallback(() => {
    if (index === null) return;
    setIndex((index + 1) % photos.length);
  }, [index, photos.length]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    setIndex((index - 1 + photos.length) % photos.length);
  }, [index, photos.length]);

  const close = useCallback(() => {
    setIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          close();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, close, goNext, goPrev]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 border-t border-foreground/5">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-12">Galleria</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <motion.div
            key={`${photo}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl group"
            onClick={() => setIndex(i)}
          >
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <Image
              src={photo}
              alt={`Foto galleria ${i + 1}`}
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
            onClick={close}
            role="dialog"
            aria-label="Galleria foto a schermo intero"
            aria-modal="true"
          >
            <button
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:opacity-50 transition-opacity z-10 p-2"
              onClick={close}
              aria-label="Chiudi galleria"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-2 md:left-10 text-white hover:opacity-50 transition-opacity z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Foto precedente"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <div className="relative w-full h-full max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={photos[index]}
                alt={`Foto galleria ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button
              className="absolute right-2 md:right-10 text-white hover:opacity-50 transition-opacity z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Foto successiva"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
              {index + 1} / {photos.length}
            </div>

            {/* Mobile swipe hint */}
            <p className="md:hidden absolute bottom-14 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              Usa le frecce per navigare
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
