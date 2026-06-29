-- M8: Final hardening and cleanup
BEGIN;

-- Additional security hardening and final policies
-- Ensure anon cannot read email/phone from site_settings
REVOKE SELECT (email, phone) ON site_settings FROM anon;

-- Ensure authenticated role can read all columns (admins will still be gated by has_role for edits)
GRANT SELECT ON site_settings TO authenticated;

-- Ensure service_role (server-side) retains full access
GRANT SELECT ON site_settings TO service_role;

-- Extra: make sure has_role is not callable by low-privilege roles
REVOKE EXECUTE ON FUNCTION has_role(uuid, app_role) FROM anon, authenticated, public;

COMMIT;
