# Personal deployment checklist

- [ ] Node/pnpm installed; dependency installation succeeds.
- [ ] Actual D1 ID, database/bucket names and website URL configured.
- [ ] D1 migration applied to your database.
- [ ] A unique password secret set in your Cloudflare account.
- [ ] Logged-out browser requests to `/`, `/api/records`, `/api/business`, and `/api/files` return an authentication prompt.
- [ ] Valid credentials open the dashboard; incorrect credentials are refused.
- [ ] A real client, project, task and payment record can be saved and survive reload.
- [ ] Upload a test file in Resources, then download it and compare its contents.
- [ ] Test all ten themes; save your preference and reload.
- [ ] Link content/tasks/invoices to a project; check their summaries.
- [ ] Desktop shortcut ZIPs point to your own URL.
- [ ] Verify desktop installation in your actual browser if you want app-window access.
- [ ] Record and file backups downloaded; stored credentials excluded from Git.

This is a personal single-workspace deployment. Account-separated multi-buyer SaaS, one-click social OAuth login and scheduled syncing, payment processing, payroll and inventory are outside this package.

## Version 3.2 feature checks

- Upload and save business/client logos; confirm they appear after reloading.
- Create an invoice with line items, discount and tax. Check its reference and total, then download/print it.
- Edit the monthly Excel template, preview and import it. Repeat to confirm duplicate skipping.
- Switch Month/Agenda and Bar/Line/Wave chart views.

## Version 3.5 account and metrics checks

- Register an account under a real client and enter its exact platform ID.
- Follow its connection guide and set the matching Worker secret; never commit access tokens.
- Link a Published item to that account and its exact post. Save, then sync.
- Compare the resolved post ID and each available number with the native post report, using the same date window and metric definition.
- Check an incorrect account and an expired key: syncing should show a clear error and keep prior values.
- Confirm missing counters show Not available, and impressions are separate from views.
- Test a custom platform: registration and links work; automatic syncing is clearly unavailable.

## Version 3.6 release checks

- [ ] Read RELEASE-v3.6.md; keep working config/secrets and apply 0001_repair_client_references.sql to the existing D1 database.
- [ ] Verify reassigned projects, tasks and invoices; linked records belong to the same client.
- [ ] Preview an actual post-level CSV, check post/account matching and metrics, then import.
- [ ] Compare lifetime and reporting-period bases separately; publication month is clearly understood.
- [ ] Change timezone and check today's date/calendar highlight.
- [ ] Delete/restore a linked post and file; verify newer task edits are preserved.
- [ ] Download a full ZIP and restore into an isolated deployment; compare downloaded file bytes.
- [ ] Finish desktop/phone/keyboard checks and buyer policies before listing.
