export function terminalBootSequence(
  lines: string[],
  onLine: (text: string, isComplete: boolean) => void,
  onComplete: () => void,
  baseDelay = 30,
) {
  let currentLine = 0;
  let currentChar = 0;
  let cancelled = false;

  function typeLine() {
    if (cancelled) return;

    if (currentLine >= lines.length) {
      onComplete();
      return;
    }

    const line = lines[currentLine];

    if (currentChar <= line.length) {
      onLine(line.substring(0, currentChar), false);
      currentChar++;
      const delay = line[currentChar - 1] === " " ? baseDelay : baseDelay + Math.random() * 60;
      setTimeout(typeLine, delay);
    } else {
      onLine(line, true);
      currentLine++;
      currentChar = 0;
      setTimeout(typeLine, baseDelay * 10);
    }
  }

  typeLine();

  return () => {
    cancelled = true;
  };
}

export function getBootLines(hostname = "portfolio"): string[] {
  const year = new Date().getFullYear();
  return [
    `[${new Date().toISOString()}] boot: starting ${hostname} v1.0.0`,
    `[${new Date().toISOString()}] boot: loading kernel modules...`,
    "[  OK  ] Loaded: security.module",
    "[  OK  ] Loaded: crypto.engine",
    "[  OK  ] Loaded: network.stack",
    `[${new Date().toISOString()}] boot: initializing display server...`,
    "[  OK  ] Started: X11 on :0",
    `[${new Date().toISOString()}] boot: mounting assets...`,
    "[  OK  ] Mounted: /fonts",
    "[  OK  ] Mounted: /styles",
    "[  OK  ] Mounted: /components",
    `[${new Date().toISOString()}] boot: establishing secure connection...`,
    "[  OK  ] TLS handshake complete",
    "[  OK  ] Authenticated session established",
    `[${new Date().toISOString()}] boot: starting application...`,
    "[  OK  ] React renderer ready",
    "[  OK  ] Router initialized",
    "[  OK  ] Animation engine ready",
    `[${new Date().toISOString()}] system: ready | uptime: 0.${Math.floor(Math.random() * 100)}s`,
    "",
    "  ╔══════════════════════════════════════╗",
    "  ║       PORTFOLIO v1.0.0               ║",
    "  ║  ⚡ Secure. Fast. Minimal.           ║",
    "  ╚══════════════════════════════════════╝",
    "",
    "  Type 'help' for available commands",
    "  or press any key to continue...",
    "",
  ];
}
