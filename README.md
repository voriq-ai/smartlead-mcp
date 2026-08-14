# smartleadai-mcp

> **Unofficial MCP integration for Smartlead. This project is not affiliated with, endorsed by, or sponsored by Smartlead.ai.**

A [Model Context Protocol](https://modelcontextprotocol.io) server for the
**Smartlead API**, with complete **SmartProspect** coverage, for MCP-capable
agents and clients.

**183 safety-reviewed tools across all four Smartlead API hosts.** The official
reference cannot be represented honestly as a simple tool-count ratio: it has
duplicate pages, and one page combines four different API-key methods. Unsafe,
duplicate, financially consequential, and undocumented operations are excluded
with recorded reasons — see
[`docs/endpoint-coverage.md`](docs/endpoint-coverage.md).

That includes **all 26 documented SmartProspect endpoints**, the prospecting
product other Smartlead MCP servers omit entirely.

Everything is built from Smartlead's public official documentation. Exposed
routes, methods, parameters, corrections, and known documentation gaps are listed in
[`docs/endpoint-coverage.md`](docs/endpoint-coverage.md).

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Requirements](#requirements)
- [Installation](#installation)
- [Client configuration](#client-configuration)
- [Environment variables](#environment-variables)
- [Safety modes](#safety-modes)
- [Tool reference](#tool-reference)
- [The SmartProspect workflow](#the-smartprospect-workflow)
- [Controlling credit spend](#controlling-credit-spend)
- [Error handling](#error-handling)
- [Privacy and security](#privacy-and-security)
- [Development](#development)
- [Publishing checklist](#publishing-checklist)
- [Official Smartlead documentation](#official-smartlead-documentation)
- [Known limitations](#known-limitations)
- [Licence](#licence)

---

## Why this exists

Smartlead's SmartProspect family lives on a **different API host** from the rest
of the Smartlead API, and its most useful operations **spend prospecting
credits**. Existing third-party tooling either omits SmartProspect entirely or
targets routes that are not in Smartlead's current API reference (for example
`POST /api/v1/verify-emails`, which returns `404 Cannot POST
/api/v1/verify-emails`). This package:

- talks to **all four** documented Smartlead hosts, correctly and separately;
- never implements an undocumented route — there is no `verify_emails` tool here;
- treats credit spend as a privileged action that requires two independent
  approvals before any HTTP request is made;
- returns structured JSON envelopes instead of prose, so an agent can branch on
  the result.

## Requirements

- **Node.js 20.19 or newer.** CI runs the full verification suite on 20.19 (the
  declared floor) and 22 on every push.
- A Smartlead API key with SmartProspect access.

## Installation

Run it directly with `npx` (no install step):

```bash
SMARTLEAD_API_KEY=sl_your_key npx -y smartleadai-mcp
```

Or install it and use the `smartleadai-mcp` bin:

```bash
npm install -g smartleadai-mcp
SMARTLEAD_API_KEY=sl_your_key smartleadai-mcp
```

The server speaks MCP over **stdio**. Started by hand it will simply wait for a
client on stdin; that is expected.

## Command line

The same binary is an MCP server when run with no arguments, and a small helper
CLI when given a subcommand.

```bash
smartleadai-mcp init       # interactive setup: verify the key, print client config
smartleadai-mcp doctor     # check configuration and validate the key
smartleadai-mcp config     # print effective configuration (credential redacted)
smartleadai-mcp tools      # list tools with their safety classification
smartleadai-mcp help
```

Start here:

```bash
npx -y smartleadai-mcp init
```

`init` verifies the key, asks which safety mode you want, then prints
ready-to-paste config for Claude Desktop, Claude Code and Hermes. It offers to
write a local `.env` (mode `0600`) but never overwrites an existing key.

`doctor` diagnoses a broken setup:

```
✓ configuration  valid
  key            <configured; hidden>
  mode           readonly  (default — no writes, no credit spend)
  credit spend   disabled
✓ api key        accepted by Smartlead
✓ tools          183 registered
```

Both validate the key against `GET /countries?limit=1` — free, read-only, and
touching no contact data, so diagnosing a setup can never spend credits or pull
a prospect record. The CLI never prints any character from the configured key.

## Client configuration

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["-y", "smartleadai-mcp"],
      "env": {
        "SMARTLEAD_API_KEY": "sl_your_key",
        "SMARTLEAD_MCP_MODE": "readonly"
      }
    }
  }
}
```

### Hermes

Add this under `mcp_servers` in `~/.hermes/config.yaml` (use
`hermes config path` to locate the active profile's file):

```yaml
mcp_servers:
  smartlead:
    command: "npx"
    args: ["-y", "smartleadai-mcp"]
    env:
      SMARTLEAD_API_KEY: "sl_your_key"
      SMARTLEAD_MCP_MODE: "readonly"
      SMARTLEAD_MCP_ALLOW_CREDIT_SPEND: "false"
```

Restart Hermes, then verify with `hermes mcp test smartlead`. Hermes filters the
subprocess environment, so the API key must be present in this server's `env`
mapping rather than merely exported in an unrelated shell.

### Any other stdio MCP client

Launch the process with the API key in its environment and speak MCP over
stdin/stdout:

```jsonc
{
  "command": "npx",
  "args": ["-y", "smartleadai-mcp"],
  "transport": "stdio",
  "env": { "SMARTLEAD_API_KEY": "sl_your_key" }
}
```

Programmatic use (for embedding in your own host):

```ts
import { createServer, loadConfig } from 'smartleadai-mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const { server } = createServer(loadConfig());
await server.connect(new StdioServerTransport());
```

## Environment variables

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `SMARTLEAD_API_KEY` | **yes** | — | Read from the environment only. It can never be passed as a tool argument. |
| `SMARTLEAD_CORE_BASE_URL` | no | `https://server.smartlead.ai/api/v1` | Core Smartlead host. |
| `SMARTLEAD_PROSPECT_BASE_URL` | no | `https://prospect-api.smartlead.ai/api/v1/search-email-leads` | SmartProspect host. |
| `SMARTLEAD_DELIVERY_BASE_URL` | no | `https://smartdelivery.smartlead.ai/api/v1` | Smart Delivery host. |
| `SMARTLEAD_SENDERS_BASE_URL` | no | `https://smart-senders.smartlead.ai/api/v1` | Smart Senders host. |
| `SMARTLEAD_MCP_MODE` | no | `readonly` | `readonly` \| `standard` \| `unrestricted`. |
| `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND` | no | `false` | Literal `true`/`false`. |
| `SMARTLEAD_MCP_ALLOW_SEND` | no | `false` | Literal `true`/`false`. |
| `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE` | no | `false` | Literal `true`/`false`. |
| `SMARTLEAD_MCP_TIMEOUT_MS` | no | `30000` | Per-request timeout, 1000–600000. |
| `SMARTLEAD_MCP_MAX_RETRIES` | no | `2` | Extra attempts, 0–5. **Applies to safe GETs only.** |
| `SMARTLEAD_LIVE_TESTS` | no | `false` | Development only; enables the opt-in read-only live test suite. |

Boolean flags accept only the literal strings `true` and `false` (case
insensitive). `1`, `yes` and `on` are rejected so a typo can never silently
enable spending.

See [`.env.example`](.env.example).

## Safety modes

| | `readonly` (default) | `standard` | `unrestricted` |
| --- | --- | --- | --- |
| Read-only operations | allowed | allowed | allowed |
| Remote mutations (saved searches, campaign drafts, lead import, block-list add) | **blocked** | allowed | allowed |
| Credit spending | **blocked** | needs env flag **and** `confirm_credit_spend: true` | needs env flag **and** `confirm_credit_spend: true` |
| Sending / campaign activation | **blocked** | **blocked** | needs `SMARTLEAD_MCP_ALLOW_SEND=true` **and** `confirm_send: true` |
| Destructive operations | **blocked** | **blocked** | needs `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true` **and** `confirm_destructive: true` |
| Lead import | **blocked** | needs `confirm_import: true` | needs `confirm_import: true` |

Rules that hold in **every** mode:

1. A confirmation field must be boolean `true`. `"true"`, `1` and `"yes"` are
   rejected. There is no confirmation field that defaults to `true`.
2. A blocked call is refused **before** any HTTP request is made, so a blocked
   credit-spending call costs nothing.
3. Refusals come back as a normal structured envelope with
   `error.kind: "policy"`, a machine-readable `error.code`, and an
   `error.requirements` array telling the operator exactly what to change.

## Tool reference

183 tools across four hosts. The full table would be unreadable here, so list
them from the CLI instead — it prints each tool's safety classification:

```bash
smartleadai-mcp tools              # all 183
smartleadai-mcp tools campaign     # filter by substring
```

| Host | Base URL | Tools | Prefix |
| --- | --- | --- | --- |
| SmartProspect | `prospect-api.smartlead.ai/api/v1/search-email-leads` | 26 | `smartprospect_` |
| Core | `server.smartlead.ai/api/v1` | 128 | `smartlead_` |
| Smart Delivery | `smartdelivery.smartlead.ai/api/v1` | 24 | `smartdelivery_` |
| Smart Senders | `smart-senders.smartlead.ai/api/v1` | 5 | `smartsenders_` |

By safety classification:

| Classification | Tools | Gate |
| --- | --- | --- |
| Read-only | 113 | none — available in every mode |
| Remote mutation | 70 | `standard` mode or above |
| Sends email | 10 | `unrestricted` + `ALLOW_SEND` + `confirm_send` |
| Destructive | 12 | `unrestricted` + `ALLOW_DESTRUCTIVE` + `confirm_destructive` |
| Consumes credits | 2 | `ALLOW_CREDIT_SPEND` + `confirm_credit_spend` + preflight |

Classification is reviewed per endpoint, not inferred from the HTTP verb.
Smartlead serves 14 searches over `POST` — those are read-only. Several
`DELETE` and `stop`/`suspend`/`block` routes are suppression-increasing and are
deliberately **not** destructive, so the safe action is never harder to take
than the dangerous one.

Every tool returns the same envelope:

```json
{
  "ok": true,
  "operation": "smartprospect_search_contacts",
  "credit_spending": false,
  "remote_mutation": false,
  "data": { "list": [] },
  "pagination": { "scroll_id": "…", "filter_id": 327105, "total_count": 16064669 },
  "warnings": []
}
```

## The SmartProspect workflow

SmartProspect separates *searching* (free) from *revealing* (paid). The tools
mirror that split.

**1. Inspect credits.** Always first, always free.

```jsonc
// smartprospect_get_search_analytics
{}
// → data.availableCredits { available, total, used }, maxSingleFetchLimit, maxDailyFetchLimit
```

**2. Build valid filter values.** Free lookups: `smartprospect_list_countries`,
`_list_states`, `_list_cities`, `_list_industries`, `_list_sub_industries`,
`_list_departments`, `_list_seniority_levels`, `_list_head_counts`,
`_list_revenue_ranges`, `_list_companies`, `_list_domains`, `_list_job_titles`,
`_list_keywords`.

**3. Search previews.** Free. Returns a page of candidates plus the `filter_id`
you will need later, the `total_count` of matches, and a `scroll_id` for the
next page. Preview records are de-identified by default; set
`include_full_records: true` only when names and personal fields are needed.

```jsonc
// smartprospect_search_contacts
{
  "limit": 25,
  "title": ["Head of Growth"],
  "country": ["United States"],
  "companyHeadCount": ["25 - 100"],
  "titleExactMatch": false
}
```

**4. Review candidates.** Page with `scroll_id`, narrow the filters, and — if
you want to avoid sending personal data to the model at all — pass
`include_full_records: false` to receive a de-identified summary.

Optionally persist the filter:

```jsonc
// smartprospect_save_search   (standard mode or above)
{ "search_string": "US Heads of Growth, 25-100", "title": ["Head of Growth"], "country": ["United States"] }
```

**5. Intentionally reveal selected contacts.** This is the step that spends
credits, and it is doubly gated.

```jsonc
// smartprospect_fetch_contacts   (needs SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true)
{ "filter_id": 327105, "limit": 50, "visual_limit": 50, "confirm_credit_spend": true }
```

or, for a handful of named people you already know:

```jsonc
// smartprospect_find_emails      (max 10 per call)
{
  "contacts": [{ "firstName": "Ada", "lastName": "Lovelace", "companyDomain": "example.com" }],
  "confirm_credit_spend": true
}
```

**6. Retrieve contacts you already paid for.** Free — never re-fetch.

```jsonc
// smartprospect_get_contacts
{ "filter_id": 327105, "limit": 100, "offset": 0, "verification_status": "valid" }
```

Use `smartprospect_list_fetched_searches` to find filters whose contacts have
already been revealed, and `smartprospect_review_contacts` to re-sync a filter's
metrics.

## Controlling credit spend

Credit-consuming tools are gated at three independent layers:

1. **Process configuration.** `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true` must be
   set in the server's environment. Without it, the tool refuses and no HTTP
   request is made.
2. **Per-call confirmation.** The call must include `confirm_credit_spend: true`
   as a real boolean.
3. **Credit preflight** (`smartprospect_fetch_contacts` only). Before the paid
   request, the tool calls the free `search-analytics` endpoint and compares the
   requested quantity against `availableCredits.available` and
   `maxSingleFetchLimit`. If the request exceeds either, it is **rejected with
   an explanation — never silently reduced**. The preflight result is returned
   in `data.credit_preflight`.

```jsonc
// Refused: env flag not set. No request was sent to Smartlead.
{
  "ok": false,
  "operation": "smartprospect_fetch_contacts",
  "credit_spending": false,
  "remote_mutation": false,
  "data": null,
  "pagination": null,
  "warnings": [],
  "error": {
    "kind": "policy",
    "code": "credit_spend_disabled",
    "message": "This operation can consume SmartProspect credits and credit spending is disabled.",
    "requirements": ["Set SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true and restart the MCP server."]
  }
}
```

```jsonc
// Refused: request larger than the balance. Only the free preflight ran.
{
  "ok": false,
  "error": {
    "kind": "refusal",
    "code": "insufficient_credits",
    "message": "Requested 900 contact(s) but only 100 SmartProspect credit(s) are available. The request was not sent and no credits were spent.",
    "requirements": ["Reduce the request to 100 or fewer.", "Or top up SmartProspect credits in the Smartlead dashboard."]
  }
}
```

Neither credit-consuming request is **ever** retried automatically. Retries are
enabled only for safe idempotent GETs.

The preflight cannot be skipped. If analytics is unavailable or does not return
recognisable credit and account-limit fields, the paid request fails closed.

## Error handling

Failures never throw across the MCP boundary. They come back as an envelope with
`ok: false` and a typed `error.kind`:

| `error.kind` | Meaning |
| --- | --- |
| `policy` | Blocked locally by the safety policy. **No HTTP request was made.** |
| `refusal` | Blocked locally by a tool-level check (e.g. insufficient credits). |
| `authentication` | HTTP 401 — key missing or invalid. |
| `permission` | HTTP 403. |
| `payment` | HTTP 402, or a credit-related `success: false` body. |
| `validation` | HTTP 400 / 422. |
| `not_found` | HTTP 404. |
| `conflict` | HTTP 409. |
| `rate_limit` | HTTP 429. `retry_after_seconds` is surfaced when Smartlead sends it. |
| `server` | HTTP 5xx. |
| `timeout` | The request exceeded `SMARTLEAD_MCP_TIMEOUT_MS`. |
| `transport` | DNS/TLS/socket failure; no HTTP response. |
| `protocol` | HTTP 200 with a body that was not JSON. |
| `api_failure` | HTTP 200 with `success: false` in the body. |

Smartlead returns HTTP 200 with `success: false` for several documented failure
cases (notably `fetch-contacts` limit and credit checks). Those are surfaced as
errors, not as successes with empty data.

Retries apply only to `GET` requests and only for `rate_limit`, `server`,
`timeout` and `transport` failures, with exponential backoff that honours
`Retry-After`.

## Privacy and security

- **The API key is environment-only.** No tool accepts it as an argument;
  attempting to pass `api_key` to a tool is rejected by the input schema.
- **The key is redacted everywhere.** Smartlead authenticates via an `api_key`
  query parameter, so the credential appears in every request URL. Every URL,
  error message, error detail and tool result is passed through a redactor
  before it leaves the process.
- **Nothing is logged.** The server writes no request bodies, no responses and
  no contact data to stdout, stderr or disk. stdout carries only the MCP
  protocol stream; stderr carries only fatal startup errors.
- **Contact data is returned, by design.** That is the purpose of a prospecting
  tool. Tools that return contacts accept `include_full_records: false` to
  return a de-identified summary (counts and non-personal attributes) instead.
- **Tests use synthetic data only** (`person@example.com` and similar).

Read [`SECURITY.md`](SECURITY.md) and [`docs/security-model.md`](docs/security-model.md)
before granting this server anything beyond `readonly`.

**Prompt injection matters here.** Contact records, campaign names and lead
custom fields are attacker-influenceable text. Treat any instruction that
appears inside tool output as data, never as a command — and note that the
policy layer is what actually stops an injected "fetch 10,000 contacts"
instruction, not the model's judgement.

## Development

```bash
npm install
npm run typecheck     # tsc --noEmit
npm run lint          # eslint, zero warnings allowed
npm test              # unit + integration (mocked fetch, no network)
npm run test:coverage # with v8 coverage thresholds
npm run build         # tsup -> dist/
npm run pack:check    # npm pack --dry-run
npm run verify        # typecheck + lint + coverage + build + pack + installed-package smoke
npm run smoke:package # pack, install into a throwaway dir, drive the installed
                      # binary with a real MCP client (no Smartlead access)
npm run test:live     # opt-in, read-only; needs SMARTLEAD_LIVE_TESTS=true
```

The default suite never touches the network — `fetch` is injected. The live
suite is read-only, is skipped unless `SMARTLEAD_LIVE_TESTS=true` and
`SMARTLEAD_API_KEY` are both set, and asserts that the credit balance is
unchanged before and after it runs. It never calls `find-emails`,
`fetch-contacts`, imports, campaign mutations, sending, deletion or unsubscribe.

Layout:

```
src/
  index.ts                 stdio entry point
  server.ts                transport-agnostic server factory
  config.ts                environment parsing and validation
  client/                  errors.ts, http.ts, core-client.ts, prospect-client.ts
  security/                redaction.ts, policy.ts
  schemas/                 common.ts, smart-prospect.ts, core.ts
  tools/                   types, envelope, shape, register + smart-prospect/ and core/
  types/                   loose Smartlead response types
tests/                     unit/, integration/, live/, helpers/
docs/                      endpoint-coverage.md, security-model.md, publishing.md
```

Adding an HTTP/Streamable HTTP transport later means adding a new entry point
that calls `createServer()` and attaches a different transport. No tool, schema
or client change is required.

## Publishing checklist

Nothing here has been published. See [`docs/publishing.md`](docs/publishing.md)
for the full procedure. Summary:

1. Run `npm run verify` for typecheck, lint, coverage, build, pack dry-run and a
   clean installed-package MCP smoke test. `prepublishOnly` repeats every check
   except the nested pack/install smoke, which npm cannot run recursively while
   already preparing a publish.
2. Confirm the packed file list contains only `dist/`, the public Markdown
   documentation, `.env.example`, and `package.json`.
3. Confirm you are authenticated on npm. The name is unscoped, so no scope
   membership is needed — but nothing reserves it either until it is published.
4. Tag, publish with `--access public` (optionally `--provenance`), then run a
   post-publication smoke test from a clean directory.

## Official Smartlead documentation

- Introduction — <https://api.smartlead.ai/introduction>
- Authentication — <https://api.smartlead.ai/authentication>
- Machine-readable index — <https://api.smartlead.ai/llms.txt> and <https://api.smartlead.ai/llms-full.txt>
- Rate limits — <https://api.smartlead.ai/guides/rate-limits>
- Error handling — <https://api.smartlead.ai/guides/error-handling>
- SmartProspect reference — <https://api.smartlead.ai/api-reference/smart-prospect/search-contacts> (and siblings)

Per-endpoint source pages, with the date each was checked, are listed in
[`docs/endpoint-coverage.md`](docs/endpoint-coverage.md).

## Known limitations

- **Unsafe or undocumented operations are excluded.** These include mailbox
  credential ingestion, client API-key management, live OTP retrieval, domain
  purchases, and sending or Smart Delivery operations whose request schema is
  absent from the official page. A duplicate lead-update page is also collapsed
  into the canonical tool. See `docs/endpoint-coverage.md` for the full list.
- **Most tools are catalog-generated.** The 39 hand-written tools encode every
  documented range, enum and cross-field rule (such as the `id`/`filter_id`
  XOR). Another 144 are generated from corrected documentation metadata. The
  correction layer removes flattened nested fields, fixes documented integer
  types, applies reviewed safety overrides, and enforces known cross-field rules.
- **This server can send email.** With `unrestricted` mode plus
  `SMARTLEAD_MCP_ALLOW_SEND=true`, 10 tools can put mail in a real recipient's
  inbox, including `smartlead_utilities_send_single_email`. The gate stops
  accidents, not a determined agent that has been given the flag.
- **`fetch-contacts` elevated limit is unverifiable locally.** Smartlead
  documents 1–10000 "or 30000 for some users" without exposing which applies.
  The schema accepts up to 30000 and warns above 10000; the account's real
  `maxSingleFetchLimit` from the preflight is what is actually enforced.
- **Daily fetch limits are enforced from analytics.** If the requested quantity
  plus `leadsFoundToday` exceeds `maxDailyFetchLimit`, the paid request is
  refused locally.
- **Undocumented maximums are guarded, not derived.** A few lookup endpoints
  document a default but no maximum; this package applies a client-side bound
  (noted in `docs/endpoint-coverage.md`) rather than inventing a documented one.
- **Rate-limit tiers are per account.** Smartlead documents 60–120 requests per
  minute depending on plan. This server does not throttle; it retries safe GETs
  with backoff and surfaces `rate_limit` errors otherwise.
- **Response shapes are passed through.** Smartlead's response envelopes vary
  between endpoint families; tools unwrap the common `{ success, message, data }`
  wrapper but do not otherwise normalise upstream field names.
- **Limited live verification.** Independent review exercised search analytics,
  countries, and a one-result filtered contact search through the assembled MCP
  server. The account credit balance was unchanged. Mutations and paid endpoints
  remain mocks-only by design.

## Licence

MIT — see [`LICENSE`](LICENSE) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

"Smartlead" and "SmartProspect" are trademarks of their respective owner. This
project is **not affiliated with, endorsed by, or sponsored by Smartlead.ai**,
and uses those names only to identify the API it integrates with.
