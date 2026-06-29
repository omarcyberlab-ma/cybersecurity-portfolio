-- M6: Admin policies to close privilege escalation hole
BEGIN;

-- Placeholder: create policies allowing admins to manage user_roles and content
-- Ensure user_roles RLS and admin policy (redundant-safe)
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_manage_user_roles ON user_roles;
CREATE POLICY admin_manage_user_roles ON user_roles
	FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Allow authenticated users to read their own user_roles row
DROP POLICY IF EXISTS self_read ON user_roles;
CREATE POLICY self_read ON user_roles FOR SELECT USING (user_id = auth.uid());

-- Explicitly lock down site_settings writes to admins
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_manage_site_settings ON site_settings;
CREATE POLICY admin_manage_site_settings ON site_settings
	FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

COMMIT;
