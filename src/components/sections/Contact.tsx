import React, { useState } from 'react';
import { toast } from 'sonner';
import SectionHeader from '../layout/SectionHeader';
import Reveal from '../layout/Reveal';
import { Button, Input, Textarea, Card } from '../ui';
import { getSupabase } from '../../integrations/supabase/client';
import type { SiteSettings } from '../../integrations/supabase/types';

const socialIcons: Record<string, string> = {
  github: '⌂',
  linkedin: '▦',
  twitter: '◈',
  youtube: '►',
  email: '@',
};

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const sb = getSupabase();
      if (!sb) { toast.error('Supabase not configured'); setSubmitting(false); return; }
      const { error } = await (sb.from('contact_submissions') as any).insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      if (error) throw error;
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error('Could not save your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const socials = settings.socials || {};

  return (
    <section id="contact" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeader marker="contact" title="Get In Touch" desc="Let's talk security" />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal delay={100}>
            <Card className="p-6 h-full">
              <h3 className="font-mono text-lg mb-4 text-[var(--accent)]">Channels</h3>
              <div className="space-y-3">
                {Object.entries(socials).length > 0 ? (
                  Object.entries(socials).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors no-underline text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      <span className="text-lg">{socialIcons[key] || '▸'}</span>
                      <span className="font-mono text-sm">{key}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)] font-mono">No social links configured yet.</p>
                )}
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] text-sm font-mono text-[var(--muted-foreground)]">
                  <span className="text-lg">✉</span>
                  {settings.email || 'email not public'}
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card className="p-6">
              <h3 className="font-mono text-lg mb-4 text-[var(--accent)]">Send a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">Name</label>
                  <Input
                    placeholder="Your name"
                    maxLength={100}
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    maxLength={255}
                    required
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">Message</label>
                  <Textarea
                    placeholder="Your message..."
                    maxLength={5000}
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="default" disabled={submitting}>
                  {submitting ? 'sending...' : 'send_message'}
                </Button>
              </form>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
