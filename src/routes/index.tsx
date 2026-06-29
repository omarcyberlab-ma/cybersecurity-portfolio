import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "../lib/portfolio.functions";
import type { SiteData } from "../integrations/supabase/types";

import { ParticleCursor } from "../components/effects/ParticleCursor";
import TerminalGridBg from "../components/layout/TerminalGridBg";
import SiteNav from "../components/layout/SiteNav";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Projects from "../components/sections/Projects";
import Certifications from "../components/sections/Certifications";
import Videos from "../components/sections/Videos";
import Contact from "../components/sections/Contact";

const siteQuery = {
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
};

export const Route = createFileRoute("/")({
  loader: ({ context }: any) =>
    (context.queryClient as any).ensureQueryData(siteQuery as any),
  component: Index,
  head: () => ({
    meta: [{ title: "Home — Portfolio" }],
  }),
} as any);

function Index() {
  const data = Route.useLoaderData() as SiteData;
  const { settings, skills, experience, projects, certifications, videos } = data;

  return (
    <div className="relative min-h-screen">
      <TerminalGridBg />
      <ParticleCursor />
      <SiteNav />
      <main className="relative z-10">
        <Hero settings={settings} />
        <About bio={settings.bio} />
        <Skills skills={skills} />
        <Experience items={experience} />
        <Projects projects={projects} />
        <Certifications items={certifications} />
        <Videos items={videos} />
        <Contact settings={settings} />
      </main>
      <footer className="relative z-10 border-t border-[var(--border)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[var(--muted-foreground)] font-mono">
          <span>© {new Date().getFullYear()} {settings.name || 'Portfolio'}</span>
          <span className="text-xs text-[var(--muted-foreground)]">
            uptime: <span id="uptime" />
          </span>
          <span className="text-xs">crafted with [ security in mind ]</span>
        </div>
      </footer>
    </div>
  );
}
