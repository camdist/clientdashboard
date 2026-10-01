# Version 3.2 validation

Checked 1 October 2026 with Node.js 24.19.0 and the supplied pinned dependencies.

Passed:

- TypeScript checks and independent Vinext/Cloudflare Worker build.
- Compiled Worker authentication on pages, APIs, icons and downloads; cross-origin mutation rejection.
- Client creation/read-back, accepted logo persistence and external logo URL rejection.
- File upload/download round trip using local R2 storage.
- Invoice totals recomputed on the server, five concurrent unique references, immutable invoice references, captured billing details, discount/overpayment/oversized-total rejection.
- Complete 31-day calendar import, repeat-import duplicate skipping, reimport after editing an earlier entry, and invalid date/month/client rejection.
- Protected monthly Excel template download.
- Excel template date calculations for 31-day months, normal February and leap-year February; no formula errors in the checked workbook. Both worksheets rendered and reviewed.
- Application XLSX reader: template headers, cached formula date values, string fields, all 31 dates and malformed-file/extension rejection. XML DOM supplied by a test adapter.
- Direct PDF generation with both logos, accented Latin text, long descriptions, 32 line items, totals and page numbering. All three resulting A4 pages rendered and visually reviewed. Line items and totals are kept together at page breaks.
- Deployment URL helpers, desktop shortcuts and five theme presets carried forward from version 3.1.

Not performed:

- Deployment to your Cloudflare account or creation of production resources.
- Interactive browser testing of logo upload, chart switching, Excel import dialogs or print dialogs. Local builds and API/data tests do not replace a browser smoke test.
- Excel desktop application testing. Formula/date behavior was checked with the workbook authoring engine and exported cached values.
- Import of existing live records or uploaded files.

The build emits the framework's large-client-chunk advisory; it completes successfully. Direct PDF generation is loaded on demand. Use CHECKLIST.md for deployment and browser smoke checks in your own account.

## Version 3.3 theme update

TypeScript/build passed. All ten themes saved and read back through the compiled Worker; five SVG patterns served with the correct content type and authentication. Compiled CSS/JavaScript routing remains correct. Ten desktop preset folders verified. Illustrative SVG design preview reviewed. Live deployment and interactive browser testing were not performed.

## Version 3.4 Content Type update

TypeScript and production Worker build passed. Format discovery and All/type filtering checked, including case and whitespace matching, custom names, edits, deletion and input length limits. Compiled Worker checks passed for grouped navigation, custom-format save/edit/read-back/delete, blank/oversized/control-character rejection, custom-format calendar import and case-insensitive duplicate skipping. CSS/JavaScript authentication and all ten themes passed regression checks. Interactive browser testing and live deployment were not performed.

## Version 3.5 accounts and metrics

TypeScript and production build passed. Six provider adapters tested with controlled API response fixtures for exact post/account checks, supported counters, missing vs zero, date periods, negative LinkedIn adjustments and safe upstream errors. Built Worker tests passed for authentication and cross-origin rejection, any-platform registration, ownership/client isolation, sync with a mocked YouTube API, read-only API metric preservation, stale-value clearing after link changes, throttling, missing credentials, secret exclusion from record exports, guarded account removal and protected guide download. Earlier Content Type and theme/asset regression checks passed.

No live platform credentials were used. Real-account API permissions, provider app review, browser interactions and production deployment must be verified in the owner’s account. Connections use Cloudflare secrets: one-click OAuth, refresh-token handling and scheduled/background syncing are not implemented. Adapters expose their supported subset of metrics; registering a custom platform does not install an API adapter.
