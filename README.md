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

## Accounting module

The admin panel also includes an accounting module (`/admin/accounting`) —
chart of accounts, vouchers, parties, banks, opening balances, and the
small reference lookups (voucher types, divisions, cost centers, etc.) —
migrated from the legacy VF SQL Server database. Everything is manageable
as tabular CRUD in the admin UI; the underlying collections are `FinancialYear`,
`LookupItem`, `Ledger`, `Party`, `Bank`, `Voucher`, and `OpeningBalance`
(see `lib/models/`).

**Note:** this data model is deliberately simpler than a full double-entry
bookkeeping engine — Mongoose/MongoDB isn't a natural fit for cascading
ledger balances and atomic multi-row postings the way a relational database
is. Voucher debit/credit balance is enforced at the application layer (Zod
schema + API route), not by the database. If/when this module needs to
handle real concurrent multi-user posting at volume, migrating it to
Postgres (e.g. via Prisma) while leaving the donor/CRM side on MongoDB is
worth reconsidering.

### Re-running the SQL → MongoDB migration

`scripts/migrate-vf-sql.mjs` pulls data from the legacy SQL Server `VF`
database and upserts it into the Mongo collections above. It's idempotent —
safe to re-run any time the source data changes.

```bash
node --env-file=.env scripts/migrate-vf-sql.mjs
```

Requires `sqlcmd` on PATH able to reach the source database (defaults to
`.\SQLEXPRESS` / database `VF` — override with `VF_SQL_SERVER` /
`VF_SQL_DATABASE` env vars) and `MONGODB_URI` set, same as the app.

This first pass covers the accounting core: chart of accounts, vouchers,
parties, banks, opening balances, financial years, and lookups. Not yet
migrated (flagged during the original schema analysis as transient/derived
or legacy-app cruft, not source-of-truth data): the `tbl_AC_temp_*` trial
balance scratch tables, bank/cash day-books (`tbl_AC_book_entries` etc.),
receipts (`tbl_AC_receipt_*` — conceptually a voucher subtype, would reuse
the `Voucher` model), and the old app's own module/menu/security tables.

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
