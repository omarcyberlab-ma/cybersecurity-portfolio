export function initMatrixRain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let animId = 0;
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]|&^%$#@!";
  const fontSize = 14;
  let columns = 0;
  const drops: number[] = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx!.scale(dpr, dpr);

    columns = Math.floor(window.innerWidth / fontSize);
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.fillStyle = "rgba(10, 14, 20, 0.05)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const y = drops[i] * fontSize;

      const brightness = Math.random() > 0.97 ? 1 : 0.4;
      ctx.fillStyle = `rgba(34, 211, 168, ${brightness})`;
      ctx.fillText(char, i * fontSize, y);

      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
  };
}

export function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let animId = 0;
  const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
  let mouseX = -100;
  let mouseY = -100;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx!.scale(dpr, dpr);
  }

  function addParticle(x: number, y: number) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      size: Math.random() * 2 + 1,
    });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.vx *= 0.98;
      p.vy *= 0.98;

      const alpha = 1 - p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 168, ${alpha * 0.6})`;
      ctx.fill();

      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    for (let i = 0; i < 2; i++) {
      addParticle(mouseX + (Math.random() - 0.5) * 4, mouseY + (Math.random() - 0.5) * 4);
    }
  });

  resize();
  draw();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("mousemove", () => {});
  };
}
