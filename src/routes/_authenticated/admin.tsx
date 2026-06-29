import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "sonner";
import FileUpload from "../../components/admin/FileUpload";
import type {
  SiteSettings, Skill, ContactSubmission,
  Experience as ExperienceType, Project, Certification, Video
} from '../../integrations/supabase/types';

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = 'submissions' | 'settings' | 'skills' | 'experience' | 'projects' | 'certifications' | 'videos';

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('submissions');
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-mono text-[var(--accent)] hover:underline no-underline">← Home</a>
            <span className="text-[var(--muted-foreground)]">/</span>
            <h2 className="text-lg font-mono font-semibold">admin</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--muted-foreground)]">{userEmail}</span>
            <button onClick={handleSignOut} className="px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:border-[var(--destructive)] transition-colors bg-transparent">sign out</button>
          </div>
        </div>
      </header>

      <nav className="border-b border-[var(--border)] overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-0 px-6 min-w-max">
          {(['submissions','settings','skills','experience','projects','certifications','videos'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-mono border-b-2 transition-colors whitespace-nowrap ${
                tab === t ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'submissions' && <SubmissionsPanel />}
        {tab === 'settings' && <SettingsPanel />}
        {tab === 'skills' && <SkillsPanel />}
        {tab === 'experience' && <ExperiencePanel />}
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'certifications' && <CertificationsPanel />}
        {tab === 'videos' && <VideosPanel />}
      </main>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <div className="section-marker mb-4">// {children}</div>;
}

/* ───── Submissions ───── */

function SubmissionsPanel() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    (supabase as any).from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;
  if (items.length === 0) return <p className="text-center py-20 text-lg font-mono text-[var(--muted-foreground)]">No submissions yet</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><SectionHeader>contact_submissions</SectionHeader><span className="text-xs font-mono text-[var(--muted-foreground)]">{items.length} total</span></div>
      {items.map((s) => (
        <div key={s.id} className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-[var(--accent)]">{s.name}</span>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">{s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}</span>
          </div>
          <div className="text-xs font-mono text-[var(--muted-foreground)] mb-2">{s.email}</div>
          <p className="text-sm text-[var(--foreground)]">{s.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ───── Settings ───── */

function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (supabase as any).from('site_settings').select('*').limit(1).single()
      .then(({ data, error }: any) => { if (!error && data) setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const updates: Record<string, string | null> = {
      name: settings.name ?? null, title: settings.title ?? null, tagline: settings.tagline ?? null,
      bio: settings.bio ?? null, email: settings.email ?? null, phone: settings.phone ?? null,
      profile_photo_url: settings.profile_photo_url ?? null,
    };
    const { error } = await (supabase as any).from('site_settings').update(updates).eq('id', settings.id);
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const createDefault = async () => {
    const { data, error } = await (supabase as any).from('site_settings').insert({ name: 'Portfolio', title: 'Security Engineer', tagline: 'I love secure code' }).select().single();
    if (error) { toast.error(error.message); return; }
    if (data) { setSettings(data); toast.success('Settings created'); }
  };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;
  if (!settings) return (
    <div><SectionHeader>site_settings</SectionHeader>
      <p className="text-sm font-mono text-[var(--muted-foreground)] mb-4">No settings row found. Create one to get started.</p>
      <button onClick={createDefault} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors font-mono bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 h-9 px-4 py-2">create default settings</button>
    </div>
  );

  const update = (f: string, v: any) => setSettings(settings ? { ...settings, [f]: v } : settings);

  return (
    <div><SectionHeader>site_settings</SectionHeader>
        <div className="space-y-4 max-w-2xl">
          {(['name','title','tagline','email','phone'] as const).map((f) => (
            <div key={f}>
              <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">{f}</label>
              <input className="flex h-9 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" value={(settings as any)[f] || ''} onChange={(e) => update(f, e.target.value)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">bio</label>
            <textarea className="flex min-h-[100px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" value={settings.bio || ''} onChange={(e) => update('bio', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">profile photo</label>
            <div className="flex items-center gap-3">
              {settings.profile_photo_url && <img src={settings.profile_photo_url} alt="" className="w-10 h-10 rounded object-cover border border-[var(--border)]" />}
              <FileUpload bucket="profile" onUploaded={({ url }) => update('profile_photo_url', url)} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 font-mono bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 h-9 px-4 py-2">
            {saving ? 'saving...' : saved ? 'saved ✓' : 'save changes'}
          </button>
        </div>
    </div>
  );
}

function SkillsPanel() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => {
    (supabase as any).from('skills').select('*').order('category').order('sort')
      .then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newName.trim() || !newCat.trim()) return;
    setAdding(true);
    const { error } = await (supabase as any).from('skills').insert({ name: newName.trim(), category: newCat.trim() });
    setAdding(false);
    if (!error) { setNewName(""); setNewCat(""); load(); }
  };

  const remove = async (id: string) => { await (supabase as any).from('skills').delete().eq('id', id); load(); };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;

  const byCat: Record<string, Skill[]> = {};
  items.forEach((s) => { (byCat[s.category] ||= []).push(s); });

  return (
    <div><SectionHeader>skills</SectionHeader>
      <div className="flex gap-2 mb-6">
        <input className="flex h-9 w-36 rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm font-mono placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" placeholder="category" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
        <input className="flex h-9 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm font-mono placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" placeholder="skill name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button onClick={add} disabled={adding || !newName.trim() || !newCat.trim()} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 font-mono bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 h-9 px-4 py-2">add</button>
      </div>
      {Object.entries(byCat).map(([cat, list]) => (
        <div key={cat} className="mb-6">
          <h3 className="text-sm font-mono text-[var(--accent)] mb-2">{cat} ({list.length})</h3>
          <div className="flex flex-wrap gap-2">
            {list.map((s) => (
              <div key={s.id} className="terminal-chip group">
                {s.name}
                <button onClick={() => remove(s.id)} className="text-[var(--destructive)] opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-1">✕</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───── Reusable CRUD helpers ───── */

function Field({ label, value, onChange, placeholder, big }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; big?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-mono text-[var(--muted-foreground)] mb-0.5">{label}</label>
      {big ? (
        <textarea className="flex min-h-[60px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="flex h-8 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function EditableRow({ id, fields, onSave, onDelete }: { id: string; fields: { label: string; value: string; onChange: (v: string) => void; big?: boolean }[]; onSave: () => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
      {editing ? (
        <div className="space-y-3">
          {fields.map((f, i) => <Field key={i} label={f.label} value={f.value} onChange={f.onChange} big={f.big} />)}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 transition-colors disabled:opacity-50">save</button>
            <button onClick={() => setEditing(false)} className="text-xs font-mono px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {fields.map((f, i) => (
              f.value ? <p key={i} className="text-sm font-mono truncate">{f.label === "bullets" ? f.value : <><span className="text-[var(--muted-foreground)]">{f.label}:</span> {f.value}</>}</p> : null
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setEditing(true)} className="text-xs font-mono text-[var(--accent)] hover:underline">edit</button>
            <button onClick={onDelete} className="text-xs font-mono text-[var(--destructive)] hover:underline">delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───── Experience ───── */

function ExperiencePanel() {
  const [items, setItems] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addRole, setAddRole] = useState("");
  const [addCompany, setAddCompany] = useState("");
  const [addStart, setAddStart] = useState("");
  const [addEnd, setAddEnd] = useState("");
  const [addBullets, setAddBullets] = useState("");

  const load = () => {
    (supabase as any).from('experience').select('*').order('sort').then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!addRole.trim()) return;
    await (supabase as any).from('experience').insert({
      role: addRole.trim(), company: addCompany.trim(), start_date: addStart || null,
      end_date: addEnd || null, bullets: addBullets ? addBullets.split('\n').filter(Boolean) : [],
    });
    setAddRole(""); setAddCompany(""); setAddStart(""); setAddEnd(""); setAddBullets("");
    setShowAdd(false); load();
  };

  const save = async (id: string, data: any) => { await (supabase as any).from('experience').update(data).eq('id', id); load(); };
  const remove = async (id: string) => { await (supabase as any).from('experience').delete().eq('id', id); load(); };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;

  return (
    <div><SectionHeader>experience</SectionHeader>
      <button onClick={() => setShowAdd(!showAdd)} className="mb-4 text-xs font-mono px-3 py-1.5 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors">{showAdd ? 'cancel' : '+ add experience'}</button>
      {showAdd && (
        <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] mb-4 space-y-3">
          <Field label="role" value={addRole} onChange={setAddRole} placeholder="Security Engineer" />
          <Field label="company" value={addCompany} onChange={setAddCompany} placeholder="Acme Corp" />
          <Field label="start_date" value={addStart} onChange={setAddStart} placeholder="2020-01" />
          <Field label="end_date" value={addEnd} onChange={setAddEnd} placeholder="2023-06 (or blank)" />
          <Field label="bullets (one per line)" value={addBullets} onChange={setAddBullets} big placeholder="Led security audits..." />
          <button onClick={add} disabled={!addRole.trim()} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 transition-colors disabled:opacity-50">add</button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((it) => {
          const [role, setRole] = useState(it.role);
          const [company, setCompany] = useState(it.company);
          const [start, setStart] = useState(it.start_date || "");
          const [end, setEnd] = useState(it.end_date || "");
          const [bullets, setBullets] = useState((it.bullets || []).join('\n'));
          return (
            <EditableRow key={it.id} id={it.id}
              fields={[
                { label: 'role', value: role, onChange: setRole },
                { label: 'company', value: company, onChange: setCompany },
                { label: 'start', value: start, onChange: setStart },
                { label: 'end', value: end, onChange: setEnd },
                { label: 'bullets', value: bullets, onChange: setBullets, big: true },
              ]}
              onSave={async () => {
                await save(it.id, { role, company, start_date: start || null, end_date: end || null, bullets: bullets.split('\n').filter(Boolean) });
              }}
              onDelete={() => remove(it.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ───── Projects ───── */

function ProjectsPanel() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addImage, setAddImage] = useState("");
  const [addLive, setAddLive] = useState("");
  const [addRepo, setAddRepo] = useState("");
  const [addYoutube, setAddYoutube] = useState("");

  const load = () => {
    (supabase as any).from('projects').select('*').order('sort').then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!addTitle.trim()) return;
    await (supabase as any).from('projects').insert({
      title: addTitle.trim(), description: addDesc.trim(), image_url: addImage.trim() || null,
      live_url: addLive.trim() || null, repo_url: addRepo.trim() || null, youtube_url: addYoutube.trim() || null,
    });
    setAddTitle(""); setAddDesc(""); setAddImage(""); setAddLive(""); setAddRepo(""); setAddYoutube("");
    setShowAdd(false); load();
  };

  const save = async (id: string, data: any) => { await (supabase as any).from('projects').update(data).eq('id', id); load(); };
  const remove = async (id: string) => { await (supabase as any).from('projects').delete().eq('id', id); load(); };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;

  return (
    <div><SectionHeader>projects</SectionHeader>
      <button onClick={() => setShowAdd(!showAdd)} className="mb-4 text-xs font-mono px-3 py-1.5 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors">{showAdd ? 'cancel' : '+ add project'}</button>
      {showAdd && (
        <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] mb-4 space-y-3">
          <Field label="title" value={addTitle} onChange={setAddTitle} placeholder="Project name" />
          <Field label="description" value={addDesc} onChange={setAddDesc} big placeholder="What does it do?" />
          <Field label="image_url" value={addImage} onChange={setAddImage} placeholder="https://..." />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--muted-foreground)]">or upload:</span>
            <FileUpload bucket="projects" onUploaded={({ url }) => setAddImage(url)} />
          </div>
          <Field label="live_url" value={addLive} onChange={setAddLive} placeholder="https://..." />
          <Field label="repo_url" value={addRepo} onChange={setAddRepo} placeholder="https://github.com/..." />
          <Field label="youtube_url" value={addYoutube} onChange={setAddYoutube} placeholder="https://youtube.com/..." />
          <button onClick={add} disabled={!addTitle.trim()} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 transition-colors disabled:opacity-50">add</button>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((p) => {
          const [title, setTitle] = useState(p.title);
          const [desc, setDesc] = useState(p.description || "");
          const [image, setImage] = useState(p.image_url || "");
          const [live, setLive] = useState(p.live_url || "");
          const [repo, setRepo] = useState(p.repo_url || "");
          const [youtube, setYoutube] = useState(p.youtube_url || "");
          return (
            <EditableRow key={p.id} id={p.id}
              fields={[
                { label: 'title', value: title, onChange: setTitle },
                { label: 'description', value: desc, onChange: setDesc, big: true },
                { label: 'image', value: image, onChange: setImage },
                { label: 'live', value: live, onChange: setLive },
                { label: 'repo', value: repo, onChange: setRepo },
                { label: 'youtube', value: youtube, onChange: setYoutube },
              ]}
              onSave={async () => { await save(p.id, { title, description: desc, image_url: image || null, live_url: live || null, repo_url: repo || null, youtube_url: youtube || null }); }}
              onDelete={() => remove(p.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ───── Certifications ───── */

function CertificationsPanel() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addIssuer, setAddIssuer] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addPdf, setAddPdf] = useState("");

  const load = () => {
    (supabase as any).from('certifications').select('*').order('sort').then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!addName.trim()) return;
    await (supabase as any).from('certifications').insert({
      name: addName.trim(), issuer: addIssuer.trim() || null, issued_on: addDate || null, pdf_url: addPdf.trim() || null,
    });
    setAddName(""); setAddIssuer(""); setAddDate(""); setAddPdf("");
    setShowAdd(false); load();
  };

  const save = async (id: string, data: any) => { await (supabase as any).from('certifications').update(data).eq('id', id); load(); };
  const remove = async (id: string) => { await (supabase as any).from('certifications').delete().eq('id', id); load(); };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;

  return (
    <div><SectionHeader>certifications</SectionHeader>
      <button onClick={() => setShowAdd(!showAdd)} className="mb-4 text-xs font-mono px-3 py-1.5 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors">{showAdd ? 'cancel' : '+ add certification'}</button>
      {showAdd && (
        <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] mb-4 space-y-3">
          <Field label="name" value={addName} onChange={setAddName} placeholder="CISSP" />
          <Field label="issuer" value={addIssuer} onChange={setAddIssuer} placeholder="ISC2" />
          <Field label="issued_on" value={addDate} onChange={setAddDate} placeholder="2024-01" />
          <Field label="pdf_url" value={addPdf} onChange={setAddPdf} placeholder="https://..." />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--muted-foreground)]">or upload:</span>
            <FileUpload bucket="certs" accept=".pdf" onUploaded={({ url }) => setAddPdf(url)} />
          </div>
          <button onClick={add} disabled={!addName.trim()} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 transition-colors disabled:opacity-50">add</button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((c) => {
          const [name, setName] = useState(c.name);
          const [issuer, setIssuer] = useState(c.issuer || "");
          const [issued, setIssued] = useState(c.issued_on || "");
          const [pdf, setPdf] = useState(c.pdf_url || "");
          return (
            <EditableRow key={c.id} id={c.id}
              fields={[
                { label: 'name', value: name, onChange: setName },
                { label: 'issuer', value: issuer, onChange: setIssuer },
                { label: 'issued_on', value: issued, onChange: setIssued },
                { label: 'pdf_url', value: pdf, onChange: setPdf },
              ]}
              onSave={async () => { await save(c.id, { name, issuer: issuer || null, issued_on: issued || null, pdf_url: pdf || null }); }}
              onDelete={() => remove(c.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ───── Videos ───── */

function VideosPanel() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");

  const load = () => {
    (supabase as any).from('videos').select('*').order('sort').then(({ data, error }: any) => { if (!error && data) setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!addTitle.trim() || !addUrl.trim()) return;
    await (supabase as any).from('videos').insert({ title: addTitle.trim(), youtube_url: addUrl.trim() });
    setAddTitle(""); setAddUrl(""); setShowAdd(false); load();
  };

  const save = async (id: string, data: any) => { await (supabase as any).from('videos').update(data).eq('id', id); load(); };
  const remove = async (id: string) => { await (supabase as any).from('videos').delete().eq('id', id); load(); };

  if (loading) return <p className="text-sm font-mono text-[var(--muted-foreground)]">Loading...</p>;

  return (
    <div><SectionHeader>videos</SectionHeader>
      <button onClick={() => setShowAdd(!showAdd)} className="mb-4 text-xs font-mono px-3 py-1.5 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0e14] transition-colors">{showAdd ? 'cancel' : '+ add video'}</button>
      {showAdd && (
        <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] mb-4 space-y-3">
          <Field label="title" value={addTitle} onChange={setAddTitle} placeholder="Talk title" />
          <Field label="youtube_url" value={addUrl} onChange={setAddUrl} placeholder="https://youtube.com/..." />
          <button onClick={add} disabled={!addTitle.trim() || !addUrl.trim()} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 transition-colors disabled:opacity-50">add</button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((v) => {
          const [title, setTitle] = useState(v.title);
          const [url, setUrl] = useState(v.youtube_url || "");
          return (
            <EditableRow key={v.id} id={v.id}
              fields={[
                { label: 'title', value: title, onChange: setTitle },
                { label: 'youtube_url', value: url, onChange: setUrl },
              ]}
              onSave={async () => { await save(v.id, { title, youtube_url: url }); }}
              onDelete={() => remove(v.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
