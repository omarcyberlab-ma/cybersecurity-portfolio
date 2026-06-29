import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { Card } from '../ui';
import { youtubeEmbedUrl } from '../../lib/youtube';
import type { Video } from '../../integrations/supabase/types';

export default function Videos({ items = [] }: { items: Video[] }) {
  if (items.length === 0) return null;
  return (
    <section id="videos" className="px-6 py-20 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader marker="videos" title="Talks & Media" desc="Presentations and walkthroughs" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((v, i) => (
            <Reveal key={v.id} delay={i * 80}>
              <Card className="overflow-hidden hover-card-lift">
                <div className="aspect-video bg-[var(--surface)]">
                  {youtubeEmbedUrl(v.youtube_url) ? (
                    <iframe
                      src={youtubeEmbedUrl(v.youtube_url)!}
                      title={v.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-mono text-[var(--muted-foreground)]">►</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-mono truncate">{v.title}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
