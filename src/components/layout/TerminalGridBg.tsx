import React, { useEffect, useRef } from 'react';
import { initAnimatedGrid } from '../../effects/animatedGrid';

export default function TerminalGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = initAnimatedGrid(canvas);
    return cleanup;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(34,211,168,0.08), transparent 60%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </div>
  );
}
