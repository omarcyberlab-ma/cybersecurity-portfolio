# Cybersecurity Portfolio — Starter

This repository is a scaffold implementing a self-hostable single-admin portfolio using:
- TanStack Start (React + Vite)
- Cloudflare Workers SSR
- Tailwind v4 (token-based inline theme)
- Supabase (Auth, Postgres, Storage)
- TanStack Query + Router

This scaffold contains minimal working files and SQL migrations (placeholders) to get you started.

Quickstart
----------

1. Copy `.env.example` to `.env` and populate values.
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Apply migrations to your Supabase/Postgres instance (see `MIGRATIONS.md`).

4. Run the dev server:

```bash
npm run dev
```

Notes
-----
- The migrations are ordered and include RLS policies. Review them before applying to production.
- Upload your real CV to `public/cv.pdf`.

See `supabase/migrations` for migration files and `src/` for application code.
