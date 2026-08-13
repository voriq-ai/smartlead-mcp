#!/usr/bin/env node
/**
 * End-to-end smoke test of the *packed* package.
 *
 * Builds a tarball, installs it into a throwaway directory, launches the
 * installed `smartleadai-mcp` binary over stdio, and drives it with a real MCP
 * client: initialize, tools/list, and two tools/call round trips.
 *
 * No network access to Smartlead is required or performed. The API key below is
 * synthetic; the calls exercised here are refused locally by the policy layer
 * and by input validation, so nothing is ever sent upstream.
 *
 *   node scripts/smoke-installed-package.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const EXPECTED_TOOL_COUNT = 191;
const SYNTHETIC_KEY = 'smoke-test-key-not-a-real-credential';

const projectRoot = new URL('..', import.meta.url).pathname;
const workdir = mkdtempSync(join(tmpdir(), 'smartleadai-mcp-smoke-'));
const checks = [];

function check(label, condition, detail = '') {
  checks.push({ label, ok: Boolean(condition), detail });
  process.stdout.write(`${condition ? 'ok  ' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}\n`);
}

function run(command, args, cwd) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

try {
  process.stdout.write(`workdir: ${workdir}\n`);
  run('npm', ['run', 'build'], projectRoot);
  run('npm', ['pack', '--pack-destination', workdir], projectRoot);

  const tarball = readdirSync(workdir).find((f) => f.endsWith('.tgz'));
  if (!tarball) throw new Error('npm pack produced no tarball');

  run('npm', ['init', '-y'], workdir);
  run('npm', ['install', join(workdir, tarball)], workdir);

  // Import the SDK from the throwaway install so the client talks to exactly
  // the dependency tree a real consumer would get.
  const require = createRequire(join(workdir, 'noop.js'));
  const { Client } = await import(require.resolve('@modelcontextprotocol/sdk/client/index.js'));
  const { StdioClientTransport } = await import(
    require.resolve('@modelcontextprotocol/sdk/client/stdio.js')
  );

  const transport = new StdioClientTransport({
    command: 'node',
    args: [join(workdir, 'node_modules', '.bin', 'smartleadai-mcp')],
    cwd: workdir,
    env: { PATH: process.env.PATH, SMARTLEAD_API_KEY: SYNTHETIC_KEY, SMARTLEAD_MCP_MODE: 'readonly' },
    stderr: 'pipe',
  });

  const client = new Client({ name: 'smartleadai-mcp-smoke', version: '0.0.0' });
  await client.connect(transport);

  const serverInfo = client.getServerVersion();
  check('initialize returns server info', serverInfo?.name === 'smartleadai-mcp', JSON.stringify(serverInfo));

  const { tools } = await client.listTools();
  check(`tools/list returns ${EXPECTED_TOOL_COUNT} tools`, tools.length === EXPECTED_TOOL_COUNT, `got ${tools.length}`);
  check(
    'every tool has a description, input schema and output schema',
    tools.every((t) => t.description && t.inputSchema && t.outputSchema),
  );
  check(
    'no tool accepts a credential as an argument',
    tools.every((t) => !Object.keys(t.inputSchema?.properties ?? {}).some((k) => /api_?key|token/i.test(k))),
  );
  check('nothing references the nonexistent /verify-emails route', !JSON.stringify(tools).includes('verify-emails'));

  const refusal = await client.callTool({
    name: 'smartprospect_find_emails',
    arguments: {
      contacts: [{ firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' }],
      confirm_credit_spend: true,
    },
  });
  check(
    'credit-spending tool is refused in readonly mode',
    refusal.isError === true && refusal.structuredContent?.error?.code === 'mode_readonly',
    JSON.stringify(refusal.structuredContent?.error),
  );

  const invalid = await client.callTool({
    name: 'smartprospect_search_contacts',
    arguments: { limit: 9999 },
  });
  check('out-of-range input is rejected by the schema', invalid.isError === true);

  check(
    'no tool result leaks the configured key',
    !JSON.stringify([refusal, invalid]).includes(SYNTHETIC_KEY),
  );

  await client.close();
} finally {
  rmSync(workdir, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
process.stdout.write(`\n${checks.length - failed.length}/${checks.length} checks passed\n`);
process.exit(failed.length === 0 ? 0 : 1);
