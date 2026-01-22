"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Split text by lines or words. For a simple "mask-up", we'll treat the whole block 
  // but we can also split by words if needed. Let's do a simple line/block mask first.
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
