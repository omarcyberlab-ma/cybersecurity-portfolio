# Migrations

The `supabase/migrations` folder contains ordered SQL files to create schema, policies, storage policies, and hardening steps.

Apply migrations using the Supabase CLI or `psql` against your Postgres instance.

Using the Supabase CLI:

```bash
supabase login
supabase projects list
supabase db remote set <PROJECT_REF>
supabase db reset # optional: resets local DB
supabase db push --file supabase/migrations
```

Using psql (example):

```bash
psql "postgres://postgres:password@db-host:5432/postgres" -f supabase/migrations/001_init.sql
psql "postgres://..." -f supabase/migrations/002_length_checks.sql
# ...repeat through 008_hardening.sql
```

Order matters — run `001_init.sql` through `008_hardening.sql` in sequence.
