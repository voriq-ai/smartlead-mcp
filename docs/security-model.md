# Security model

This document explains what `smartleadai-mcp` defends against, what it
deliberately does not, and which controls are structural rather than advisory.

For reporting instructions and the user-facing summary, see
[`SECURITY.md`](../SECURITY.md).

## 1. Threat model

### Assets

| Asset | Why it matters |
| --- | --- |
| The Smartlead API key | Full account access: read every campaign and lead, send email, spend credits, delete data. |
| SmartProspect credits | Directly monetary. Spending them is irreversible. |
| Prospect personal data | Names, email addresses, employers, locations. Regulated in most jurisdictions. |
| Campaign and sending state | Activating a campaign sends real email to real people. Unblocking a domain re-enables outreach to a suppressed recipient. |
| Sender reputation | Mis-sent or mis-targeted email damages deliverability across every campaign on the account. |

### Actors

| Actor | Capability assumed |
| --- | --- |
| Operator | Sets environment variables, chooses the mode, holds the key. Trusted. |
| MCP host application | Spawns the process, relays tool calls. Trusted for transport, not for judgement. |
| The model | Chooses which tools to call and with what arguments. **Not trusted** — it can be steered by its context. |
| Upstream content | Contact records, campaign names, lead custom fields returned by Smartlead. **Attacker-influenceable.** |
| Local user on the machine | Can read the process environment and any file. Out of scope. |

### Threats considered

1. **Credential exfiltration.** The key appears in every request URL because
   Smartlead authenticates by query parameter. Any URL that reaches a log, an
   error message, or a tool result would leak it to the model provider.
2. **Unintended credit spend.** A model that misreads a request, or that follows
   an injected instruction, calls `fetch-contacts` with a large `limit`.
3. **Unintended sending.** A model activates a campaign, or a retry re-sends.
4. **Irreversible mutation.** Deletion, unsubscribe, block-list removal.
5. **Double-charging via retries.** A transient 500 on a paid POST that the
   client retries.
6. **Personal data over-exposure.** Contact records entering a model context or
   a log when only counts were needed.
7. **Prompt injection through upstream content.** Instructions embedded in a
   company name or a lead custom field.
8. **Route confusion.** SmartProspect calls sent to the core host, or an
   undocumented route implemented from guesswork.

### Explicitly out of scope

- Compromise of the host machine or of the operator's shell history.
- Smartlead-side vulnerabilities or Smartlead's own data handling.
- Model provider retention of data the operator chose to send.
- Denial of service against the Smartlead API (the server does not throttle;
  it retries safe GETs with backoff and surfaces `rate_limit` otherwise).

## 2. Secret handling

**Single source.** `SMARTLEAD_API_KEY` is read once, in `loadConfig()`, from the
process environment. There is no file-based configuration, no CLI flag and no
tool argument that can supply it.

**Not reachable from a tool call.** All tool input schemas are `z.strictObject`,
so an argument named `api_key` fails validation before the handler runs. An
integration test asserts that no registered tool exposes a property whose name
contains `api_key`, `apikey` or `token`.

**Injected once, at the boundary.** `HttpClient.buildUrl()` is the only code that
writes the credential, and it always writes it last, as a query parameter.

**Redacted on every egress path.** `src/security/redaction.ts` provides:

- `redactUrl()` — masks `api_key`, `apikey`, `token`, `access_token` values in
  any URL-ish string, whether or not the parameter is last.
- `redactSecrets()` — additionally replaces literal occurrences of the
  configured key, for cases where it was interpolated outside a query string.
  Values shorter than 8 characters are ignored so unrelated text is not mangled.
- `redactValue()` — deep-walks an object, dropping credential-shaped keys
  entirely and scrubbing nested strings, before anything is embedded in a result.

`SmartleadApiError` runs its message, URL and details through redaction **at
construction time**, so the credential cannot leak even via `String(error)` in
code this package does not control. `toJSON()` omits the stack and the `cause`
chain.

**Tested.** `tests/unit/redaction.test.ts` and the integration suite assert that
the synthetic test key never appears in a thrown error, a tool result, or the
tool list.

## 3. Data logging policy

- **stdout carries the MCP protocol stream and nothing else.** Any stray write
  would corrupt the JSON-RPC framing, so the discipline is enforced by the
  transport as much as by policy. `no-console` is an ESLint error.
- **stderr carries fatal startup errors only**, and those are redacted.
- **No request body, response body or contact record is written anywhere** — not
  to a log, not to a cache, not to disk. There is no snapshot directory.
- **No telemetry.** The process makes no network request other than to the two
  configured Smartlead hosts.
- When a diagnostic needs to describe a body, `summarizeBody()` reports field
  names and array lengths only (`{"contacts": "array(2)"}`), never values.
- Only a small allowlist of response headers is retained
  (`x-ratelimit-*`, `retry-after`, `content-type`).

## 4. Credit-spend protection

Two tools spend credits: `smartprospect_find_emails` and
`smartprospect_fetch_contacts`.

**Layer 1 — mode.** Both are non-read-only, so `readonly` (the default) blocks
them outright.

**Layer 2 — environment flag.** `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true` must be
set by the operator, out of band. The model cannot change it.

**Layer 3 — per-call confirmation.** `confirm_credit_spend` must be boolean
`true`. `"true"`, `1` and `"yes"` are rejected. No confirmation field defaults to
`true`.

**Layer 4 — preflight bound (`fetch_contacts`).** Before the paid request, the
tool calls the free, read-only `GET /search-analytics` and compares the requested
quantity with `availableCredits.available` and `maxSingleFetchLimit`. If either
is exceeded the call is **rejected with an explanation**, never silently reduced;
silently reducing would spend credits while returning less than asked for. The
preflight state is returned in `data.credit_preflight` so the caller can see what
was checked. `maxDailyFetchLimit` is also enforced against `leadsFoundToday`.
The preflight cannot be skipped and fails closed if analytics is unavailable or
does not contain recognisable credit/account-limit fields.

