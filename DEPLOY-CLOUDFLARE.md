# Deploy to your own Cloudflare account

## 1. Requirements and install

Install Node.js **24 LTS** and pnpm **11.25.0**. Extract the ZIP and open a terminal inside `client-dashboard-personal` (the folder containing package.json).

```sh
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm exec wrangler login
```

The lockfile pins the tested framework versions. Vinext is a beta framework in this package; preserve the lockfile during initial setup. The package has been built locally with the pinned versions. A new Cloudflare account deployment still needs verification.

## 2. Create your storage

```sh
pnpm exec wrangler d1 create client-dashboard-db
pnpm exec wrangler r2 bucket create client-dashboard-files
```

Copy the `database_id` returned by the first command. Enable R2 in your Cloudflare account if prompted. Keep the R2 bucket private; do not enable a public bucket URL.

## 3. Configure your deployment

Find your Workers account subdomain in Cloudflare. Choose a Worker name, then use its expected HTTPS URL. Replace the example values below with yours:

```sh
node scripts/configure.mjs --url https://client-dashboard-personal.YOUR-SUBDOMAIN.workers.dev --database-id YOUR-D1-DATABASE-ID
```

For different resource names:

```sh
node scripts/configure.mjs --url https://my-dashboard.YOUR-SUBDOMAIN.workers.dev --database-id YOUR-D1-DATABASE-ID --worker my-dashboard --database-name my-dashboard-db --bucket my-dashboard-files
```

Create the matching D1/R2 resource names first. The helper updates `wrangler.jsonc`, `config/app.json`, and desktop shortcut ZIPs. It does not create resources or deploy anything. Keep binding names `DB` and `BUCKET` unchanged.

## 4. Apply the database schema

```sh
pnpm db:remote
```

The supplied migration is schema-only. Later schema changes should use `pnpm db:generate`, followed by `pnpm db:remote`; keep previously applied migrations unchanged.

## 5. Set your personal password

```sh
pnpm exec wrangler secret put DASHBOARD_PASSWORD --config wrangler.jsonc
```

Enter a strong, unique password of at least 16 ASCII characters. Do not put it in shell arguments or source files. The default username is `owner`; change `DASHBOARD_USERNAME` in `wrangler.jsonc` if desired. If Wrangler asks to create a Worker with this name, confirm it. Before the secret is set, the app returns an unavailable page rather than exposing records.

## 6. Deploy

```sh
pnpm deploy
```

This checks configuration, generates your desktop packages, builds the Worker/assets and deploys the built output. Open your website. Your browser will prompt for username and password before accessing the workspace. Use HTTPS.

Authentication runs before both API and static asset requests. Keep `assets.run_worker_first: true` in the config. If the dashboard says the password is missing, set the secret using the exact Worker name from your config, then retry. The site remains inaccessible without a valid password.

## Local preview

Copy `.dev.vars.example` to `.dev.vars`, then replace its placeholder with your own development-only password. Do not use a production password for local testing.

```sh
pnpm db:local
pnpm dev
```

Open the address printed in the terminal and use username `owner` and the development password. Local D1 and R2 state live under `.wrangler/state`. They are separate from production data. For a built preview, run `pnpm build` then `pnpm preview`.

## Custom domain

Add a custom domain through your Worker's Cloudflare settings. Re-run the configuration helper with the new HTTPS origin and the same D1 database ID, then deploy again. This refreshes the desktop shortcuts to the new address. Keep a single canonical address to avoid browser credentials and desktop installations being split across origins.

## Updates and personal backups

Back up records before updating. Reuse the same D1 database ID and R2 bucket name. Do not delete those resources when replacing app code. Export records using Customize → Export all records; download uploaded files separately in Resources. A record JSON export does not include R2 file bytes and there is no general restore UI in this version.

For another owner/business, deploy a separate Worker with its own database, bucket and password. Do not distribute one shared password/database to paying customers.

## Troubleshooting

| Symptom | Check |
|---|---|
| Storage unavailable | Correct D1 ID, `DB`/`BUCKET` bindings and migrations |
| Password prompt repeats | Username `owner` (or your configured value), password secret and correct origin |
| Dashboard unavailable before login | Secret exists and is at least 16 characters, with placeholder replaced |
| Upload fails | R2 enabled, private bucket exists, file is under 20 MB |
| Desktop shortcut opens old address | Re-run configure helper and deploy; download the regenerated ZIP |
| Install button unavailable | Use the desktop browser installation menu; desktop shortcuts are also included |
| Build cannot find a package | Complete dependency install; retain Node/pnpm versions and lockfile |

## Official references checked for this package

- D1 commands/migrations: https://developers.cloudflare.com/d1/wrangler-commands/
- R2 bucket commands: https://developers.cloudflare.com/r2/reference/wrangler-commands/
- Vite plugin: https://developers.cloudflare.com/workers/vite-plugin/get-started/
- Worker-first asset authentication: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- Secrets: https://developers.cloudflare.com/workers/configuration/secrets/

The documented commands target the pinned package versions. No deployment, storage provisioning or paid service activation was performed in your account during export.
