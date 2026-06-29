-- M2: Function lockdown + contact length checks
BEGIN;

-- Example: enforce basic length checks via policy (detailed policy creation omitted in scaffold)
-- In a real migration you would create policies with WITH CHECK on contact_submissions.
-- Ensure the helper function cannot be executed by public roles directly
REVOKE EXECUTE ON FUNCTION has_role(uuid, app_role) FROM PUBLIC;

-- In case contact_submissions policy wasn't applied in M1, add a defensive check
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contact_insert_length_check ON contact_submissions;
CREATE POLICY contact_insert_length_check ON contact_submissions
	FOR INSERT
	WITH CHECK (
		char_length(name) BETWEEN 1 AND 100
		AND char_length(email) BETWEEN 3 AND 255
		AND char_length(message) BETWEEN 1 AND 5000
	);

COMMIT;
