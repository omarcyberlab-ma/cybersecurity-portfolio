import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { Card, CardContent } from '../ui';
import { useTilt } from '../../hooks/useTilt';
import { youtubeEmbedUrl } from '../../lib/youtube';
import type { Project } from '../../integrations/supabase/types';

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, glareRef } = useTilt<HTMLDivElement>({ maxTilt: 8, glare: true });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ''}`} style={{ transformStyle: 'preserve-3d' }}>
      {children}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ mixBlendMode: 'overlay' }}
      />
    </div>
  );
}

export default function Projects({ projects = [] }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="projects" className="px-6 py-20 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader marker="projects" title="Projects" desc="Things I've built" />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <TiltCard>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-[var(--surface)] overflow-hidden">
                    {youtubeEmbedUrl(p.youtube_url) ? (
                      <iframe src={youtubeEmbedUrl(p.youtube_url)!} title={p.title} className="w-full h-full" allowFullScreen />
                    ) : p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-mono text-[var(--muted-foreground)]">{'{ }'}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-mono font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex gap-3">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-[var(--accent)] hover:underline">Live →</a>
                      )}
                      {p.repo_url && (
                        <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-[var(--accent)] hover:underline">Repo →</a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
