-- M12: Allow anon to INSERT contact_submissions
-- M10 granted INSERT to authenticated only, but the public contact form
-- needs anon to insert. RLS policy (contact_insert_length_check) already
-- enforces length constraints for all roles.
BEGIN;

GRANT INSERT ON contact_submissions TO anon;

COMMIT;
