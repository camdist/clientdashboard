# Client Dashboard for Small Business Owners

Product assessment and buyer-theme options — 1 October 2026

## Recommended market position

Position this as a client-work and marketing operations dashboard for service businesses, consultants, agencies, freelancers, and solo owners. The original product was primarily a content-management dashboard. Contact records, delivery tracking, follow-ups, and payment visibility make the value proposition more useful to owners who need a daily operating view.

Suggested positioning: **Keep clients, work, content, and payment follow-ups connected in one customizable workspace.**

Do not describe the current version as a full accounting platform, automated CRM, inventory system, or launch-ready multi-customer SaaS. Those capabilities are not implemented.

## Essential information and variables

| Priority | Area | Variables | Decision supported | Current implementation |
|---|---|---|---|---|
| Essential | Business profile | Business name/type, reporting currency, default owner, theme, layout density | Configure the workspace without code | Saved customization |
| Essential | Client records | Business name, contact person, email, phone, website, lead source, sales stage, account owner, notes | Find the right contact and understand relationship status | Editable client profiles |
| Essential | Sales follow-up | Opportunity estimate and currency, next follow-up date, stage | Know which prospects need attention | Stage filters and due-follow-up indicators; no notifications |
| Essential | Delivery | Project name, client, due date, status, owner, budget and currency | Spot late work and assess commitments | Projects linked to tasks, content and invoices |
| Essential | Tasks | Title, owner, due date, priority, status, project/content link | Know what to do next | Task tracker and overdue summaries |
| Essential | Payments | Invoice reference, client, project, total, cumulative recorded paid amount, due date, currency, draft/sent/cancelled state | Follow up on unpaid work | Automatic invoice numbering, line-item totals and PDFs; owner-recorded payments and derived balances |
| Essential | Marketing | Campaign label, objective, priority, platform, format, publishing date, status, brief, resources | Connect marketing work to client/project delivery | Existing content calendar, trackers and workflow extended |
| Essential | Results | Views, likes, comments, shares, clicks, reported leads, reported conversions | Review content outcomes | Manually entered metrics aggregated for published content |
| Essential | Resources | Briefs, approved assets, reference links, files | Find supporting information without duplication | File/link hub linked to content records |
| Useful | Buyer preferences | Optional modules, overview widgets, custom client field labels, accent color | Adapt the dashboard to a business | Module/widget switches and up to eight custom client fields |
| Useful | Portability | Structured record export, resource/file downloads, desktop access | Keep copies and open the workspace easily | JSON export and downloadable desktop shortcuts |

## Connected information model

A client is the common link between content, projects, tasks, resources and payment records. A project can have linked tasks, content and invoices. A task can also link directly to a content item. Progress comes from linked task statuses, and invoice balances come from recorded amounts rather than a second manually entered total.

When an invoice is linked to a project, both use the same currency. Cross-client links are rejected. Projects with linked records cannot be deleted until those links are removed. Content deletion clears its linked task reference.

**Metric definitions:**

- Outstanding balance: invoice amount minus cumulative recorded paid amount, for sent invoices only.
- Overdue balance: outstanding sent invoice balance with a due date before today.
- Open projects: excludes completed and cancelled projects.
- Open tasks: excludes done tasks.
- Engagement rate: likes + comments + shares divided by reported views, for published content in the selected content month.
- Follow-ups: due client follow-up dates; this is a date-based indicator, not an automated reminder service.

The business overview reports current client/task/project state. Marketing activity uses the selected publishing month. Payment totals are displayed only in the chosen reporting currency; there is no currency conversion. Opportunity estimates have their own currency. Changing reporting currency does not convert stored money amounts.

## Usability and customization

The entry point is a business overview, followed by client setup. Empty states explain the next action. Business modules use consistent forms, searchable tables, filters, and explicit Save actions. Hidden modules keep their records. Optional summary widgets reduce clutter.

Themes are previews until saved. Buyer links open each theme on the same private workspace. They are visual versions of one application, not isolated accounts or different databases. The desktop packages are shortcuts to the online app, not offline executables.

## Five recommended design references and generated options

These are a curated selection for this product, not a measured worldwide popularity ranking. The reference products were reviewed online. The generated dashboard themes are original styles implemented in the existing app; no paid template or template license was bundled.

| Buyer version | Online reference | Design direction | Recommended buyer fit |
|---|---|---|---|
| Executive Navy | CoreUI | Dark navy navigation, crisp tables, formal reporting hierarchy | Professional services, consultants, agencies |
| Minimal Slate | shadcn/ui dashboard | White navigation, monochrome surfaces, restrained layout | Freelancers, solo owners, lean teams |
| Modern Indigo | Material Dashboard | Indigo emphasis, raised rounded cards, generous spacing | Online brands, startups, growing teams |
| Classic Teal | AdminLTE | Compact operational tables, stronger dividers, teal navigation | Local services, shops managing client work |
| Graphite Pro | Tabler | Dark graphite surfaces, bright accents, legible dark controls | Digital studios and dark-interface users |

All five preserve the same content calendar, workflow, analytics, client/project/task/payment records, resources and desktop access.

## Before accepting paying customers

The current publication is an owner-private prototype. Before selling hosted access, implement and verify separate business accounts with tenant-scoped records and file access, buyer provisioning, recovery/export controls, and a support/delivery process. The current client selector organizes clients within one business; it does not separate buyers.

Consider adding later, based on buyer demand:

1. An expense ledger and payment-event history for reliable cash-in/cash-out reporting.
2. CSV import/export and tested restore tooling, with duplicate handling.
3. Multiple deal records per client, expected close dates, pipeline goals, and campaign costs.
4. Team permissions and a client-facing approval portal.
5. Optional notifications and social-account/report integrations.

For retailers, inventory, supplier records and orders would be a separate extension. Avoid promising those in the first service-business edition.

## Research sources

- HubSpot small-business CRM: https://www.hubspot.com/products/crm/small-business
- Xero dashboard overview: https://central.xero.com/0/article/Your-Xero-dashboard
- Xero cash-flow software overview: https://www.xero.com/ph/accounting-software/analytics/cash-flow/
- CoreUI dashboard templates: https://coreui.io/templates/admin-dashboard/bootstrap/
- shadcn/ui dashboard: https://ui.shadcn.com/examples/dashboard
- Material Dashboard: https://www.creative-tim.com/product/material-dashboard
- AdminLTE: https://adminlte.io/
- Tabler admin template: https://tabler.io/admin-template

Research informed the priority choices; the buyer positioning, implementation scope, theme recommendation and roadmap are product recommendations for this dashboard.

## Version 3.2 additions

Business/client logos, billing addresses and captured invoice identity; editable line items, discounts, user-specified tax and payment terms; project-budget prefilling; monthly Excel import with preview, validation and duplicate skipping; Month/Agenda views; Bar/Line/Wave chart choices. See FEATURES-v3.2.md in the deployment package for instructions.
