# Client Dashboard v3.6 — Recovery and easier analytics

This update fixes the confirmed client-reassignment bug and adds safer recovery and report imports. It remains a self-hosted dashboard for one business owner, with a single shared owner login. It is not a multi-customer hosted service.

## Update your existing GitHub / Cloudflare deployment

1. Before replacing files, save your current records using Customize → Export all records. Download important uploaded files from Resources separately. Keep a copy of your current repository and Cloudflare configuration. This is a precautionary record copy; v3.5 does not export a restorable full ZIP.
2. Extract the **v3.6 Update** ZIP and copy its contents into the root of your existing GitHub repository, replacing matching files. Keep your existing `wrangler.jsonc`, `config/app.json`, D1 database ID, R2 bucket name and Cloudflare secrets. The update ZIP intentionally omits those settings and dependency manifests.
3. **Apply the new database repair migration once** using your existing project and database configuration:

   ```bash
   pnpm exec wrangler d1 migrations apply DB --remote --config wrangler.jsonc
   ```

   Check that Cloudflare reports `0001_repair_client_references.sql` as applied. The binding in this package is named `DB`. Use your configured binding if you changed it. This migration makes the database's indexed client agree with the client saved inside each record. It creates no new tables and does not delete records.
4. Commit the updated files to GitHub and run your existing Cloudflare deployment process. For local deployment use your existing `pnpm deploy` script. If Cloudflare builds from GitHub, retain your working build and deploy settings.
5. After deployment, open Backup & restore and download your first **full backup ZIP**. Verify it saved successfully. Try a restore into a separate test deployment before relying on it for recovery.
6. Complete the live checks below before selling the product.

If a linked record created before this fix still belongs to another client, open its details and correct or unlink it. The migration aligns the index; it does not guess which client should own contradictory relationships.

## What changed

- Moving a project, task or invoice now updates both the saved client and the database index. Projects with linked records must be unlinked before a client move.
- Deleted content, resources, clients, projects, tasks, invoices and accounts go to **Trash**. Files remain stored until permanent deletion. Restore reattaches available links while preserving newer titles and notes. Restore clients and projects before dependent records. Clients with active dependent records cannot be removed; mark them Closed instead.
- **Full backup ZIP** contains current records, uploaded file bytes, file checksums and invoice-number counters. Passwords, social API keys, deployment settings and Trash are excluded.
- Restore previews additions and keeps existing records/settings. IDs already present are never overwritten. Use a fresh workspace for rollback of edits or complete recovery. Conflicting client/type identities or duplicate invoice references are rejected.
- **Import analytics CSV** maps full numeric counts to published posts in the selected account. Preview first; unmatched, ambiguous and duplicate rows are skipped. Import does not create posts. Server validation repeats the match before applying numbers.
- Analytics separates lifetime counters, each stated reporting window, and manual figures. The month selector selects **publication month**; it is not an activity-period filter.
- Customize now includes an IANA timezone, used for today's date and calendar/deadline helpers. Existing deployments default to Asia/Manila.
- A maintained disposable test runner covers data integrity, recovery and metric imports.

## Easiest analytics workflow

1. Accounts & pages → add an account under the correct client. No access token or platform account ID is needed for CSV imports.
2. In each content record, choose this account, paste its specific published post link, mark Published and save.
3. Download a **post-level CSV** report from your platform or analytics provider. Availability depends on the platform and account. Profile totals alone cannot supply individual post metrics.
4. Analytics → Import analytics CSV → choose account and file. Choose the row containing column headings and map Post link / ID plus the metrics included.
5. Select Lifetime counters or exact reporting dates. Check every matched post and column meaning; import matched rows.

Use full numbers (`1234` or quoted `"1,234"`), not `1.2K` or percentages. Blank counts remain unavailable. Views, impressions and reactions mean different things. A new import replaces the previous snapshot for those posts; it is not a historical time-series store. Leads and conversions remain manual. Supported API adapters are still optional advanced setup; no one-click OAuth, token refresh or scheduled sync was added.

Limits: CSV 2 MB, 2,000 parsed rows, 100 columns and **500 matched posts per import**. Split larger reports into smaller files. Up to 100 preview matches are displayed.

## Backup and recovery limits

Full ZIP: 200 MB total, up to 2,000 records and files, manifest 8 MB, each file 20 MB. The ZIP is uncompressed and must remain unmodified. Export needs space in your browser/device. A failed file download aborts export instead of producing an incomplete backup.

Restore validates checksums before preview and each file upload. Previews expire after one hour. Retry a paused restore, or cancel it to remove staged files that are not used by saved records. Records are added in batches; after a failure, already saved records stay saved and retry keeps them. Cancel does not roll back records already added.

For larger workspaces, use administrator-level backups of **both D1 and R2**. D1 alone does not contain uploaded file bytes. Arrange and test that process with your hosting maintainer; it is outside the browser restore feature. Do not delete working files to fit the browser limit. Expired previews that were abandoned without Cancel can leave staged R2 objects; a maintainer should inspect these before deleting them. They are excluded from normal records and backups.

Trash has no automatic expiry. It consumes storage until emptied. Account credentials live separately in Cloudflare secrets; removing a saved account does not revoke the platform token or delete its secret.

## Validation and remaining launch checks

Run from the project root after installing locked dependencies:

```bash
pnpm typecheck
pnpm build
node tests/verify-release.mjs
```

The runner uses disposable local D1/R2 and blocks external network calls. It needs the pnpm-installed Miniflare dependency supplied by Wrangler. It never uses your production credentials. See `tests/README.md`.

Before market launch, verify on the actual deployed site:

- Desktop and phone: all ten themes, keyboard navigation, dialogs, readable labels, Calendar/Agenda and logo uploads.
- Login protection for pages, API requests, downloads and uploaded files; verify D1/R2 bindings and secrets are configured.
- Create two clients, move unlinked project/task/invoice, then link only same-client records. Open several existing records after migration.
- Invoice PDF: real names, currency, totals, pagination and fonts used by your buyers. Unicode font coverage remains limited.
- Excel month-plan import, custom Content Type selection and CSV metric preview with a buyer's actual report format.
- Delete/restore a linked post and uploaded resource. Make a full backup and restore it into an isolated deployment; download every restored file.
- API connectors you intend to advertise: real platform permissions, correct post/account ownership, expired token behavior. Mock tests do not establish provider approval.
- Final buyer license, support channel, response expectations, refunds, price and hosting cost guidance. Policy drafts in this package are unfinished seller decisions.

Release verification on 1 October 2026: TypeScript check and production build passed; 106 assertions passed in disposable D1/R2 regression checks. Build emitted a large-client-chunk warning. Browser/mobile and authorized live-platform checks were not performed.

Local build and regression checks do not certify the deployed site or real platform integrations. The beta framework, large client bundles, technical initial deployment and shared owner login remain limitations. Sell as an assisted-setup or self-hosted product only after these checks pass; do not advertise instant connections, SaaS tenant isolation or automatic social publishing.
