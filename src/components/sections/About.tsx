import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';

export default function About({ bio }: { bio?: string }) {
  if (!bio) return null;
  return (
    <section id="about" className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionHeader marker="about" title="About Me" desc="A bit about my background" />
        </Reveal>
        <Reveal delay={100}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 hover-card-lift">
            <div className="text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{bio}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
