# Release regression checks

Install dependencies using the package's pinned pnpm version, run `pnpm typecheck` and `pnpm build`, then `node tests/verify-release.mjs` from the project root. Requires Node 22.13+ (tested with Node 24).

The runner uses the built Worker in Miniflare, an isolated in-memory D1 database and R2 bucket, random fake credentials, and disabled outbound connections. No Cloudflare account or production data is used. It checks migration repair, client reassignment, protected new endpoints, strict account/post CSV matching, missing-versus-zero metrics, snapshot retention/reset, reversible deletion, related links, real file bytes, ZIP checksums, restore preview/commit/cancellation, merge conflicts and invoice counters.

These tests do not replace browser/mobile checks, testing Cloudflare account configuration, or real authorized platform requests. Rebuild after source changes so the tested Worker matches the source.
