# Connect Accounts & Get the Right Post Metrics

Client Dashboard v3.5

Start in Accounts & pages. Select the correct client, add the account or Page, and follow its guide. API authorization is a one-time site-owner/developer task. This release uses Cloudflare secrets; it does not include one-click OAuth login, automatic token renewal or scheduled syncing.

## How to match the right post

1. Choose the client.
2. Choose the account or Page in content details; Channel follows it.
3. Paste the specific post link (LinkedIn: exact share/ugcPost URN).
4. Mark Published and save. Click Sync metrics.
5. Check Last synced, resolved post ID and report period.

## Store the connection key once

Open the account card → One-time Cloudflare setup. Copy its secret name. In Cloudflare, open your dashboard Worker → Settings → Variables and Secrets → Add → Secret. Paste the name and access token (YouTube: API key) as the value, then deploy. Never upload access tokens to GitHub or paste them into account fields. Replace expired tokens here.

## YouTube

Connect a YouTube channel for public video and Shorts counters.

1. Add this channel and its channel ID (starts with UC).
2. Ask the site owner to complete the one-time API-key setup below.
3. In content details, choose this account, paste the full video/Shorts link, mark Published, save, then click Sync metrics.

### One-time setup

1. Open Google Cloud Console and create or select a project.
2. Enable YouTube Data API v3. Open APIs & Services → Credentials → Create credentials → API key. Restrict the key to YouTube Data API v3.
3. Find the channel ID in YouTube → Settings → Advanced settings. Enter it in the account record.
4. Save the API key in your dashboard Worker as the secret name shown on the account card. Deploy the secret change.

Available: Views, likes and comments when available. Counters are lifetime totals.

Limits: This connector reads public counters. Watch time, shares, revenue and private videos need a separate owner-authorized YouTube Analytics integration, which is not included.

Official guide: https://developers.google.com/youtube/v3/getting-started

## TikTok

Connect the account that owns your videos.

1. Add your TikTok account.
2. Ask the site owner to authorize it through the developer setup below.
3. Choose this account in content details, paste the full /video/ link, mark Published, save and sync.

### One-time setup

1. Create an app at TikTok for Developers. Add Login Kit and Display API, configure the app and its OAuth redirect URL, and request required approval.
2. Use TikTok’s documented OAuth authorization flow for the actual account owner with user.info.basic and video.list permissions. This dashboard does not provide its own OAuth callback. A developer must complete this one-time step.
3. The authorization response gives an access token and open_id. Enter that open_id as this account’s ID.
4. Store the access token in the Worker secret shown on the account card. Replace it when it expires; automatic token renewal is not included.

Available: Views, likes, comments and shares returned for the authorized user’s videos.

Limits: Short vm.tiktok.com links must be expanded to the full video URL. Access is limited to videos belonging to the authorized account.

Official guide: https://developers.tiktok.com/docs/en/display-api-get-started

## Instagram

Connect an Instagram Business or Creator account using Instagram Login.

1. Use a professional account and add it here.
2. Ask the site owner to complete Meta’s setup below.
3. Select this account in content details, paste the /p/ or /reel/ link, mark Published, save and sync.

### One-time setup

1. Create a Meta developer app with Instagram API using Instagram Login. Follow Meta’s setup for a Business or Creator account.
2. Authorize the account with instagram_business_basic and instagram_business_manage_insights. Client accounts outside app roles may require app review and advanced access.
3. Use Meta’s documented authorization and token exchange to obtain the Instagram User access token and numeric account ID. The dashboard has no OAuth callback; a developer must perform this step.
4. Enter that account ID and the supported Graph API version shown in your app (vNN.N). Store the token as the secret on the account card. Replace it when it expires.

Available: Likes/comments plus views, reach, saves and shares when the media type and permissions support them.

Limits: Personal Instagram accounts are not supported. The connector searches the account’s 500 most recent media items. Facebook Login tokens are not interchangeable with this connector.

Official guide: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/

## Facebook

Connect a Facebook Page, rather than a personal profile.

1. Add the Page and its numeric Page ID.
2. Ask the Page administrator and site owner to finish Meta’s setup below.
3. Select the Page in content details, enter its post link or PageID_PostID, mark Published, save and sync.

### One-time setup

1. Create a Meta developer app with the Pages API. Authorize a person who can manage the target Page.
2. Follow the current Pages API guide to request pages_show_list and pages_read_engagement and obtain a Page access token. Access to clients outside app roles may require review.
3. Enter the numeric Page ID and the Graph API version shown in your app. A public page name or handle is not the numeric ID.
4. Save the Page access token in the Worker secret shown on this account card. A developer must complete authorization; no OAuth callback or token renewal is included here.