**Layer 5 — no retries.** `ProspectClient.findEmails()` and `fetchContacts()`
pass `retryable: false`. Retries are enabled only for GET. A retried paid POST
could be charged twice, and Smartlead documents no idempotency key.

**Ordering guarantee.** The policy layer runs in `executeTool()` *before* the
handler, so a refused call issues zero HTTP requests. Tests assert
`mock.calls.length === 0` for every refusal path.

## 5. Sending protection

`smartlead_update_campaign_status` is the only tool that can cause email to be
sent, and only when `status` is `START`.

- The tool declares `sending: true` as its worst case, which is what appears in
  the description and in the MCP `annotations`.
- `resolveCapability()` narrows the enforced capability per call: `START` is
  gated as sending, `STOPPED` as destructive, and `PAUSED` as an ordinary
  mutation.
- The asymmetry is deliberate: pausing a runaway campaign must never be harder
  than starting one. `PAUSED` works in `standard` mode; `START` needs
  `unrestricted` + `SMARTLEAD_MCP_ALLOW_SEND=true` + `confirm_send: true`.
- `STOPPED` is permanent per Smartlead's documentation, so it needs
  `unrestricted` + `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true` +
  `confirm_destructive: true`.
- The result envelope's `warnings` state plainly that the campaign will begin
  sending.

Lead import is gated separately: an explicit `campaign_id` is required (there is
no "default campaign"), `confirm_import: true` is required, emails are
deduplicated locally with the count reported, the request is never retried, and
campaign status is **never** changed as a side effect.

No one-off send, inbox reply, forward or test-email tool exists in 0.1.0.

## 6. Destructive-operation protection

`smartlead_remove_domain_from_block_list` is the only destructive tool. It
requires `unrestricted` mode, `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true` and
`confirm_destructive: true`.

Rationale for treating a block-list deletion as destructive rather than as an
ordinary mutation: the deleted entry frequently exists because of a hard bounce
or a spam complaint, its contents are not recoverable from the API after
deletion, and removing it re-enables outreach to that recipient — a change with
both deliverability and compliance consequences.

Lead deletion, campaign deletion, global unsubscribe and mailbox teardown
endpoints are documented by Smartlead but are **not implemented** here.

## 7. Prompt-injection considerations

Tool output includes free text controlled by third parties: contact names,
company names, campaign names, lead custom fields, saved-search names. A model
that treats that text as instructions can be steered.

What actually holds:

- **Configuration is out of band.** Injected text cannot set
  `SMARTLEAD_MCP_ALLOW_CREDIT_SPEND`, change the mode, or alter the API key.
- **Confirmation alone is insufficient.** Even a model fully persuaded to set
  `confirm_credit_spend: true` is still blocked without the environment flag.
- **Quantities are bounded by reality.** `fetch_contacts` is checked against the
  account's actual balance and single-fetch limit, not against the number the
  model asked for.
- **The default is safe.** `readonly` exposes no credit spend, no mutation, no
  sending and no deletion, so an unattended agent has no dangerous surface.
- **Descriptions are generated, not free-form.** Every tool description carries
  the same machine-readable safety sentence, so a model cannot be confused by an
  inconsistently worded one.

What does **not** hold, and needs the host application:

- Nothing prevents a model from calling a permitted tool with poor judgement.
  If credit spend is enabled, surface `credit_spending: true` and
  `remote_mutation: true` from the envelope to a human before proceeding.
- Contact data returned to the model is in the model's context from then on.
  Use `include_full_records: false` when only counts and firmographics are
  needed.

## 8. Route integrity

- The two hosts are served by two separate client classes with separate base
  URLs. Tests assert that a SmartProspect call never reaches
  `server.smartlead.ai` and vice versa.
- Every implemented route has a test asserting the exact host, path, method,
  query parameters and request body (`tests/unit/tool-routes.test.ts`), and that
  file fails if a registered tool has no routing case.
- No route is implemented without a documentation page recorded in
  `docs/endpoint-coverage.md` with the date it was checked.
- `POST /api/v1/verify-emails` is absent by design and an integration test
  asserts it is never mentioned.

## 9. Operational recommendations

1. **Start in `readonly`.** Raise the mode only for the specific workflow that
   needs it, and lower it again afterwards.
2. **Enable one flag at a time.** `ALLOW_CREDIT_SPEND`, `ALLOW_SEND` and
   `ALLOW_DESTRUCTIVE` are independent on purpose. Do not set all three.
3. **Use a dedicated API key per agent** so one can be rotated without
   disrupting the others, and rotate on any suspicion of exposure.
4. **Keep the key out of shell history.** Put it in the MCP client's `env`
   block or a secrets manager, not in an inline `SMARTLEAD_API_KEY=… npx …`
   command on a shared machine.
5. **Require human confirmation in the host** for any result where
   `credit_spending` or `remote_mutation` is `true`.
6. **Check credits first.** `smartprospect_get_search_analytics` is free; make it
   the first call of any prospecting session.
7. **Prefer `get_contacts` over `fetch_contacts`.** Contacts already fetched are
   free to retrieve; `smartprospect_list_fetched_searches` shows which filters
   are already paid for.
8. **Never enable credit spend in an unattended or scheduled agent** unless the
   maximum spend per run is bounded by something other than the model's
   judgement.
9. **Review `warnings` on every envelope.** They carry preflight findings,
   deduplication counts and activation notices.
10. **Treat `include_full_records: true` as a data-transfer decision**, because
    it sends personal data to your model provider.
