import { useEffect, useRef, useState } from "react";
import { terminalBootSequence, getBootLines } from "../../effects/terminalBoot";

interface Props {
  onComplete: () => void;
}

export function TerminalBootScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentLines: string[] = [];

    const cancel = terminalBootSequence(
      getBootLines(),
      (text, isComplete) => {
        if (currentLines.length === 0) {
          currentLines = [text];
        } else {
          if (isComplete) {
            currentLines = [...currentLines, text];
          } else {
            currentLines = [...currentLines.slice(0, -1), text];
          }
        }
        setLines([...currentLines]);

        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      },
      () => {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 300);
        }, 500);
      },
    );

    return cancel;
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[var(--background)] flex items-center justify-center transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="max-w-2xl w-full mx-6">
        <div
          ref={containerRef}
          className="bg-black/30 border border-[var(--border)] rounded-lg p-4 font-mono text-sm overflow-y-auto max-h-[70vh]"
          style={{
            boxShadow: "0 0 30px rgba(34, 211, 168, 0.05), inset 0 0 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          {lines.map((line, i) => {
            const isHeader = line.includes("╔") || line.includes("║") || line.includes("╚");
            const isReady = line.includes("system: ready");
            const isOk = line.includes("[  OK  ]");
            const isBoot = line.includes("boot:");
            return (
              <div
                key={i}
                className={`leading-relaxed ${isHeader ? "text-[var(--accent)]" : ""} ${isReady ? "text-green-400 font-bold" : ""} ${isOk ? "text-[var(--accent)]" : ""} ${isBoot && !isOk ? "text-[var(--muted-foreground)]" : ""}`}
              >
                {isOk ? (
                  <span className="text-green-400">{line}</span>
                ) : isBoot ? (
                  <span className="text-[var(--muted-foreground)]">{line}</span>
                ) : (
                  <span className="text-[var(--foreground)]">{line}</span>
                )}
                {i === lines.length - 1 && !line.endsWith("...") && (
                  <span className="inline-block w-2 h-4 bg-[var(--accent)] ml-1 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-xs text-[var(--muted-foreground)] font-mono">
          Initializing secure environment...
        </div>
      </div>
    </div>
  );
}
