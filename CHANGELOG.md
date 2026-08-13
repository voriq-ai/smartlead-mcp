# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — unreleased

Initial implementation. **Not published.**

### Added

- Stdio MCP server (`smartleadai-mcp` / `npx -y smartleadai-mcp`) exposing 39
  tools built from Smartlead's official API documentation.
- **Complete SmartProspect coverage** — all 26 documented endpoints on
  `https://prospect-api.smartlead.ai/api/v1/search-email-leads`: search-contacts,
  get-contacts, fetch-contacts, find-emails, search-analytics, reply-analytics,
  saved/recent/fetched searches, save-search, update-saved-search,
  update-fetched-lead, review-contacts, and the countries, states, cities,
  departments, levels, industries, sub-industries, revenue, head-counts, company,
  domain, job-title and keywords lookups.
- **13 core Smartlead operations** on `https://server.smartlead.ai/api/v1`:
  campaign list/get/create/status/analytics, campaign leads read and import,
  lead-by-email, lead lists, email accounts, and domain block list
  read/add/remove.
- Separate, independently configured clients for the two documented API hosts.
- Central safety policy with three modes (`readonly` by default) plus
  independent environment flags for credit spend, sending and destructive
  operations, and mandatory per-call boolean confirmations.
- Mandatory credit preflight for `smartprospect_fetch_contacts` that rejects —
  rather than silently reduces — a request exceeding the account's available
  credits, single-fetch limit or daily fetch limit. The preflight cannot be
  skipped and fails closed: an unavailable or unreadable analytics response
  refuses the paid request rather than proceeding.
- Per-call capability narrowing so one endpoint can be gated differently by
  argument: `smartlead_update_campaign_status` treats `START` as sending and
  `STOPPED` as destructive while leaving `PAUSED` an ordinary mutation, and
  `smartlead_add_leads_to_campaign` becomes destructive only when the request
  bypasses the global block list, unsubscribe list, cross-campaign duplicate
  protection or community bounce list.
- Normalised structured result envelope (`ok`, `operation`, `credit_spending`,
  `remote_mutation`, `data`, `pagination`, `warnings`, `error`) on every tool.
- API-key redaction across URLs, errors, error details and tool results; the key
  is environment-only and cannot be supplied as a tool argument.
- Typed error taxonomy covering authentication, permission, payment, validation,
  not-found, conflict, rate limit, server, timeout, transport, protocol and
  HTTP-200-with-`success:false` responses.
- Retries limited to safe idempotent GET requests; credit-consuming and mutating
  requests are never retried automatically.
- `include_full_records` de-identification switch on every contact-returning
  tool. Search previews default to `false`, so names and personal fields reach
  the model only when a caller opts in.
- Unit, MCP integration and opt-in read-only live test suites.

### Notes

- This project is **unofficial** and is not affiliated with, endorsed by, or
  sponsored by Smartlead.ai.
- The undocumented `POST /api/v1/verify-emails` route implemented by some
  third-party clients is deliberately **not** present; it is absent from
  Smartlead's current API reference and returns
  `404 Cannot POST /api/v1/verify-emails`.
