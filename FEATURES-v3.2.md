# Updates in version 3.2

## Logos

Open **Customize** to upload the business owner logo. Open a profile in **Clients** to upload a client logo and add its billing address. PNG and JPG files up to 5 MB are accepted; the application resizes them. Save the profile or customization to keep the logo. Logos appear in navigation, client selection and invoices.

## Invoices

In **Customize**, enter your business email, billing address, default due period, tax rate and payment instructions.

In **Payments**, add an invoice, choose a client and enter its line items. Optionally link a project and choose **Fill line item from project budget**. This replaces the current lines with one project-budget line, so review it before saving. Add discounts or edit the tax rate as needed.

The server rounds each line to two decimal places, sums those lines, subtracts the fixed discount, and calculates tax on the discounted subtotal. It assigns a number such as `INV-2026-00001` when you save. Numbers stay the same on later edits; deleted or abandoned numbers are not reused. Tax rates are supplied by the owner, not selected from jurisdiction rules.

Saved invoices provide **Download PDF** and **Print / Save as PDF** actions. The printable version supports browser fonts for names that the direct PDF font cannot encode. Invoices include line items, logos, billing details, total, paid amount, balance and payment instructions.

Business and client billing details are captured on the first save, so later profile edits do not change an existing invoice. Changing its client takes a fresh snapshot. Clear the project link first if changing clients.

Legacy invoices retain their amounts. Opening one represents its amount as a single line; the server assigns a reference when it is saved. Received payments are still recorded by the owner. The application does not send invoices by email, run background recurring billing, charge customers or connect to a bank.

## Monthly planning in Excel

Use **Content calendar → Excel month template** to download `Monthly-Content-Plan-Template.xlsx`.

1. In **Instructions**, set **B2** to the first day of the month.
2. In **Plan**, fill in titles and choose format, platform and status. Dates populate for the whole month. Blank titles are skipped.
3. Add rows for multiple posts on the same date. Enter a real Excel date or YYYY-MM-DD in each added row.
4. Save in Excel so formula results are stored. Keep the sheet name **Plan** and its row 1 headers.
5. Select the intended client and the same month in the dashboard, then choose **Upload monthly plan**.
6. Review the preview, fix all errors and click **Import plan**.

Imports accept .xlsx files under 2 MB with up to 366 posts. All dates must belong to the selected month. Invalid rows block the entire import. Matching date/title/format/platform combinations are skipped, and existing records are preserved. Imported posts appear in the calendar, trackers and workflow. Metrics begin at zero; project/resource links can be added after import.

The importer reads cached Excel formula results and does not execute formulas or macros. Workbooks saved by tools that omit calculated values may require recalculation and saving in Excel first. Excel uploads require a modern browser with DecompressionStream support.

Use **This month** to return to the current month. **Agenda** provides a chronological list for small screens; **Month** shows the calendar grid.

## Chart choices

In **Analytics → Channel performance**, select **Bar**, **Line** or **Wave / area**. The same selector is available in Content overview. Your choice is remembered in that browser. All options use the same published-content views, selected client and selected month.

Channels are categories. Lines and curves compare channel totals; they are not a timeline. Social metrics remain entered manually.

## Deployment

This package has not been deployed. Follow DEPLOY-CLOUDFLARE.md when ready. No new database migration is needed: these features use existing records storage. The package contains demonstration data and no personal credentials or live workspace records.
