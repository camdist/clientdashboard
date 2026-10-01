# Apply the Themes update

1. Extract this ZIP.
2. In GitHub, open the folder that contains your package.json.
3. Use Add file > Upload files. Upload the app, components, lib, scripts, worker and public folders from this ZIP so their paths match the existing project. The new theme-designs.css, theme-catalog.json and five SVG files must be included.
4. Commit the changes on the branch connected to Cloudflare.
5. Wait for deployment to succeed, then press Ctrl + F5 and open Themes.

The archive replaces changed application files only. It includes the previous stylesheet fix. It does not include your wrangler.jsonc, config/app.json, password, database migrations or dependency configuration. No migration or new dependency is required. Read THEMES-v3.3.md for theme choices and validation details.
