# Publishing

`smartleadai-mcp@0.1.0` is published on npm. Releases are tag-driven: pushing a
`v*` tag runs the publish workflow, which pauses for an approval in the
`npm-publish` environment before it publishes with provenance.

## 1. npm name

`smartleadai-mcp` is registered and owned by this project (first published
2026-08-13). Confirm the currently published version before every release:

```bash
npm view smartleadai-mcp version dist-tags
```

Two adjacent names are already taken by unrelated publishers and are **not**
this project: `smartlead-mcp` (0.2.2) and `smartlead-mcp-server` (1.2.1). Both
cover campaign management only; neither implements SmartProspect. Do not
describe this package in a way that implies continuity with either.

## 2. Prerequisites

1. **No npm scope is required** — `smartleadai-mcp` is unscoped, so any
   authenticated account may publish it. The trade-off is that the name carries
   no publisher identity: see the trademark note in section 12.
2. **Authenticate**: `npm login` (or a CI automation token in `NPM_TOKEN`).
   Verify with `npm whoami`.
3. **Enable 2FA for publishes** on the npm account. For CI, use a granular
   access token scoped to this package only.
4. **Repository metadata is set** to <https://github.com/voriq-ai/smartlead-mcp>
   (public, MIT, default branch `master`). `homepage`, `repository.url` and
   `bugs.url` in `package.json` all point at it, which is what npm provenance
   checks against — if the repository ever moves, update all three together.

## 3. Versioning

Semantic versioning. Published: `0.1.0` (39 tools), `0.2.0` (191 tools).

While `0.x`:

- **patch** — bug fixes, documentation, dependency bumps.
- **minor** — new tools, new endpoints, or a change to gating defaults.

Anything that makes a previously blocked operation possible by default is a
breaking change in spirit even if the version number says otherwise. Say so
loudly in the changelog.

Bump with `npm version <patch|minor|major>` (this creates a git tag; do not push
it until the release is agreed).

## 4. Package contents review

`files` in `package.json` is an allowlist:

```
dist/  docs/  README.md  LICENSE  SECURITY.md  CHANGELOG.md
THIRD_PARTY_NOTICES.md  .env.example
```

`.npmignore` is a defence-in-depth backstop that additionally excludes `tests/`,
`coverage/`, `src/`, private `.env*` files and `*.tgz`. `.env.example` is an
explicitly included, credential-free configuration template.

Verify before every publish:

```bash
npm run build
npm pack --dry-run
```

The tarball **must not** contain:

- source maps (disabled in `tsup.config.ts`),
- test fixtures or the test suite,
- coverage output,
- `.env` or any credential,
- captured API responses or personal lead data,
- files from any other project.

Confirm no secret made it in:

```bash
npm pack                       # produces smartleadai-mcp-<version>.tgz
tar -xOzf smartleadai-mcp-*.tgz | grep -aiE 'api[_-]?key=[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY'
rm smartleadai-mcp-*.tgz
```

That grep should print nothing. Documentation strings such as
`api_key=YOUR_API_KEY` are expected and harmless; a real-looking value is not.

## 5. Provenance

Publishing from a public GitHub repository via GitHub Actions with
`--provenance` attaches a signed attestation linking the tarball to the commit
and workflow that built it. This is already wired up in
[`.github/workflows/publish.yml`](../.github/workflows/publish.yml):

- **Tag-driven.** It runs only on a `v*` tag push, so no branch merge can ever
  ship a release by accident.
- **Version guard.** It fails if the tag does not match `package.json` version.
- **Full gate.** It runs `npm run verify` — typecheck, lint, coverage, build,
  pack dry-run and the clean-install MCP smoke test — before publishing.
- **Approval gate.** It targets the `npm-publish` environment, so a required
  reviewer must approve the run. A published version cannot be replaced.

Provenance requires a public repository and a supported CI provider. Publishing
from a laptop cannot produce it.

Two one-off setup steps are needed in repository settings before the first
release, and neither can be done from a checkout:

1. **Secret** `NPM_TOKEN` — an npm **granular access token** scoped to write
   only `smartleadai-mcp`. Do not use a classic all-packages token.
2. **Environment** `npm-publish` — create it and add yourself as a required
   reviewer, so the publish job pauses for approval.

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs the same
`npm run verify` on every push and pull request, across Node 20.19 and 22.
Neither workflow uses a Smartlead credential: the test suite injects `fetch`,
and the smoke test's tool calls are refused locally by the policy layer before
any request would be made.

## 6. Release procedure

```bash
npm ci
npm run verify            # typecheck, lint, coverage, build, pack dry-run,
                          # and clean-install MCP smoke
npm pack                  # inspect the tarball one last time
npm publish --access public
```

`prepublishOnly` repeats typecheck, lint, coverage, build and pack dry-run. The
clean-install smoke deliberately stays in the preceding `npm run verify`: npm
cannot recursively run a second `npm pack` while it is already executing the
publish lifecycle.

