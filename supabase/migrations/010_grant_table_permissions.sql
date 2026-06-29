-- M10: Grant table write permissions + restore has_role EXECUTE for authenticated
-- RLS policies (admin_*) still gate which rows each user can touch
BEGIN;

GRANT INSERT, UPDATE, DELETE ON site_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON skills TO authenticated;
GRANT INSERT, UPDATE, DELETE ON experience TO authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT INSERT, UPDATE, DELETE ON certifications TO authenticated;
GRANT INSERT, UPDATE, DELETE ON videos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON contact_submissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON user_roles TO authenticated;

-- Restore has_role EXECUTE for authenticated so RLS policies can call it
-- (M008 revoked it from anon, authenticated, public — but authenticated needs it for admin policies)
GRANT EXECUTE ON FUNCTION has_role(uuid, app_role) TO authenticated;

COMMIT;
