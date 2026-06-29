-- M1: Roles, helpers, content tables
-- Creates app_role enum, user_roles table, has_role helper, site_settings singleton and content tables

BEGIN;
-- enum
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- site_settings (singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean DEFAULT true UNIQUE,
  name text,
  title text,
  tagline text,
  bio text,
  email text,
  phone text,
  profile_photo_url text,
  socials jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- content tables (skills, experience, projects, certifications, videos, contact_submissions)
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text,
  name text,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text,
  company text,
  start_date date,
  end_date date,
  bullets text[],
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text,
  live_url text,
  repo_url text,
  youtube_url text,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  issuer text,
  issued_on date,
  pdf_url text,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  youtube_url text,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- helpers: ensure uuid generator extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- set_updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- attach trigger to tables that have updated_at
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='updated_at') THEN
    EXECUTE 'CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();';
  END IF;
END$$;

-- SECURITY DEFINER helper: has_role(user_id, role)
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = _user_id AND ur.role = _role);
$$;

-- Enable RLS on content tables and add basic policies
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read for most content tables
CREATE POLICY public_select_on_content
  ON skills FOR SELECT USING (true);
CREATE POLICY public_select_on_experience
  ON experience FOR SELECT USING (true);
CREATE POLICY public_select_on_projects
  ON projects FOR SELECT USING (true);
CREATE POLICY public_select_on_certifications
  ON certifications FOR SELECT USING (true);
CREATE POLICY public_select_on_videos
  ON videos FOR SELECT USING (true);

-- Admin-only write for content tables
CREATE POLICY admin_write_on_content
  ON skills FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY admin_write_on_experience
  ON experience FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY admin_write_on_projects
  ON projects FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY admin_write_on_certifications
  ON certifications FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY admin_write_on_videos
  ON videos FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- contact_submissions: allow anyone to insert but enforce length checks; only admins may select
CREATE POLICY contact_insert_length_check
  ON contact_submissions FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(message) BETWEEN 1 AND 5000
  );
CREATE POLICY contact_select_admin_only
  ON contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'));

COMMIT;
