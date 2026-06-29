import React from 'react';

export default function SectionHeader({ marker, title, desc }: any) {
  return (
    <div className="mb-6">
      <div className="section-marker">// {marker}</div>
      <h2 className="text-2xl font-mono">{title}</h2>
      {desc && <p className="text-muted">{desc}</p>}
    </div>
  );
}
