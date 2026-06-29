-- M11: Allow anon to SELECT site_settings rows
-- RLS was enabled on site_settings in M1, but no public SELECT policy was created
-- (unlike skills, experience, etc. which have public_select_on_* policies).
-- Column-level grants in M7 already restrict anon to safe columns only.
BEGIN;

CREATE POLICY public_select_on_site_settings ON site_settings
  FOR SELECT USING (true);

COMMIT;
