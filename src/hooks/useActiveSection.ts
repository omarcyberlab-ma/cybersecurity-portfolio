import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -50% 0px`,
        threshold: 0,
      },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    for (const el of elements) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeSection;
}
