# Security policy

`@voriq/smartlead-mcp` is an **unofficial** MCP integration for Smartlead. It is
not affiliated with, endorsed by, or sponsored by Smartlead.ai. Do not report
Smartlead platform vulnerabilities here — send those to Smartlead directly.

## Reporting a vulnerability in this package

Report privately via GitHub Security Advisories:
<https://github.com/voriq-ai/smartlead-mcp/security/advisories/new>. If private
reporting is unavailable, open an issue at
<https://github.com/voriq-ai/smartlead-mcp/issues> that describes the *impact*
without including any credential, contact record or customer data.

Please include: affected version, configuration (`SMARTLEAD_MCP_MODE` and which
allow-flags were set), a minimal reproduction, and what an attacker gains.

**Never paste an API key or real prospect data into a report.** If you believe a
key has been exposed, rotate it in the Smartlead dashboard first.

Target response time: acknowledgement within 5 working days.

## Credential handling

The Smartlead API authenticates with an `api_key` **query parameter**. That means
the credential is part of every request URL, which is the single most important
security property of this codebase.

- The key is read **only** from `SMARTLEAD_API_KEY` in the process environment.
- **No tool accepts the key as an argument.** Tool input schemas are strict
  objects, so passing `api_key` to a tool is rejected before the handler runs.
- Every URL, error message, error detail and tool result passes through
  `src/security/redaction.ts` before leaving the process. Query parameters named
  `api_key`, `apikey`, `token` or `access_token` are masked, credential-shaped
  object keys are dropped, and any literal occurrence of the configured key is
  replaced with `[REDACTED]`.
- `SmartleadApiError` redacts at construction time, so even
  `String(error)` in third-party code cannot leak the key.
- Errors expose no stack traces and no `cause` chain across the MCP boundary.

Operational advice:

- Give the server a Smartlead key with the least privilege your account allows.
- Prefer per-agent keys so one can be rotated without disrupting others.
- Put the key in your MCP client's `env` block, not in a shell history line.
- Do not commit `.env`. It is git-ignored and excluded from the npm tarball.

## Data logging policy

- The server writes **nothing** to stdout except the MCP protocol stream.
- stderr receives only fatal startup errors (redacted).
- No request body, no response body, and no contact record is logged anywhere.
- No response is written to disk. There is no cache, no snapshot directory and
  no telemetry of any kind — this package makes no network call other than to
  the configured Smartlead hosts.
- When diagnostics need to describe a request body, `summarizeBody()` reports
  field names and array lengths only, never values.

## Personal data

SmartProspect exists to return contact information, so tools **will** return
email addresses and names. That is the intended behaviour, and it is your
responsibility to have a lawful basis for processing it.

Controls available to you:

- Search previews default to `include_full_records: false`; callers must opt in
  before names and personal fields are returned.
- `include_full_records: false` on `smartprospect_search_contacts`,
  `smartprospect_get_contacts`, `smartprospect_fetch_contacts` and
  `smartprospect_find_emails` returns a de-identified summary: counts plus
  non-personal attributes (title, company, industry, headcount, location), with
  email addresses, names and LinkedIn URLs removed and
  `personal_fields_omitted: true` set on each record.
- `readonly` mode (the default) prevents any contact from being revealed at all,
  because revealing contacts requires a credit-spending call.
- Error reporting prefers counts and field names over raw records.

Remember that anything a tool returns is sent to your model provider. If that is
not acceptable for a given dataset, use `include_full_records: false` or do not
run the tool.

## Credit-spend protection

Two SmartProspect operations consume account credits:
`smartprospect_find_emails` and `smartprospect_fetch_contacts`.

They are gated by:

1. `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true` in the server environment, **and**
2. `confirm_credit_spend: true` as a real boolean in the call, **and**
3. a mode of `standard` or `unrestricted` (they are blocked outright in
   `readonly`), **and**
4. for `fetch_contacts`, a mandatory free read-only preflight against
   `GET /search-analytics` that **rejects** — never silently reduces — a request
   exceeding the available credit balance, daily limit, or the account's
   `maxSingleFetchLimit`. A failed or unrecognisable preflight fails closed.

A refused call returns before any HTTP request is issued, so it cannot cost
anything. Neither credit-consuming request is ever retried automatically.

## Sending protection

`smartlead_update_campaign_status` with `status: "START"` activates a campaign
and will cause email to be sent. It requires `unrestricted` mode,
`SMARTLEAD_MCP_ALLOW_SEND=true` and `confirm_send: true`. `PAUSED` is an ordinary
mutation available in `standard` mode. `STOPPED` permanently stops a campaign
and requires unrestricted mode, `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true`, and
`confirm_destructive: true`.

Lead import (`smartlead_add_leads_to_campaign`) requires an explicit
`campaign_id` and `confirm_import: true`, deduplicates emails locally, reports
how many duplicates were removed, and **never** changes campaign status as a
side effect. Enabling an unsubscribe, global-block-list, cross-campaign
duplicate, or community-bounce-list bypass additionally requires destructive
approval.

No one-off email sending, inbox reply, or forward tool is implemented in 0.1.0.

## Destructive-operation protection

Destructive paths require `unrestricted` mode,
`SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true` and `confirm_destructive: true`. They are:

- permanently changing a campaign to `STOPPED`;
- removing an entry from the domain block list; and
- importing leads while bypassing suppression or bounce-list protections.

Deleting a block-list entry re-enables outreach to a recipient who was suppressed
— frequently after a hard bounce or a spam complaint — so it is treated as
higher-impact than the "standard mutation" its HTTP verb might suggest.

Lead deletion, global unsubscribe and mailbox teardown endpoints are **not
implemented** in 0.1.0.

## Prompt injection

Tool output contains attacker-influenceable text: contact names, company names,
campaign names, lead custom fields. An agent that treats that text as
instructions can be steered into spending credits or mutating campaigns.

The mitigations that actually hold are structural, not advisory:

- The policy layer is evaluated on every call from server configuration the
  model cannot change. An injected instruction cannot set
  `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND`.
- Confirmation booleans must be `true`; a model that has been talked into
  setting one still cannot bypass the environment flag.
- Default mode is `readonly`, so an unattended agent has no dangerous surface.
- `fetch_contacts` bounds spend against the real account balance rather than
  trusting the requested number.

Host applications should still surface `credit_spending: true` and
`remote_mutation: true` from the result envelope to a human before proceeding.

## Supported versions

0.1.0 is pre-release. Only the latest published version receives fixes.
