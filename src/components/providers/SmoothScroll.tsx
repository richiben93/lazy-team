"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode, ComponentProps } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 0.8, smoothWheel: true, wheelMultiplier: 1.2, touchMultiplier: 1.5 }}>
      {children as ComponentProps<typeof ReactLenis>['children']}
    </ReactLenis>
  );
}