`publishConfig.access` is set to `public`. For an unscoped package that is
already the default, so the setting — and the `--access public` flag — are
belt-and-braces rather than load-bearing. They are kept so the package stays
publishable as-is if it is ever moved under a scope.

After publishing, tag and write release notes:

```bash
git tag -a v0.2.0 -m "v0.2.0"
git push origin v0.2.0
```

## 7. Release notes

Take the section from `CHANGELOG.md` verbatim and lead with:

- what the release covers (191 of 194 documented endpoints; SmartProspect complete),
- the unofficial / non-affiliation notice,
- any change to safety defaults,
- anything a reviewer should test manually.

State the coverage figure precisely and name the three excluded endpoints.
Never round 191/194 up to "complete API coverage".

## 8. Distribution tags

- `latest` — the default, for stable releases.
- `next` — pre-releases: `npm publish --tag next` with a version like
  `0.2.0-rc.1`. Use this for anything that changes gating behaviour, so existing
  installs are not upgraded into a looser default.

Move a tag with `npm dist-tag add smartleadai-mcp@<version> latest`.

## 9. Post-publication smoke test

From a clean directory, on a machine that has never built this package:

```bash
mkdir -p /tmp/smartlead-smoke && cd /tmp/smartlead-smoke
npm init -y >/dev/null
npm install smartleadai-mcp
SMARTLEAD_API_KEY=dummy-key-for-startup-only \
  npx --no-install smartleadai-mcp <<'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
EOF
```

Expect an `initialize` result and a `tools/list` result containing 191 tools. A
dummy key is fine: the server does not validate it at startup, and `tools/list`
makes no upstream request.

Also verify the failure path:

```bash
npx --no-install smartleadai-mcp   # with SMARTLEAD_API_KEY unset
# → "Configuration error: Invalid Smartlead MCP configuration — SMARTLEAD_API_KEY: ..." on stderr, exit 1
```

## 10. Deprecation

Deprecate a version rather than unpublishing it:

```bash
npm deprecate smartleadai-mcp@0.1.0 "Superseded by 0.2.0; upgrade for <reason>."
```

Unpublishing is only permissible within 72 hours and only if the package has no
dependents — and it breaks anyone who pinned it. Prefer a patch release.

If a published version leaks a credential or spends credits without the
documented gating:

1. Deprecate the affected versions immediately with a clear message.
2. Publish a fixed version.
3. Publish a security advisory on the repository.
4. Tell affected users to rotate their Smartlead API key.

## 11. Responsible disclosure

Reports about **this package** go through the process in
[`SECURITY.md`](../SECURITY.md): private advisory where available, no
credentials or personal data in the report, acknowledgement within 5 working
days.

Reports about the **Smartlead platform** go to Smartlead directly
(<support@smartlead.ai>), not here. This project is unofficial and cannot fix or
coordinate a Smartlead-side issue.

When a fix ships, credit the reporter in the changelog unless they ask otherwise.

## 12. Naming and trademark position

The package is published unscoped as `smartleadai-mcp`. This was a deliberate
choice for discoverability, and it carries a known, accepted risk that the
maintainer should understand before publishing.

**The risk.** `smartleadai` closely tracks the vendor's own brand
(smartlead.ai), and an unscoped name contains no publisher identity. A user
reading the registry listing cannot tell from the name alone that this is a
third-party project. npm's [package name dispute policy][npm-disputes] is the
mechanism a trademark owner would use, and names that read as the owner's own
package are the category it most readily transfers.

**What mitigates it.** These are load-bearing, not cosmetic — keep them:

- The README opens with the non-affiliation notice, and it is repeated in
  `package.json` `description`, `SECURITY.md`, `CHANGELOG.md` and
  `THIRD_PARTY_NOTICES.md`. Every surface a user might land on says
  "unofficial" before it says anything else.
- No Smartlead logo or brand asset ships in the repository or the tarball.
- The package never describes itself as official, endorsed, or a successor to
  any other Smartlead client.
- `THIRD_PARTY_NOTICES.md` states the nominative-use position explicitly.

**Before publishing**, complete the outstanding Smartlead redistribution, terms
of service, and trademark review. If that review advises against the name, the
lower-risk alternatives — in decreasing order of exposure — are
`smartlead-prospect-mcp` (descriptive, differentiates on SmartProspect
coverage) or a scoped `@voriq-ai/smartleadai-mcp` (the scope identifies the
publisher). Renaming is cheap before the first publish and expensive after,
because every install, MCP client config and lockfile pins the old name.

If a dispute is ever raised, respond promptly and cooperatively: publish under a
new name, `npm deprecate` the old versions with a pointer to the replacement,
and do not unpublish (see section 10).

[npm-disputes]: https://docs.npmjs.com/policies/disputes
