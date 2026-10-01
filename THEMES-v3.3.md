# Themes update — version 3.3

The navigation item, page heading and customization links now read Themes. The existing five styles remain available, bringing the total to ten.

| New theme | Design |
|---|---|
| Botanical Sage | Fine botanical leaves, sage and warm ivory |
| Rose Garden | Rose linework, cream and burgundy |
| Coastal Geometry | Abstract waves, arcs, ocean blue and sand |
| Midnight Bloom | Botanical outlines, deep plum and lavender |
| Golden Art Deco | Geometric fans, cream and gold-toned accents |

Decorative SVG motifs sit behind solid content panels. Each theme has a matching gallery preview. Midnight Bloom uses dark interface controls; custom accent colors and layout density remain available.

Open Themes, choose Preview theme, then Save selected theme. All styles use the same client records. Desktop theme links open the chosen style and require the existing dashboard login. Download ten desktop versions creates Windows and Mac shortcuts for all ten themes using the deployment URL in config/app.json.

The shared lib/theme-catalog.json supplies both the application and desktop-download generator. Original artwork is stored in public/themes. The previous stylesheet-routing fix is included, and new artwork also goes through the password-protected asset binding.

## Updating an existing deployment

Use Client-Dashboard-Themes-Update-v3.3.zip, which contains only changed application files and the new SVG artwork. Copy its folders into the matching project directory in GitHub and commit on the branch Cloudflare builds. If your project is nested inside client-dashboard-personal, apply the files inside that folder. Include new files as well as replacements.

The update archive excludes wrangler.jsonc, config/app.json, credentials, package.json, lockfile and database migrations. Your configured storage and website settings remain in place. No new dependency or database migration is required.

Wait for the Cloudflare build/deployment to finish, reload with Ctrl + F5, then open Themes. These files have been built and tested locally, but have not been committed or deployed to your account.

## Validation

- TypeScript and production build passed.
- All ten theme IDs save through the settings API and read back correctly.
- All five SVG assets return image/svg+xml after login; anonymous requests return 401.
- Compiled stylesheet and JavaScript return 200, with the previous routing fix retained.
- Desktop package includes ten theme.json files, ten Windows links and ten Mac links.
- Original SVG designs rendered and visually reviewed in the illustrative style preview.
- Interactive browser testing of the theme gallery has not been performed.
