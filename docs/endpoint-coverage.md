# Endpoint coverage

**Documentation checked: 2026-08-14** against
<https://api.smartlead.ai/llms-full.txt> and each per-endpoint page below
(fetched as `<page>.md` from <https://api.smartlead.ai/api-reference/…>).

Version 0.2.0 covers **191 of the 194 unique documented endpoints**, across all
four Smartlead API hosts, including **26/26 SmartProspect (100%)**.

The official reference has 212 pages but only 194 unique endpoints: 18 routes
are documented on two pages each (for example `campaigns/get-leads` and
`leads/get-by-campaign` are the same route).

| Host | Endpoints | Covered |
| --- | --- | --- |
| `server.smartlead.ai` | 134 | 131 |
| `smartdelivery.smartlead.ai` | 27 | 27 |
| `prospect-api.smartlead.ai` | 26 | 26 |
| `smart-senders.smartlead.ai` | 7 | 7 |

Three endpoints are excluded on purpose:

| Endpoint | Reason |
| --- | --- |
| `email-accounts/add-smtp` | Requires an SMTP password in the request body. A tool argument is relayed through the model and on to the model provider, so mailbox credentials must not be accepted as one. Connect mailboxes in the Smartlead UI. |
| `email-accounts/add-oauth` | Requires OAuth access and refresh tokens in the body; same reasoning. |
| `campaigns/get-leads-history-bulk` | The documented curl contains an opaque path segment (`bbfbdsFGHlBr76ruhjvh6fhHL`) with no matching path parameter, so the route cannot be determined without guessing. |

Where a credential parameter is *optional*, the parameter is stripped and the
endpoint is kept, so `clients/create` and `campaign-statistics/mailbox-statistics`
remain available. A test asserts that no tool exposes a credential-shaped input.

Tools come from two places. The 39 hand-written tools encode documented ranges,
enums and cross-field rules (the `id`/`filter_id` XOR, the credit preflight).
The other 152 are generated from a catalog built from the documentation's
parameter metadata; they validate names, types, presence and any explicitly
stated range or enum, but cannot express cross-field rules.

Host key:

- **prospect** — `https://prospect-api.smartlead.ai/api/v1/search-email-leads`
- **core** — `https://server.smartlead.ai/api/v1`

---

## SmartProspect — complete (26/26)

| # | Documentation page | Method and route | Implemented | MCP tool | Spends credits |
| --- | --- | --- | --- | --- | --- |
| 1 | [search-contacts](https://api.smartlead.ai/api-reference/smart-prospect/search-contacts) | `POST` prospect `/search-contacts` | yes | `smartprospect_search_contacts` | no |
| 2 | [get-contacts](https://api.smartlead.ai/api-reference/smart-prospect/get-contacts) | `POST` prospect `/get-contacts` | yes | `smartprospect_get_contacts` | no |
| 3 | [fetch-contacts](https://api.smartlead.ai/api-reference/smart-prospect/fetch-contacts) | `POST` prospect `/fetch-contacts` | yes | `smartprospect_fetch_contacts` | **yes** |
| 4 | [find-emails](https://api.smartlead.ai/api-reference/smart-prospect/find-emails) | `POST` prospect `/search-contacts/find-emails` | yes | `smartprospect_find_emails` | **yes** |
| 5 | [search-analytics](https://api.smartlead.ai/api-reference/smart-prospect/search-analytics) | `GET` prospect `/search-analytics` | yes | `smartprospect_get_search_analytics` | no |
| 6 | [reply-analytics](https://api.smartlead.ai/api-reference/smart-prospect/reply-analytics) | `GET` prospect `/reply-analytics` | yes | `smartprospect_get_reply_analytics` | no |
| 7 | [saved-searches](https://api.smartlead.ai/api-reference/smart-prospect/saved-searches) | `GET` prospect `/search-filters/saved-searches` | yes | `smartprospect_list_saved_searches` | no |
| 8 | [recent-searches](https://api.smartlead.ai/api-reference/smart-prospect/recent-searches) | `GET` prospect `/search-filters/recent-searches` | yes | `smartprospect_list_recent_searches` | no |
| 9 | [fetched-searches](https://api.smartlead.ai/api-reference/smart-prospect/fetched-searches) | `GET` prospect `/search-filters/fetched-searches` | yes | `smartprospect_list_fetched_searches` | no |
| 10 | [save-search](https://api.smartlead.ai/api-reference/smart-prospect/save-search) | `POST` prospect `/search-filters/save-search` | yes | `smartprospect_save_search` | no |
| 11 | [update-saved-search](https://api.smartlead.ai/api-reference/smart-prospect/update-saved-search) | `PUT` prospect `/search-filters/save-search/{id}` | yes | `smartprospect_update_saved_search` | no |
| 12 | [update-fetched-lead](https://api.smartlead.ai/api-reference/smart-prospect/update-fetched-lead) | `PUT` prospect `/search-filters/fetched-searches/{id}` | yes | `smartprospect_update_fetched_search` | no |
| 13 | [review-contacts](https://api.smartlead.ai/api-reference/smart-prospect/review-contacts) | `PATCH` prospect `/review-contacts/{filter_id}` | yes | `smartprospect_review_contacts` | no |
| 14 | [countries](https://api.smartlead.ai/api-reference/smart-prospect/countries) | `GET` prospect `/countries` | yes | `smartprospect_list_countries` | no |
| 15 | [states](https://api.smartlead.ai/api-reference/smart-prospect/states) | `GET` prospect `/states` | yes | `smartprospect_list_states` | no |
| 16 | [cities](https://api.smartlead.ai/api-reference/smart-prospect/cities) | `GET` prospect `/cities` | yes | `smartprospect_list_cities` | no |
| 17 | [company](https://api.smartlead.ai/api-reference/smart-prospect/company) | `GET` prospect `/company` | yes | `smartprospect_list_companies` | no |
| 18 | [domain](https://api.smartlead.ai/api-reference/smart-prospect/domain) | `GET` prospect `/domain` | yes | `smartprospect_list_domains` | no |
| 19 | [departments](https://api.smartlead.ai/api-reference/smart-prospect/departments) | `GET` prospect `/departments` | yes | `smartprospect_list_departments` | no |
| 20 | [levels](https://api.smartlead.ai/api-reference/smart-prospect/levels) | `GET` prospect `/levels` | yes | `smartprospect_list_seniority_levels` | no |
| 21 | [industries](https://api.smartlead.ai/api-reference/smart-prospect/industries) | `GET` prospect `/industries` | yes | `smartprospect_list_industries` | no |
| 22 | [sub-industries](https://api.smartlead.ai/api-reference/smart-prospect/sub-industries) | `GET` prospect `/sub-industries` | yes | `smartprospect_list_sub_industries` | no |
| 23 | [revenue](https://api.smartlead.ai/api-reference/smart-prospect/revenue) | `GET` prospect `/revenue` | yes | `smartprospect_list_revenue_ranges` | no |
| 24 | [head-counts](https://api.smartlead.ai/api-reference/smart-prospect/head-counts) | `GET` prospect `/head-counts` | yes | `smartprospect_list_head_counts` | no |
| 25 | [job-title](https://api.smartlead.ai/api-reference/smart-prospect/job-title) | `GET` prospect `/job-title` | yes | `smartprospect_list_job_titles` | no |
| 26 | [keywords](https://api.smartlead.ai/api-reference/smart-prospect/keywords) | `GET` prospect `/keywords` | yes | `smartprospect_list_keywords` | no |

**No SmartProspect endpoint documented on 2026-08-14 is omitted.**

### Documented constraints implemented

| Endpoint | Constraint as documented | Where enforced |
| --- | --- | --- |
| search-contacts | `limit` required, 1–500 | `searchContactsSchema.limit` |
| search-contacts | every array filter max 2000 items | `filterArray()` |
| search-contacts | `scroll_id` for pagination; response carries `filter_id`, `total_count` | forwarded and surfaced in `pagination` |
| get-contacts | XOR between `id` and `filter_id` | `.refine()` on `getContactsSchema` |
| get-contacts | `id` max 200 adapt IDs | `GET_CONTACTS_MAX_IDS` |
| get-contacts | `limit` 1–1000, `offset` ≥ 0 | `getContactsSchema` |
| get-contacts | `verification_status` ∈ {valid, catch_all, invalid} | `VERIFICATION_STATUSES` |
| get-contacts | `catch_all_status` ∈ 5 documented values | `CATCH_ALL_STATUSES` |
| find-emails | `contacts` non-empty, max 10 | `FIND_EMAILS_MAX_CONTACTS` |
| find-emails | each contact needs firstName, lastName, companyDomain | contact sub-schema |
| fetch-contacts | `filter_id` required and positive | `fetchContactsSchema` |
| fetch-contacts | either `id` or `limit`, not both | `.refine()` |
| fetch-contacts | `limit` 1–10000 (30000 for some accounts) | schema allows ≤30000, warns >10000, preflight enforces the account's real `maxSingleFetchLimit` |
| fetch-contacts | `visual_limit` 1–1000, `visual_offset` ≥ 0 | `fetchContactsSchema` |
| fetch-contacts | limit/credit failures return HTTP 200 with `success: false` | surfaced as `api_failure` / `payment` errors |
| lookups (countries, states, cities, departments, levels, industries, sub-industries, head-counts) | `limit` 1–100 default 10, `offset` ≥ 0, `search` 1–255 chars | `boundedLookupPagination` |
| save-search | `search_string` required; `limit` 1–10000 | `saveSearchSchema` |
| update-saved-search / update-fetched-lead | path `id` matches `^[1-9][0-9]*$`; `search_string` 1–255 | `positiveInt`, `.max(255)` |
| review-contacts | path `filter_id` matches `^[0-9]+$` | `nonNegativeInt` |

### Client-side guards where the documentation states no maximum

These are **not** documented limits. They are defensive bounds; a reviewer may
raise them.

| Endpoint | Documented | Guard applied |
| --- | --- | --- |
| company, domain, job-title, keywords | "Default: 100", no maximum | `limit` ≤ 1000 |
| saved-searches, recent-searches, fetched-searches | "Default: 10", no maximum | `limit` ≤ 1000 |
| save-search array filters | no maximum stated | uncapped (matches the docs) |
| add-domain-block-list | no maximum stated | `domain_block_list` ≤ 1000 entries |

---

## Core Smartlead — implemented (13)

| Documentation page | Method and route | MCP tool | Classification |
| --- | --- | --- | --- |
| [campaigns/get-all](https://api.smartlead.ai/api-reference/campaigns/get-all) | `GET` core `/campaigns/` | `smartlead_list_campaigns` | read-only |
| [campaigns/get-by-id](https://api.smartlead.ai/api-reference/campaigns/get-by-id) | `GET` core `/campaigns/{campaign_id}` | `smartlead_get_campaign` | read-only |
| [campaigns/get-analytics](https://api.smartlead.ai/api-reference/campaigns/get-analytics) | `GET` core `/campaigns/{campaign_id}/analytics` | `smartlead_get_campaign_analytics` | read-only |
| [campaigns/get-leads](https://api.smartlead.ai/api-reference/campaigns/get-leads) | `GET` core `/campaigns/{campaign_id}/leads` | `smartlead_get_campaign_leads` | read-only |
| [leads/get-by-email](https://api.smartlead.ai/api-reference/leads/get-by-email) | `GET` core `/leads/` | `smartlead_get_lead_by_email` | read-only |
| [lead-lists/get-all](https://api.smartlead.ai/api-reference/lead-lists/get-all) | `GET` core `/lead-list/` | `smartlead_list_lead_lists` | read-only |
| [email-accounts/get-all](https://api.smartlead.ai/api-reference/email-accounts/get-all) | `GET` core `/email-accounts/` | `smartlead_list_email_accounts` | read-only |
| [utilities/domain-block-list](https://api.smartlead.ai/api-reference/utilities/domain-block-list) | `GET` core `/leads/get-domain-block-list` | `smartlead_get_domain_block_list` | read-only |
| [campaigns/create](https://api.smartlead.ai/api-reference/campaigns/create) | `POST` core `/campaigns/create` | `smartlead_create_campaign` | mutation |
| [campaigns/add-leads](https://api.smartlead.ai/api-reference/campaigns/add-leads) | `POST` core `/campaigns/{campaign_id}/leads` | `smartlead_add_leads_to_campaign` | mutation + `confirm_import` |
| [campaigns/update-status](https://api.smartlead.ai/api-reference/campaigns/update-status) | `POST` core `/campaigns/{campaign_id}/status` | `smartlead_update_campaign_status` | mutation; `START` is gated as **sending** |
| [utilities/domain-block-list](https://api.smartlead.ai/api-reference/utilities/domain-block-list) | `POST` core `/leads/add-domain-block-list` | `smartlead_add_domain_to_block_list` | mutation |
| [utilities/domain-block-list](https://api.smartlead.ai/api-reference/utilities/domain-block-list) | `DELETE` core `/leads/delete-domain-block-list` | `smartlead_remove_domain_from_block_list` | **destructive** |

Documented core constraints implemented: `add-leads` max 400 leads and max 200
custom fields per lead; campaign lead pagination `limit` 1–100; email account
pagination `limit` 1–100; block-list `limit` 1–1000; campaign status values
restricted to `START` / `PAUSED` / `STOPPED` (Smartlead documents `START`, not
`ACTIVE`). `STOPPED` is permanently destructive. Lead imports that opt out of
unsubscribe, global-block-list, cross-campaign duplicate, or community-bounce
checks require destructive approval in addition to import confirmation.

### Deliberate classification deviation

`smartlead_remove_domain_from_block_list` is grouped with "standard mutations" in
many descriptions of this API, but this package classifies it as **destructive**.
Deleting a suppression entry re-enables outreach to a recipient who was blocked,
often after a hard bounce or spam complaint, and the deleted record's contents
are not recoverable from the API afterwards. It therefore requires
`unrestricted` mode, `SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true` and
`confirm_destructive: true`. A reviewer who disagrees can downgrade it by
changing one `capability({...})` call in `src/tools/core/blocklist.ts`.

---

## Core Smartlead — previously omitted, now covered

0.1.0 covered 13 core operations. 0.2.0 covers the documented core surface via
the catalog. The table below is retained as a record of what each family
contains and which safety classification it received.

| Family | Example endpoints | Reason for omission |
| --- | --- | --- |
| Sending and replies | `utilities/send-single-email`, `inbox/reply`, `inbox/forward`, `campaigns/send-test-email`, `campaigns/reply-email-thread` | Directly sends email. Excluded from 0.1.0 by design; would require the sending policy plus per-recipient review UX that this version does not provide. |
| Lead destruction | `leads/delete`, `campaigns/delete-lead`, `leads/unsubscribe`, `campaigns/unsubscribe-lead` | Irreversible and/or permanently suppresses a contact globally. Excluded pending a reviewed destructive-operation UX. |
| Campaign destruction | `campaigns/delete`, `campaigns/duplicate` | Irreversible or quota-affecting. Out of scope for a SmartProspect-focused release. |
| Email account management | `email-accounts/add-smtp`, `add-oauth`, `update`, `delete`, `suspend`, `unsuspend`, `warmup-settings` | Mailbox infrastructure mutation, including credential handling. Out of scope; a misconfiguration here damages deliverability. |
| Sequences and schedule | `campaigns/get-sequences`, `update-sequences`, `create-subsequence`, `update-schedule`, `update-settings` | Large, campaign-shaping payloads. Deferred to a later version so 0.1.0 stays reviewable. |
| Master inbox | `inbox/*` (25+ endpoints) | Reads and mutates real conversations with prospects; substantial personal-data surface. Deferred. |
| Smart Delivery | `smart-delivery/*` (25+ endpoints) | Placement-testing product, orthogonal to prospecting. Deferred. |
| Smart Senders | `smart-senders/*` | Documented as gated behind support access ("Contact support@smartlead.ai for access"), so it cannot be verified from the public docs alone. |
| Webhooks | `webhooks/create`, `update`, `delete`, `events` | Creates outbound HTTP callbacks to third-party URLs — an exfiltration path that needs its own review. Deferred. |
| Clients, tags, lead notes/tasks, teams | `clients/*`, `lead-tags/*`, `email-account-tags/*`, `lead-notes/*`, `lead-tasks/*`, `campaigns/update-team-member` | Organisational metadata, not needed for the prospect → campaign workflow. Deferred. |
| Broader analytics | `analytics/*` (24 endpoints) | Only `campaigns/get-analytics` is exposed. The rest are additive and can be added without design changes. |
| Lead list mutation | `lead-lists/create`, `import-leads`, `update`, `delete`, `push-to-campaign`, `push-between-lists` | Only the read endpoint is exposed in 0.1.0; import flows funnel through `smartlead_add_leads_to_campaign`, which has the import confirmation. |
| Lead state changes | `leads/pause`, `leads/resume`, `leads/update`, `campaigns/update-lead-category`, `campaigns/mark-lead-complete` | Per-lead sequence control. Deferred; not required for prospecting. |
| `inbox/block-domains` (`POST /master-inbox/block-domains`) | — | Functionally overlapping with `POST /leads/add-domain-block-list`, which is the endpoint the block-list documentation page pairs with the GET and DELETE operations. Exposing one blocking route avoids two tools with subtly different semantics. |

---

## Explicitly excluded

`POST https://server.smartlead.ai/api/v1/verify-emails` — **not implemented, and
must not be added.** This route is implemented by at least one third-party
client but does not appear anywhere in Smartlead's current API reference, and
requests to it return `404 Cannot POST /api/v1/verify-emails`. The documented
mechanisms for email discovery and verification are SmartProspect's
`find-emails` and `fetch-contacts`, plus the `verification_status` and
`catch_all_status` fields on `get-contacts`. An integration test asserts that no
tool description or route in this package mentions `verify-emails`.

---

## Re-checking this document

```bash
curl -sSL https://api.smartlead.ai/llms-full.txt -o llms-full.txt
curl -sSL https://api.smartlead.ai/api-reference/smart-prospect/search-contacts.md
```

Appending `.md` to any documentation page returns the raw source, including the
`ParamField` names that the aggregated `llms-full.txt` strips. Use the `.md`
form when verifying parameter names.
