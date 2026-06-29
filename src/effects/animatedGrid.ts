export function initAnimatedGrid(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let animId = 0;
  let mouseX = -1000;
  let mouseY = -1000;
  let time = 0;

  const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
  const spacing = 60;
  const connectionDistance = 100;
  let cols = 0;
  let rows = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx!.scale(dpr, dpr);

    cols = Math.ceil(window.innerWidth / spacing) + 1;
    rows = Math.ceil(window.innerHeight / spacing) + 1;

    nodes.length = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          x: c * spacing + (Math.random() - 0.5) * 8,
          y: r * spacing + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    }
  }

  function draw() {
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);
    time += 0.005;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -10) n.x = w + 10;
      if (n.x > w + 10) n.x = -10;
      if (n.y < -10) n.y = h + 10;
      if (n.y > h + 10) n.y = -10;

      const dxToMouse = n.x - mouseX;
      const dyToMouse = n.y - mouseY;
      const distToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);

      let glowIntensity = 0;
      let color = "34, 211, 168";

      if (distToMouse < 120) {
        glowIntensity = (1 - distToMouse / 120) * 1;
        color = "255, 255, 255";
      }

      const waveY = Math.sin(n.y * 0.02 + time) * 0.3;
      const waveX = Math.sin(n.x * 0.02 + time * 0.7) * 0.3;
      const pulseIntensity = 0.3 + waveY * 0.1 + waveX * 0.1 + glowIntensity * 0.7;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5 + glowIntensity * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${0.3 + pulseIntensity * 0.4})`;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.3;
          const mouseInfluence = glowIntensity > 0 ? (1 - distToMouse / 120) * 0.5 : 0;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(34, 211, 168, ${alpha + mouseInfluence})`;
          ctx.lineWidth = 0.5 + mouseInfluence;
          ctx.stroke();
        }
      }

      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const digitalTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(34, 211, 168, 0.05)";
      ctx.fillText(digitalTime, w - 110, h - 10);
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  resize();
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
  };
}
