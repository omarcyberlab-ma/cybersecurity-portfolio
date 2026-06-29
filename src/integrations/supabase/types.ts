export type SiteSettings = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
  socials?: Record<string, string>;
  singleton: boolean;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  category: string;
  name: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date?: string;
  bullets: string[];
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  live_url?: string;
  repo_url?: string;
  youtube_url?: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issued_on: string;
  pdf_url?: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  youtube_url: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type SiteData = {
  settings: SiteSettings;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  videos: Video[];
};
