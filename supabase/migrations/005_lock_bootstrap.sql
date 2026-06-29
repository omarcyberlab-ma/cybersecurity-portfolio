-- M5: Revoke execute on bootstrap function
BEGIN;

-- Revoke EXECUTE to reduce attack surface (scaffold placeholder)
REVOKE EXECUTE ON FUNCTION bootstrap_first_admin() FROM PUBLIC;

-- Additionally restrict direct modifications to user_roles to admins only via policies
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_manage_user_roles ON user_roles;
CREATE POLICY admin_manage_user_roles ON user_roles
	FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

COMMIT;
