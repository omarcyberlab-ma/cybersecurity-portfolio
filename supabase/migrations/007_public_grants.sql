-- M7: Column-level GRANTs for site_settings (public site hides email/phone)
BEGIN;

-- Placeholder: revoke and grant specific columns to anon/authenticated
-- Revoke broad SELECT, then grant only safe columns to anon and authenticated
REVOKE SELECT ON site_settings FROM PUBLIC;
REVOKE SELECT ON site_settings FROM anon;
REVOKE SELECT ON site_settings FROM authenticated;

GRANT SELECT (id, name, title, tagline, bio, profile_photo_url, socials, singleton, created_at, updated_at) ON site_settings TO anon, authenticated;

-- authenticated (logged-in) users will be granted access to email/phone through policies (later)

COMMIT;
