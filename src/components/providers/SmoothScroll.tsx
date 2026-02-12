"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode, ComponentProps } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08,  // Reduced from 0.12 for smoother interpolation
        duration: 1.2,  // Increased from 0.8 for smoother feel
        smoothWheel: true, 
        wheelMultiplier: 0.8,  // Reduced from 1.2 for less aggressive scrolling
        touchMultiplier: 1.2,  // Reduced from 1.5
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        syncTouch: false,  // Better performance on touch devices
        syncTouchLerp: 0.1,
        touchInertiaMultiplier: 20,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for smoother animation
      }}
    >
      {children as ComponentProps<typeof ReactLenis>['children']}
    </ReactLenis>
  );
}
