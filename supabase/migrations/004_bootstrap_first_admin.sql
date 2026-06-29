BEGIN;

CREATE OR REPLACE FUNCTION bootstrap_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
	-- If any admin exists, do nothing
	IF EXISTS(SELECT 1 FROM user_roles WHERE role = 'admin') THEN
		RETURN NEW;
	END IF;
	INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
	RETURN NEW;
END;
$$;

-- Create trigger on auth.users table (Supabase managed)
DO $$
BEGIN
	IF EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='auth' AND tablename='users') THEN
		EXECUTE 'CREATE TRIGGER after_auth_user_insert AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION bootstrap_first_admin();';
	END IF;
EXCEPTION WHEN duplicate_object THEN
	NULL;
END$$;
COMMIT;
