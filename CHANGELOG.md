# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] — unreleased

### Fixed

- Added the 19 missing Smart Delivery path parameters that made 18 published
  tools fail before HTTP, plus the documented `folderName` input.
- Corrected nested request schemas, documented integer types, and cross-field
  validation for sending, lead-list, webhook, and date-range operations.
- Corrected safety classifications for unsuspension, warmup, account updates,
  mailbox generation and account disassociation.
- CLI setup now hides every API-key character, `doctor` no longer prints key
  fragments, `.env` appends cannot concatenate lines or inject new variables,
  and the manual harness lists all API families.

### Changed

- Exposes 183 reviewed tools: 39 hand-written and 144 corrected catalog tools.
  The prior 191/194 coverage ratio was withdrawn because the documentation has
  both duplicate pages and multi-operation pages.
- Excludes malformed, secret-returning, financially consequential, duplicate,
  and request-schema-free operations until dedicated safe handling exists.
- Every exposed handler now has a mocked host/method/path/body routing test.

## [0.2.0] — 2026-08-14

Full documented API coverage, a new host pair, and an onboarding CLI.

### Added

- **191 of the 194 unique documented endpoints**, up from 39, across all four
  Smartlead hosts. Two hosts are new: `smartdelivery.smartlead.ai` (27
  endpoints) and `smart-senders.smartlead.ai` (7). Neither is reachable from the
  core base URL, so both get their own configurable base URL
  (`SMARTLEAD_DELIVERY_BASE_URL`, `SMARTLEAD_SENDERS_BASE_URL`).
- Endpoint catalog and tool factory: 152 tools are generated from the
  documentation's parameter metadata, while the 39 hand-written tools keep the
  documented ranges, enums and cross-field rules a generator cannot express.
- Onboarding CLI on the same binary — `init`, `doctor`, `config`, `tools`,
  `help`, `version`. With no arguments the binary is still purely an MCP stdio
  server. `init` and `doctor` validate the API key against
  `GET /countries?limit=1`, which is free and touches no contact data.

### Changed — read this before upgrading

- **This version can send email; 0.1.0 could not.** Ten tools can put mail in a
  real recipient's inbox, including `smartlead_utilities_send_single_email`,
  `smartlead_campaigns_reply_email_thread` and `smartlead_campaigns_forward_email`.
  All require `unrestricted` mode plus `SMARTLEAD_MCP_ALLOW_SEND=true` plus
  `confirm_send: true`, so no existing configuration gains the capability
  silently — but the capability now exists.
- Destructive tools went from 1 to 15, including campaign deletion, lead
  deletion, global unsubscribe, email-account deletion and mailbox purchase
  (`smartsenders_place_order` spends real money). All gated on
  `unrestricted` + `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE` + `confirm_destructive`.
- Safety classification is reviewed per endpoint rather than inferred from the
  HTTP verb. Smartlead serves 14 searches over `POST`; those are read-only.
  Several `DELETE`, `stop`, `suspend` and `block` routes are
  suppression-increasing and are deliberately not destructive.

### Excluded

- `email-accounts/add-smtp` and `add-oauth` require a mailbox password or OAuth
  refresh token in the request body. A tool argument passes through the model
  and the model provider, so no gate makes that acceptable.
- `campaigns/get-leads-history-bulk` documents an opaque path segment with no
  matching path parameter; its route cannot be determined without guessing.

### Security

- No tool accepts a credential-shaped argument, now enforced by a test. Optional
  credential parameters are stripped from generated schemas rather than
  excluding the whole endpoint.

## [0.1.0] — 2026-08-13

Initial release. 39 tools: complete SmartProspect coverage plus a safe minimum
of core Smartlead operations.

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
