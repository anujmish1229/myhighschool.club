# Supabase setup

How to stand up your own Supabase backend for a local or forked copy.

## 1. Create the database

In **Supabase Dashboard → SQL Editor**, run these files in order:

1. [`supabase/schema.sql`](../supabase/schema.sql): the `templates`, `schools` and `school_managers` tables
2. [`supabase/seed.sql`](../supabase/seed.sql): the template catalog
3. [`supabase/policies.sql`](../supabase/policies.sql): Row Level Security

All three are safe to re-run.

## 2. Enable Google sign-in

1. **Authentication → Providers → Google**: enable it and add your Google OAuth client ID and secret.
2. **Authentication → URL Configuration → Redirect URLs**: add
   ```
   http://localhost:8080/dashboard
   ```
   and, for production, `https://<your-domain>/dashboard`.

After sign-in, the app sends users to `${window.location.origin}/dashboard`.
Supabase only redirects to allow-listed URLs, which is why the dev server is
pinned to port 8080 in `vite.config.ts`.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from
**Project Settings → API**. The anon key is designed to be public and ships in
the browser bundle; access control comes from the RLS policies in step 1.
Never put the `service_role` key in this app.

## 4. Try it

```bash
npm run dev
```

1. Open http://localhost:8080/login and sign in with Google.
2. Click **Create club**, search for a school (e.g. "Pickering") and enter a club slug (e.g. `robotics-club`).
3. Complete the setup wizard.
4. Make yourself a manager for that school ([docs/ADMIN.md](ADMIN.md)) and approve the club at `/manager-dashboard`.
5. Visit `/pickering-high-school/robotics-club`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `relation "schools" does not exist` | Run `supabase/schema.sql`. |
| "Template not found" when creating a club | Run `supabase/seed.sql`. |
| Sign-in redirects to the wrong place or fails | Check the Google provider is enabled and the redirect URL above is allow-listed, and that you're on port 8080. |
| Club page shows "not found" after setup | The club is still `pending`. A manager must approve it. |
| "permission denied" / "new row violates row-level security policy" | Run `supabase/policies.sql`. |
