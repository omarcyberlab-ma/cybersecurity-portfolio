# STATUS — Cybersecurity Portfolio Project

## What's Been Done

### Environment
- `.env` populated with real Supabase credentials:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `.env.example` kept clean (template with placeholder values)

### Supabase Migration Files (8 files)
All 8 migration files exist in `supabase/migrations/`:
- `001_init.sql` — Roles enum, user_roles, site_settings, content tables (skills, experience, projects, certifications, videos, contact_submissions), has_role() helper, RLS policies
- `002_length_checks.sql` — Revoke has_role from PUBLIC, contact_submission length check policy
- `003_storage_policies.sql` — Storage RLS policy for profile/projects/certs buckets
- `004_bootstrap_first_admin.sql` — Trigger function to auto-promote first signup
- `005_lock_bootstrap.sql` — Revoke execute on bootstrap fn, RLS on user_roles
- `006_admin_policies.sql` — Admin policies, self_read, site_settings write lockdown
- `007_public_grants.sql` — Column-level GRANTs hiding email/phone from anon
- `008_hardening.sql` — Final hardening, revoke has_role from anon/authenticated

## Known Issues That Need Fixing

### 1. CREATE POLICY IF NOT EXISTS — Not supported by Supabase
**Files to edit:**
- `supabase/migrations/001_init.sql` — 12 occurrences of `CREATE POLICY IF NOT EXISTS` → `CREATE POLICY`
- `supabase/migrations/003_storage_policies.sql` — 1 occurrence of `CREATE POLICY IF NOT EXISTS` → `CREATE POLICY`

### 2. 004_bootstrap_first_admin.sql — Dead trigger creation
Line 19:
```sql
PERFORM ('CREATE TRIGGER IF NOT EXISTS after_auth_user_insert ...');
```
Problems:
- `PERFORM` with a string literal does NOT execute the SQL — it's a PL/pgSQL expression that evaluates the string but never runs it as DDL
- `IF NOT EXISTS` on `CREATE TRIGGER` requires PostgreSQL ≥17; Supabase uses PG15
- **Fix:** Use a DO block with `CREATE TRIGGER` wrapped in EXCEPTION handling

## Step-by-Step to Continue

1. **Fix migration SQL files** (remove `IF NOT EXISTS` from CREATE POLICY, fix trigger in 004):
   - `001_init.sql`: Replace all `CREATE POLICY IF NOT EXISTS` → `CREATE POLICY`
   - `003_storage_policies.sql`: Replace `CREATE POLICY IF NOT EXISTS` → `CREATE POLICY`
   - `004_bootstrap_first_admin.sql`: Rewrite the trigger creation DO block

2. **Run all 8 migrations in order** using Supabase SQL Editor (paste each file's content, run one at a time):
   - `001_init.sql` (after removing IF NOT EXISTS)
   - `002_length_checks.sql`
   - `003_storage_policies.sql` (after removing IF NOT EXISTS)
   - `004_bootstrap_first_admin.sql`
   - `005_lock_bootstrap.sql`
   - `006_admin_policies.sql`
   - `007_public_grants.sql`
   - `008_hardening.sql`

3. **Create Storage Buckets** in Supabase Dashboard → Storage:
   - `profile` (private)
   - `projects` (private)
   - `certs` (private)

4. **Configure Auth** in Supabase Dashboard → Authentication → Settings:
   - Disable "Allow new signups" after first admin is created

5. **Run dev server**:
   ```
   npm run dev
   ```
   or
   ```
   bun run dev
   ```

## Quick Reference

| File | Purpose | Fix Needed? |
|------|---------|-------------|
| `001_init.sql` | Schema + RLS | Yes — remove IF NOT EXISTS on 12x CREATE POLICY |
| `002_length_checks.sql` | Policy lockdown | No |
| `003_storage_policies.sql` | Storage RLS | Yes — remove IF NOT EXISTS on 1x CREATE POLICY |
| `004_bootstrap_first_admin.sql` | First admin trigger | Yes — broken PERFORM + IF NOT EXISTS |
| `005_lock_bootstrap.sql` | Lock bootstrap fn | No |
| `006_admin_policies.sql` | Admin policies | No |
| `007_public_grants.sql` | Column GRANTs | No |
| `008_hardening.sql` | Final hardening | No |
| `.env` | Credentials | Already populated |
| `.env.example` | Template | Clean, no changes needed |
