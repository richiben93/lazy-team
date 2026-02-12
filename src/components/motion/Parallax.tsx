"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export default function Parallax({ children, offset = 50, className = "" }: ParallaxProps) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  
  // Add spring physics for smoother, GPU-accelerated animation
  const y = useSpring(yRaw, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div 
      ref={ref} 
      style={{ y, willChange: 'transform' }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}