Available: Total reactions, comments and shares returned by the Page post API.

Limits: Reactions are shown separately from likes. Reach, impressions, video views, ads and personal-profile analytics are not included in this connector. Some share/Reel links require the API post ID.

Official guide: https://developers.facebook.com/docs/pages-api/

## Pinterest

Connect the Pinterest account that owns the Pins.

1. Add your account with its exact Pinterest username as the account ID.
2. Ask the site owner to finish Pinterest’s authorization below.
3. Select the account in content details, paste the full /pin/ link, mark Published, save and sync.

### One-time setup

1. Create an app in Pinterest Developers. Use the appropriate API access tier and request approval for client accounts when required.
2. Authorize the account owner through Pinterest’s OAuth flow with user_accounts:read, pins:read and the analytics access required by your app tier. A developer must complete this; the dashboard has no OAuth callback.
3. Enter the exact username, without @, as the account ID.
4. Store the access token in the Worker secret shown on the account card. Replace it when it expires; automatic renewal is not included.

Available: Impressions, saves, Pin clicks and outbound clicks for the last 30 complete days.

Limits: Pinterest impressions are not video views. Only Pins whose returned owner matches this account are accepted. Reports may be delayed; shortened pin.it links need the full destination URL.

Official guide: https://developers.pinterest.com/docs/getting-started/authentication/

## LinkedIn

Connect a LinkedIn organization Page with approved API access.

1. Add the organization Page and its numeric organization ID.
2. Ask the site owner to complete LinkedIn’s approved developer setup below.
3. Select the account and enter the exact post URN (urn:li:share:… or urn:li:ugcPost:…), mark Published, save and sync.

### One-time setup

1. Create a LinkedIn developer app linked to your organization and apply for Community Management API access.
2. Authorize an organization administrator with the reporting permissions required by the current Organization Share Statistics API. Follow LinkedIn’s current permission guide; basic Sign In access is insufficient.
3. Enter the numeric organization ID and a supported API version in YYYYMM format. Obtain the exact post share/ugcPost URN using the authorized Posts API.
4. Store the administrator access token in the Worker secret on the card. A developer must perform OAuth setup; callbacks and token renewal are not included in this dashboard.

Available: Organic impressions, likes, comments, shares and clicks returned for the organization’s post.

Limits: Personal profile and paid-ad analytics are not included. Activity IDs in public URLs are not treated as share URNs. LinkedIn limits this endpoint’s history.

Official guide: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/share-statistics

## Blog

Register a website or blog and keep each article linked to its owner.

1. Add the website name and address under the correct client.
2. Choose it in content details and save the article URL.
3. Use your website’s analytics service to view the article’s report. Automatic blog syncing is not included in this release.

### One-time setup

1. Install your chosen analytics service, such as GA4, on the website.
2. Check that the service reports visits for the exact article path.
3. For now, use the native report or switch the item to manual metrics. A GA4/service-account connector would be a separate integration.

Available: Depends on the website analytics service.

Limits: Registering a website does not grant access to its analytics or start tracking visitors.

Official guide: https://developers.google.com/analytics/devguides/reporting/data/v1

## X

Register an X account and associate its posts with the correct client.

1. Add the X account and profile address.
2. Select it in content details and save the post link.
3. View the post’s native analytics. Automatic X syncing is not included in this release.

### One-time setup

1. Access to X metrics depends on your developer API plan and authorization.
2. Keep native reports for now. Adding an X connector requires a separate supported API integration.

Available: Depends on the X account and API access.

Limits: No automatic sync adapter is included for X.

Official guide: https://docs.x.com/x-api/fundamentals/authentication/overview

## Any other platform

Type the platform name when adding an account. Save its profile or Page URL. Link its posts in content details. Custom platforms have registration and post links, but require a new API adapter before they can sync automatically. To enter numbers manually, choose Manual metrics / no linked account in content details.

## If something goes wrong

- Wrong account/post: verify the client, exact account ID and post link.
- Missing access: complete platform approval and permission setup.
- Expired access: replace the Worker secret.
- Missing metric: Not available means the API did not supply it. It is not a zero.
- Sync failed: previous saved API values are preserved.
- Counts: views, impressions, reactions and clicks have different meanings. Graphs keep them separate. Pinterest uses its stated 30-day window; other included connectors use available lifetime counters. Leads and conversions remain manual.

These steps were checked against official platform documentation on 1 October 2026. Providers may change permissions and available metrics; follow the linked official guide for app setup.
