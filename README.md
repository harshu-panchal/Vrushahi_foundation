# Vrushahi Foundation

Public site + admin panel for Vrushahi Foundation, built with Next.js (App
Router), Tailwind CSS, and MongoDB.

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` file (see `.env.example` for the full list):

- `MONGODB_URI` — a MongoDB connection string (MongoDB Atlas free tier works well)
- `ADMIN_EMAIL` — the email used to log in at `/admin/login`
- `ADMIN_PASSWORD_HASH` — a bcrypt hash, generated with:
  ```bash
  node scripts/hash-password.js "your-chosen-password"
  ```
- `SESSION_SECRET` — a random 32+ byte secret signing admin session tokens:
  ```bash
  openssl rand -base64 32
  ```

**Gotcha:** bcrypt hashes contain literal `$` characters, and Next.js's
`.env` file loader treats `$VAR` as variable expansion. `scripts/hash-password.js`
already escapes this for you (`\$` instead of `$`) when writing to
`.env.local` — don't hand-edit `ADMIN_PASSWORD_HASH` without escaping `$` the
same way, or login will silently fail. This only applies to `.env*` files;
values set directly in Vercel's dashboard/CLI do **not** need escaping.

## Deploying to Vercel

This repo is already linked to a Vercel project (`vrushahi-foundation`), and
the four env vars above are already set for the Production environment —
deploy with:

```bash
vercel --prod
```

or connect the GitHub repo in the Vercel dashboard for git-based deploys.

**Before your first real deploy, check MongoDB Atlas Network Access.**
Vercel's serverless functions don't have a fixed IP, so the Atlas cluster's
Network Access list needs to allow connections from anywhere
(`0.0.0.0/0`) unless you're on an Atlas tier with a static outbound IP
add-on. Without this, the site will build fine but every database call in
production will fail.

Nothing else in this codebase is Vercel-specific — no filesystem writes, no
native build steps beyond what Next.js/Vercel already handle, and `proxy.js`
(Next 16's replacement for `middleware.js`) runs on Vercel with no extra
config.
