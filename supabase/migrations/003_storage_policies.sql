-- M3: Storage policies for buckets profile, projects, certs
BEGIN;

-- Buckets created out-of-band. Policies to restrict storage.operations to admins would be added here.
-- Example policies for storage.objects (Supabase storage schema)
-- Restrict INSERT/UPDATE/DELETE to admin users for the three private buckets
DO $$
BEGIN
	IF EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='storage' AND tablename='objects') THEN
		ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
		CREATE POLICY storage_admin_write ON storage.objects
			FOR ALL USING (bucket_id IN ('profile','projects','certs') AND has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id IN ('profile','projects','certs') AND has_role(auth.uid(), 'admin'));
		-- Allow signed URL generation and read is handled by service_role or signed URLs; explicit read policy not created here
	END IF;
EXCEPTION WHEN insufficient_privilege THEN
	RAISE NOTICE 'Skipping storage policy — insufficient privileges on storage.objects';
END$$;

COMMIT;
