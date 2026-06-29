-- M9: Seed default site_settings row
BEGIN;

INSERT INTO site_settings (name, title, tagline)
VALUES ('Your Name', 'Security Engineer', 'I love secure code')
ON CONFLICT (singleton) DO NOTHING;

COMMIT;
