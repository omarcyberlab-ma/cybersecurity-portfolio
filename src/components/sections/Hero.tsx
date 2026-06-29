import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { useTypewriter } from '../../hooks/useTypewriter';
import type { SiteSettings } from '../../integrations/supabase/types';

function GlitchText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let stopped = false;

    function trigger() {
      if (stopped) return;
      setIsGlitching(true);
      let iterations = 0;
      const maxIt = 8;
      const interval = setInterval(() => {
        setDisplay(
          text.split('').map((c, i) => {
            if (c === ' ') return ' ';
            if (i < iterations) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join(''),
        );
        iterations++;
        if (iterations >= maxIt) {
          clearInterval(interval);
          setDisplay(text);
          setIsGlitching(false);
          timeout = setTimeout(trigger, 4000 + Math.random() * 4000);
        }
      }, 50);
    }

    timeout = setTimeout(trigger, 3000);
    return () => { stopped = true; clearTimeout(timeout); };
  }, [text]);

  return (
    <span className={className} data-glitching={isGlitching ? 'true' : undefined}>
      {display}
    </span>
  );
}

export default function Hero({ settings }: { settings: SiteSettings }) {
  const typedText = useTypewriter({
    texts: [
      settings.title || 'Cybersecurity Professional',
      'Penetration Tester',
      'Security Engineer',
      'Ethical Hacker',
    ],
    typeSpeed: 60,
    deleteSpeed: 30,
    pauseDuration: 2500,
  });

  const stats = [
    { label: 'projects', value: '12+' },
    { label: 'years exp', value: '8+' },
    { label: 'certs', value: '5+' },
  ];

  return (
    <section className="min-h-screen flex items-center relative px-6 pt-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-[var(--accent)]">system online</span>
            </div>

            <div className="section-marker mb-4">// introduction</div>

            <h1 className="text-4xl md:text-6xl font-mono font-bold leading-tight mb-4">
              <GlitchText text={settings.name || 'Your Name'} />
            </h1>

            <div className="h-8 mb-2">
              <p className="text-xl font-mono">
                <span className="text-[var(--muted-foreground)]">$ </span>
                <span className="text-[var(--accent)]">{typedText}</span>
                <span className="inline-block w-[3px] h-5 bg-[var(--accent)] ml-1 animate-pulse align-middle" />
              </p>
            </div>

            <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-lg">
              {settings.tagline || 'Securing systems, one layer at a time.'}
            </p>

            <div className="flex gap-4 mb-12">
              <Button variant="default" size="lg" onClick={() => window.open('/cv.pdf', '_blank')}>
                Download CV
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact Me
              </Button>
            </div>

            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-mono font-bold text-[var(--accent)]">{s.value}</div>
                  <div className="text-xs font-mono text-[var(--muted-foreground)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-xl border border-[var(--border)] overflow-hidden glow-accent">
                {settings.profile_photo_url ? (
                  <img src={settings.profile_photo_url} alt={settings.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--surface)] flex items-center justify-center">
                    <span className="text-6xl font-mono text-[var(--muted-foreground)]">[ ]</span>
                  </div>
                )}
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-[var(--accent)] rounded-tr" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-[var(--accent)] rounded-bl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
