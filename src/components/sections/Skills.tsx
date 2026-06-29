import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { Card, CardContent, CardTitle } from '../ui';
import { useReveal } from '../../hooks/useReveal';
import type { Skill } from '../../integrations/supabase/types';

function SkillBar({ name, level = 75 }: { name: string; level?: number }) {
  const { ref, isVisible } = useReveal();

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-mono text-[var(--foreground)]">{name}</span>
        <span className="text-xs font-mono text-[var(--accent)]">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-alt)] transition-all duration-1000 ease-out"
          style={{ width: isVisible ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export default function Skills({ skills = [] }: { skills: Skill[] }) {
  if (skills.length === 0) return null;
  const byCategory: Record<string, Skill[]> = {};
  skills.forEach((s) => { (byCategory[s.category] ||= []).push(s); });

  return (
    <section id="skills" className="px-6 py-20 bg-[var(--surface)]/30">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeader marker="skills" title="Skills & Expertise" desc="Technologies and domains I work with" />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(byCategory).map(([cat, list], i) => (
            <Reveal key={cat} delay={i * 80}>
              <Card className="hover-card-lift">
                <CardContent className="p-5">
                  <CardTitle className="text-[var(--accent)] mb-4">{cat}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {list.map((l) => (
                      <span key={l.id} className="terminal-chip">{l.name}</span>
                    ))}
                  </div>
                  <SkillBar name={cat} level={70 + Math.floor(Math.random() * 25)} />
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
