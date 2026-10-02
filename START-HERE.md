# Client Dashboard — Personal Web Deployment

Complete self-hosting package, version 3.6 · 1 October 2026

This package contains the dashboard application, all ten themes, server APIs, D1 database schema/migration, R2 upload handling, desktop installation support, and an independent personal password gate. Deploy it to your own Cloudflare Workers account. It does not rely on ChatGPT Sites or your previous private URL.

**Recovery and analytics update:** read RELEASE-v3.6.md before updating. Apply the new repair migration, then test Backup & restore. Buyers can start with BUYER-START-HERE.md. Seller policy decisions are listed in SELLER-POLICY-DRAFTS.md.

**Accounts update:** read ACCOUNTS-v3.5.md and the simple Connect Accounts guide in public/downloads. Register any platform and link each published post to its account. API adapters require one-time platform setup.

**Content Type update:** read CONTENT-TYPE-v3.4.md for the grouped tracker and custom format instructions.

**Theme update:** read THEMES-v3.3.md for the five new illustrated themes and GitHub update instructions.

**New features:** read FEATURES-v3.2.md for logo setup, invoice automation, monthly Excel imports and chart choices.

**Start here:** read DEPLOY-CLOUDFLARE.md, install dependencies, create your database and file bucket, then run the configuration helper with your website URL.

The package is for one owner/business workspace. Your browser will prompt for the personal username/password. It is not a multi-buyer SaaS or a static HTML site for GitHub Pages. Node.js and build commands are required. Cloudflare services are subject to your own account limits and costs.

## Included

- Business overview, client profiles, projects, tasks and payment records.
- Connected content calendar, Content Type selector with All and custom formats, workflow and performance analytics.
- Accounts & pages for any platform, per-client post links, on-demand API counters for six supported platforms, and simple setup guides.
- Resources with protected file uploads/downloads, reversible Trash and checksum-verified full backup/restore.
- Reviewed post-level CSV analytics imports without API keys; distinct lifetime/period reporting bases.
- Custom workspace timezone.
- Executive Navy, Minimal Slate, Modern Indigo, Classic Teal and Graphite Pro.
- Business owner and client logo uploads, currency, owner defaults, module/widget controls and custom client fields.
- Automatic invoice numbers, editable line items, discounts, user-specified tax rates, payment terms, project-budget prefilling and PDF downloads.
- Monthly Excel template, import preview, validation and duplicate skipping; Month and Agenda calendar views.
- Bar, Line and Wave/Area channel performance charts.
- Manifest/icons/service worker for desktop web-app support.
- Desktop shortcut generators that use YOUR deployment URL.
- Source code, version lockfile, database migration, deployment guide and validation checks.

## Data

The package contains source and sample demonstration content. It does not contain records or uploaded files from the live private dashboard, credentials, node_modules, or account identifiers. Your new database is created independently. The demonstration client seeds once on first load. In v3.6, use Backup & restore → Download full backup for a ZIP of current records and uploaded files. Restore adds missing records without overwriting current work. See RELEASE-v3.6.md for limits, secrets excluded and larger-workspace recovery. Old Customize JSON exports are records-only copies and are not accepted as full backups.

Invoice numbers, totals and balances are calculated automatically. Payments received, leads and conversions are entered manually. Supported social counters can be fetched on demand after platform authorization and Cloudflare secret setup. Changing reporting currency does not convert stored monetary values. Desktop access requires internet.

## File map

| Folder/file | Purpose |
|---|---|
| `app/`, `components/`, `lib/` | User interface and APIs |
| `worker/` | Personal authentication and Worker entry point |
| `db/`, `drizzle/` | Database schema and migration |
| `public/` | Icons, desktop manifest, service worker and downloads |
| `wrangler.jsonc` | Your Cloudflare deployment configuration |
| `config/app.json` | Your website origin for desktop packages |
| `scripts/configure.mjs` | Update account bindings and website URL |
| `DEPLOY-CLOUDFLARE.md` | Step-by-step setup and update instructions |
| `CHECKLIST.md` | Personal launch checks |
| `THIRD-PARTY-NOTICES.md` | Dependency/license notices |

Keep `.dev.vars`, `.env` files and Cloudflare credentials out of Git. The ZIP includes no password: you choose one in your own account.
