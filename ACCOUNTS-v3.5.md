# Accounts & Post Metrics — v3.5

## Everyday use

1. Select your client. Open **Accounts & pages → Add account or page**. Choose a platform or type another platform name.
2. Save the account and open its **Connection guide**. The main three-step guide explains daily use; one-time developer setup is expandable.
3. Open a content item. Choose its **Account / Page**, paste its **Published post link / API post ID**, mark **Published**, and save.
4. Reopen the item and click **Sync metrics**. Confirm **Last synced**, the resolved post ID and its report period.

The selected account sets the content’s Channel. Links must belong to the same client. Credentials never appear in the record database or exports: the account card gives a unique Cloudflare secret name.

## Included sync adapters

| Platform | Counters included | Scope / period |
|---|---|---|
| YouTube | Views, likes, comments | Public video / Shorts lifetime counters; channel ID checked |
| TikTok | Views, likes, comments, shares | Authorized owner’s returned video counters |
| Instagram | Likes, comments; available views, reach, saves, shares | Business / Creator account, Instagram Login; up to 500 recent media searched |
| Facebook | Reactions, comments, shares | Page-owned post; other insights and personal profiles not included |
| Pinterest | Impressions, saves, Pin clicks, outbound clicks | Owner-matched Pin, last 30 complete days |
| LinkedIn | Organic impressions, likes, comments, shares, clicks | Organization share / ugcPost URN; approved access required |
| Blog, X, any custom platform | Account registration and post links | No automatic adapter included |

Not available means the provider did not return that counter. It is not replaced with zero. A failed sync keeps previous values. Changing the account or post clears the old API values. API numbers are read-only; manually reported leads and conversions stay separate.

Analytics charts can choose Views, Impressions, Reach, Saves, Reactions or Clicks independently of Bar / Line / Wave. The month groups posts by publishing date. Their counters can cover lifetime activity or a stated report period, rather than only activity in that month. Totals omit unavailable values; engagement summaries can be partial.

## Connection setup

Open the platform guide in the app, or download public/downloads/Connect-Accounts-Guide.md. Follow the expandable site-owner setup and linked official provider documentation. YouTube uses an API key for public counters. Other adapters use platform access tokens. These require an authorized owner, appropriate API permissions, and sometimes app approval.

This release has on-demand Sync metrics. It does not include one-click OAuth sign-in, OAuth callbacks, automatic token renewal or scheduled syncing. Replace expired access tokens in Cloudflare. Registering an account alone does not give API access.

## Install the update

Extract Client-Dashboard-Accounts-Update-v3.5.zip. Upload its files/folders to the root of camdist/clientdashboard, keeping all paths, replacing matching files and adding new ones. Commit and let Cloudflare build, or trigger a deployment manually. Refresh afterward.

The update is cumulative: it includes the themes, Content Type selector and stylesheet routing fixes. No dependency or D1 migration is required. Your wrangler.jsonc, config/app.json, password and existing secrets are excluded. Add per-account secrets only when following a connection guide.

Checked with TypeScript, production build, adapter fixtures and compiled Worker API tests. Live account authorization and browser testing were not performed.
