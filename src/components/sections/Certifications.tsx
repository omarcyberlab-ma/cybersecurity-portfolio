import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { Card, CardContent } from '../ui';
import type { Certification } from '../../integrations/supabase/types';

export default function Certifications({ items = [] }: { items: Certification[] }) {
  if (items.length === 0) return null;
  return (
    <section id="certifications" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader marker="certifications" title="Certifications" desc="Verified credentials" />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <Card className="hover-card-lift">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono font-semibold">{c.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">{c.issuer} · {c.issued_on}</p>
                      {c.pdf_url && (
                        <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-mono text-[var(--accent)] hover:underline">
                          verify ↗
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
