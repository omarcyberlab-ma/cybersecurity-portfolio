import { useState, useEffect, useRef } from "react";

interface CounterOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
}

export function useCounter({ end, duration = 2000, start = 0, decimals = 0 }: CounterOptions) {
  const [value, setValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimating) {
          setIsAnimating(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating) return;

    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + range * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating, end, duration, start]);

  const displayValue = value.toFixed(decimals);

  return { ref, value: displayValue, isAnimating };
}
