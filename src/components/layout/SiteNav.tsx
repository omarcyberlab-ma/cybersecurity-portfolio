import React, { useState, useEffect } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';

const navItems = [
  { href: '#about', label: 'about' },
  { href: '#skills', label: 'skills' },
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'projects' },
  { href: '#certifications', label: 'certs' },
  { href: '#videos', label: 'videos' },
  { href: '#contact', label: 'contact' },
];

const sectionIds = navItems.map((i) => i.href.slice(1));

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm shadow-[var(--accent)]/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
        <a href="#" className="flex items-center gap-2 text-[var(--accent)] font-mono text-lg no-underline group">
          <span className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors">~</span>/portfolio
          <span className="w-2 h-4 bg-[var(--accent)] animate-pulse opacity-50" />
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-mono no-underline rounded transition-all duration-200 ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--surface)]'
                }`}
              >
                {isActive && <span className="mr-1 text-[var(--accent)]">&gt;</span>}
                {item.label}
              </a>
            );
          })}
          <a
            href="/auth"
            className="ml-4 px-4 py-2 text-sm font-mono rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors no-underline"
          >
            sign in
          </a>
        </nav>

        <button
          className="md:hidden text-[var(--foreground)] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2 text-sm font-mono transition-colors no-underline ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)] hover:text-[var(--accent)]'
                  }`}
                >
                  {isActive && <span className="mr-1 text-[var(--accent)]">&gt;</span>}
                  {item.label}
                </a>
              );
            })}
            <a
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-2 text-sm font-mono rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors text-center no-underline"
            >
              sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
