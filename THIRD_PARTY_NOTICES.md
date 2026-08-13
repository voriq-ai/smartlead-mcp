# Third-party notices

## Code provenance

`@voriq/smartlead-mcp` is a clean-room implementation written from Smartlead's
public official API documentation:

- <https://api.smartlead.ai/introduction>
- <https://api.smartlead.ai/llms.txt>
- <https://api.smartlead.ai/llms-full.txt>
- <https://api.smartlead.ai/api-reference/> (per-endpoint pages)

No source code was copied from any third-party Smartlead client, including
`@bcharleson/smartlead-cli`. Endpoint routes, HTTP methods, parameter names,
value ranges and response shapes were taken from the official documentation
pages listed in [`docs/endpoint-coverage.md`](docs/endpoint-coverage.md), each
with the date the page was checked.

Because no third-party code was reused, there are no third-party copyright or
licence notices to reproduce here. If code from an MIT-licensed (or other)
project is ever vendored into this package, its copyright notice and licence
text must be added to this file in the same commit.

## Runtime dependencies

These packages are installed alongside `@voriq/smartlead-mcp`. Their licences
apply to their own code, which is not vendored into this repository.

| Package | Licence | Purpose |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | MIT | MCP server implementation and stdio transport |
| `zod` | MIT | Runtime schema validation for tool inputs and configuration |

Development-only dependencies (TypeScript, tsup, Vitest, ESLint and their
transitive dependencies) are not shipped in the published tarball.

## Trademarks

"Smartlead", "SmartProspect" and related names and logos are trademarks of their
respective owner. This project is **not affiliated with, endorsed by, or
sponsored by Smartlead.ai**. Those names are used here only to describe which
API this software talks to (nominative use). No Smartlead logo or brand asset is
included in this repository or in the published package.
