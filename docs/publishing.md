# Publishing

**Nothing in this repository has been published.** Version 0.1.0 is prepared for
independent review first. Do not run `npm publish` until a reviewer has verified
the package.

## 1. npm name check

`@voriq/smartlead-mcp` was checked on **2026-08-14** and is unregistered:

```bash
npm view @voriq/smartlead-mcp version
# npm error code E404
# npm error 404 Not Found - GET https://registry.npmjs.org/@voriq%2fsmartlead-mcp
```

`npm view` is read-only: it neither reserves the name nor creates the scope.
Re-run it immediately before publishing, because an unregistered name is not a
reservation.

## 2. Prerequisites

1. **The `@voriq` scope must exist on npm** and your account must be a member
   with publish rights. Creating an organisation scope is a one-off action in
   the npm web UI or via `npm org`. This has not been done.
2. **Authenticate**: `npm login` (or a CI automation token in `NPM_TOKEN`).
   Verify with `npm whoami`.
3. **Enable 2FA for publishes** on the npm account. For CI, use a granular
   access token scoped to this package only.
4. **Repository metadata is set** to <https://github.com/voriq-ai/smartlead-mcp>
   (public, MIT, default branch `master`). `homepage`, `repository.url` and
   `bugs.url` in `package.json` all point at it, which is what npm provenance
   checks against — if the repository ever moves, update all three together.

## 3. Versioning

Semantic versioning, starting at `0.1.0`.

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
npm pack                       # produces voriq-smartlead-mcp-0.1.0.tgz
tar -xOzf voriq-smartlead-mcp-*.tgz | grep -aiE 'api[_-]?key=[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY'
rm voriq-smartlead-mcp-*.tgz
```

That grep should print nothing. Documentation strings such as
`api_key=YOUR_API_KEY` are expected and harmless; a real-looking value is not.

## 5. Provenance

Publishing from a public GitHub repository via GitHub Actions with
`--provenance` attaches a signed attestation linking the tarball to the commit
and workflow that built it. Recommended once a repository exists:

```yaml
# .github/workflows/publish.yml
permissions:
  contents: read
  id-token: write   # required for provenance
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      registry-url: https://registry.npmjs.org
  - run: npm ci
  - run: npm run verify
  - run: npm publish --access public --provenance
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Provenance requires a public repository and a supported CI provider. Publishing
from a laptop cannot produce it.

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

`publishConfig.access` is already `public`, which is required for a scoped
package that should not be private.

After publishing, tag and write release notes:

```bash
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

## 7. Release notes

Take the section from `CHANGELOG.md` verbatim and lead with:

- what the release covers (SmartProspect complete, core Smartlead partial),
- the unofficial / non-affiliation notice,
- any change to safety defaults,
- anything a reviewer should test manually.

Never claim full Smartlead API coverage.

## 8. Distribution tags

- `latest` — the default, for stable releases.
- `next` — pre-releases: `npm publish --tag next` with a version like
  `0.2.0-rc.1`. Use this for anything that changes gating behaviour, so existing
  installs are not upgraded into a looser default.

Move a tag with `npm dist-tag add @voriq/smartlead-mcp@0.1.0 latest`.

## 9. Post-publication smoke test

From a clean directory, on a machine that has never built this package:

```bash
mkdir -p /tmp/smartlead-smoke && cd /tmp/smartlead-smoke
npm init -y >/dev/null
npm install @voriq/smartlead-mcp
SMARTLEAD_API_KEY=dummy-key-for-startup-only \
  npx --no-install smartlead-mcp <<'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
EOF
```

Expect an `initialize` result and a `tools/list` result containing 39 tools. A
dummy key is fine: the server does not validate it at startup, and `tools/list`
makes no upstream request.

Also verify the failure path:

```bash
npx --no-install smartlead-mcp   # with SMARTLEAD_API_KEY unset
# → "Configuration error: Invalid Smartlead MCP configuration — SMARTLEAD_API_KEY: ..." on stderr, exit 1
```

## 10. Deprecation

Deprecate a version rather than unpublishing it:

```bash
npm deprecate @voriq/smartlead-mcp@0.1.0 "Superseded by 0.2.0; upgrade for <reason>."
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
