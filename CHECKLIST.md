# Personal deployment checklist

- [ ] Node/pnpm installed; dependency installation succeeds.
- [ ] Actual D1 ID, database/bucket names and website URL configured.
- [ ] D1 migration applied to your database.
- [ ] A unique password secret set in your Cloudflare account.
- [ ] Logged-out browser requests to `/`, `/api/records`, `/api/business`, and `/api/files` return an authentication prompt.
- [ ] Valid credentials open the dashboard; incorrect credentials are refused.
- [ ] A real client, project, task and payment record can be saved and survive reload.
- [ ] Upload a test file in Resources, then download it and compare its contents.
- [ ] Test all five themes; save your preference and reload.
- [ ] Link content/tasks/invoices to a project; check their summaries.
- [ ] Desktop shortcut ZIPs point to your own URL.
- [ ] Verify desktop installation in your actual browser if you want app-window access.
- [ ] Record and file backups downloaded; stored credentials excluded from Git.

This is a personal single-workspace deployment. Account-separated multi-buyer SaaS, automated social metrics, payment processing, payroll and inventory are outside this package.

## Version 3.2 feature checks

- Upload and save business/client logos; confirm they appear after reloading.
- Create an invoice with line items, discount and tax. Check its reference and total, then download/print it.
- Edit the monthly Excel template, preview and import it. Repeat to confirm duplicate skipping.
- Switch Month/Agenda and Bar/Line/Wave chart views.
