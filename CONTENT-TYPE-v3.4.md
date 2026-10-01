# Content Type update — version 3.4

Short-form and Long-form now share one sidebar destination: **Content Type**.

1. Open Content Type and choose All, Short-form, Long-form, or a saved custom format.
2. Open a content item (or New content). In Format, choose a suggestion or replace the text with a new name, such as Carousel, Reel, Blog, Podcast or Email. Save changes.
3. A button for that format appears automatically. No separate tracker or copied content is needed.

Buttons use formats from saved content across the workspace, so you can reuse them for other clients. Results and counts use the selected client, reporting month, search and status. A custom button disappears when no saved content uses that format. Short-form and Long-form always remain available. Matching ignores capitalization and extra spaces; format names allow up to 60 characters.

All stays selected when you save from the All view. If you are viewing a specific format and change an item's Format, the selected button follows the saved item. New content starts with the selected format, or Short-form when All is selected. The calendar and workflow display the actual format names, and monthly imports accept custom formats.

## Install into your existing GitHub repository

Extract Client-Dashboard-Content-Type-Update-v3.4.zip on your desktop. Upload its folders and files to the root of camdist/clientdashboard, keeping the folder paths. Replace matching files and add the new files. Commit the upload and let your Cloudflare build run (or trigger a new deployment if automatic deployment is disabled). Refresh the dashboard after deployment.

The update also includes the prior ten-theme update and stylesheet routing fix. No new dependency, database migration or configuration change is required. It excludes wrangler.jsonc, config/app.json and passwords, so your configured D1 ID, R2 bucket, URL and secrets stay intact.

The full deployment ZIP is for a complete source copy or a fresh setup. For your existing deployment, use the smaller update ZIP.

## Quick check after deployment

Open Content Type → All. Add content with Format set to Carousel. Save and confirm its button appears. Choose Carousel and open the same item in Content calendar and Workflow to confirm the format is shared. Check another client or month: the counts should change.
