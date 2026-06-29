import { useEffect, useRef } from "react";
import { initParticles } from "../../effects/matrixRain";

export function ParticleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = initParticles(canvas);
    return cleanup;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
