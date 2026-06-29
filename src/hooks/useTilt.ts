import { useRef, useEffect, useCallback } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export function useTilt<T extends HTMLElement>({
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glare = false,
  maxGlare = 0.3,
}: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    isTransitioning.current = true;
    ref.current.style.transition = `transform ${speed}ms ease`;
    if (glareRef.current) {
      glareRef.current.style.transition = `opacity ${speed}ms ease`;
    }
  }, [speed]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || isTransitioning.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * maxTilt;
      const tiltY = ((centerX - x) / centerX) * maxTilt;

      ref.current.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glare && glareRef.current) {
        const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        const glareOpacity = ((Math.abs(x - centerX) / centerX + Math.abs(y - centerY) / centerY) / 2) * maxGlare;
        glareRef.current.style.background = `linear-gradient(${glareAngle}deg, rgba(34, 211, 168, ${glareOpacity}), transparent)`;
      }
    },
    [maxTilt, perspective, scale, glare, maxGlare],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    isTransitioning.current = false;
    ref.current.style.transition = `transform ${speed}ms ease`;
    ref.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glareRef.current) {
      glareRef.current.style.background = "transparent";
    }
  }, [speed, perspective]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseLeave]);

  return { ref, glareRef };
}
