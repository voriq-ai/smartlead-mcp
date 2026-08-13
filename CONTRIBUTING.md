# Contributing

Thanks for helping. This package integrates with a third-party API that charges
money per call, so the contribution rules are stricter than usual in a few
specific places.

## Ground rules

1. **Everything comes from the official documentation.** Add or change an
   endpoint only with a link to the current
   <https://api.smartlead.ai/api-reference/…> page, and record the date you
   checked it in `docs/endpoint-coverage.md`. Do not infer a route from another
   client library, from a network trace, or from a similar-looking endpoint.
2. **Never copy third-party source.** If code from another project is ever
   vendored in, its licence and copyright notice must be added to
   `THIRD_PARTY_NOTICES.md` in the same commit.
3. **No secrets, ever.** No API key, no real prospect email, no captured API
   response with personal data — not in tests, fixtures, snapshots, docs or
   commit messages. Test data uses `example.com` / `example.org`.
4. **Do not implement an undocumented route.** In particular, `/verify-emails`
   is not in Smartlead's API reference and returns 404. It must stay out.

## Setup

```bash
npm install
npm run verify   # typecheck + lint + tests + build + pack dry-run
```

Node 20.11+ is required.

## Adding a tool

1. Add the Zod schema to `src/schemas/smart-prospect.ts` or `src/schemas/core.ts`.
   Encode every documented constraint: ranges, array maximums, enums, XOR rules.
   Use `z.strictObject` so unknown fields are rejected.
2. Add the client method to `src/client/prospect-client.ts` or
   `src/client/core-client.ts`. Non-GET requests must pass `retryable: false`
   unless the endpoint is provably idempotent.
3. Add the tool with `defineTool` in the relevant `src/tools/**` file and declare
   its `capability` honestly. `capability()` derives `readOnly` from the declared
   side effects, so you cannot mark a mutating tool read-only.
4. Register it by adding it to the exported list in that file.
5. Add a routing case to `tests/unit/tool-routes.test.ts`. That file asserts full
   coverage, so the suite fails until you do.
6. Update the tool table in `README.md` and `docs/endpoint-coverage.md`.

### Capability rules

| Declaration | Meaning |
| --- | --- |
| `creditSpending: true` | Can consume SmartProspect credits. Must also require `confirm_credit_spend` in its schema and must never be auto-retried. |
| `sending: true` | Can cause email to be sent, or activates a campaign. Must require `confirm_send`. |
| `destructive: true` | Irreversible. Must require `confirm_destructive`. |
| `leadImport: true` | Writes leads into a campaign. Must require `confirm_import` and an explicit `campaign_id`. |
| `remoteMutation: true` | Any other change to Smartlead-side state. |

Confirmation fields are `z.boolean().default(false)`, never `z.literal(true)`:
the policy layer must produce the structured refusal so the caller gets an
actionable `error.requirements` list rather than a schema error.

If one endpoint has both a benign and a high-impact mode, declare the worst case
in `capability` (it drives the description and annotations) and narrow the real
behaviour in `resolveCapability`, as `smartlead_update_campaign_status` does.

## Testing

- Unit and integration tests must not touch the network. Inject `fetch` with the
  helper in `tests/helpers/mock-fetch.ts`.
- Any change to gating behaviour needs a test proving that the blocked call made
  **zero** HTTP requests.
- Live tests (`tests/live/`) stay read-only. Never add a live test that spends
  credits, imports leads, mutates a campaign, sends, deletes or unsubscribes.
- Run `npm run test:coverage`; thresholds are enforced.

## Commits and pull requests

- Conventional-commit style subjects (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Focused commits. Inspect staged changes before committing and confirm no
  secret or personal data is staged.
- PRs should state which documentation page justifies the change and whether the
  change affects credit spend, sending or destructive behaviour.

## Releasing

Maintainers only. See [`docs/publishing.md`](docs/publishing.md).
