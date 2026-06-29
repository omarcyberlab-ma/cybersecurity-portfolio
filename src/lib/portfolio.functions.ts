import { z } from 'zod';
import { supabase } from '../integrations/supabase/client';
import type { SiteSettings } from '../integrations/supabase/types';

const FALLBACK = {
  settings: { name: 'Your Name', title: 'Security Engineer', tagline: 'I love secure code' } as SiteSettings,
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  videos: []
};

export async function getSiteData() {
  try {
    const [
      settingsRes,
      skillsRes,
      experienceRes,
      projectsRes,
      certsRes,
      videosRes
    ] = await Promise.all([
      (supabase as any).from('site_settings').select('id,name,title,tagline,bio,profile_photo_url,socials,created_at,updated_at').limit(1).single(),
      (supabase as any).from('skills').select('id,category,name,sort').order('category').order('sort'),
      (supabase as any).from('experience').select('id,role,company,start_date,end_date,bullets,sort').order('sort'),
      (supabase as any).from('projects').select('id,title,description,image_url,live_url,repo_url,youtube_url,sort').order('sort'),
      (supabase as any).from('certifications').select('id,name,issuer,issued_on,pdf_url,sort').order('sort'),
      (supabase as any).from('videos').select('id,title,youtube_url,sort').order('sort')
    ]);

    const settings = settingsRes.error ? null : settingsRes.data;
    return {
      settings: settings ?? FALLBACK.settings,
      skills: skillsRes.error ? [] : skillsRes.data,
      experience: experienceRes.error ? [] : experienceRes.data,
      projects: projectsRes.error ? [] : projectsRes.data,
      certifications: certsRes.error ? [] : certsRes.data,
      videos: videosRes.error ? [] : videosRes.data
    };
  } catch (err) {
    console.error('getSiteData failed', err);
    return FALLBACK;
  }
}

export const submitContact = async (payload: any) => {
  const schema = z.object({ name: z.string().min(1).max(100), email: z.string().email().max(255), message: z.string().min(1).max(5000) });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error('Invalid input');
  try {
    const { error } = await (supabase as any).from('contact_submissions').insert({ name: parsed.data.name, email: parsed.data.email, message: parsed.data.message });
    if (error) {
      console.error('submitContact DB error', error);
      throw new Error('Could not save your message');
    }
    return { ok: true };
  } catch (err) {
    console.error('submitContact failed', err);
    throw new Error('Could not save your message');
  }
};
