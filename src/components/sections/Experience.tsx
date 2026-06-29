import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { useTilt } from '../../hooks/useTilt';
import type { Experience as ExperienceType } from '../../integrations/supabase/types';

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref } = useTilt<HTMLDivElement>({ maxTilt: 5, scale: 1.01 });

  return (
    <div ref={ref} className={`${className || ''}`} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}

export default function Experience({ items = [] }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;
  return (
    <section id="experience" className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionHeader marker="experience" title="Experience" desc="Professional journey" />
        </Reveal>
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--border)] to-transparent" />
          <div className="space-y-8">
            {items.map((it, i) => (
              <Reveal key={it.id} delay={i * 80}>
                <div className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] flex items-center justify-center shadow-[0_0_10px_rgba(34,211,168,0.2)]">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    </div>
                  </div>
                  <TiltCard className="flex-1">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover-card-lift">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3 className="font-mono font-semibold text-lg">{it.role}</h3>
                        <span className="text-[var(--accent)]">·</span>
                        <span className="text-[var(--accent)] font-mono">{it.company}</span>
                      </div>
                      <div className="text-sm text-[var(--muted-foreground)] font-mono mb-3">
                        {it.start_date} — {it.end_date || 'Present'}
                      </div>
                      {it.bullets && it.bullets.length > 0 && (
                        <ul className="space-y-1.5">
                          {it.bullets.map((b: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm text-[var(--foreground)]/80">
                              <span className="text-[var(--accent)] mt-1 flex-shrink-0">▹</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
