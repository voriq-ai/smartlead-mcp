import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { writeFile, readFile, chmod } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir, platform } from 'node:os';
import { ConfigError, SERVER_NAME, loadConfig, describeConfig, type SmartleadConfig } from './config.js';
import { ClientRegistry } from './client/registry.js';
import { allTools } from './tools/register.js';
import { redactSecrets } from './security/redaction.js';
import { SmartleadApiError } from './client/errors.js';

/**
 * Onboarding CLI.
 *
 * Runs only when a subcommand is passed. With no arguments the binary is an
 * MCP stdio server, so nothing here may write to stdout in that mode.
 */

const PKG = 'smartleadai-mcp';

function out(line = ''): void {
  process.stdout.write(`${line}\n`);
}

const bold = (s: string) => (process.stdout.isTTY ? `[1m${s}[0m` : s);
const dim = (s: string) => (process.stdout.isTTY ? `[2m${s}[0m` : s);
const green = (s: string) => (process.stdout.isTTY ? `[32m${s}[0m` : s);
const red = (s: string) => (process.stdout.isTTY ? `[31m${s}[0m` : s);
const yellow = (s: string) => (process.stdout.isTTY ? `[33m${s}[0m` : s);

/** Confirm that a key exists without disclosing any of its characters. */
export function maskKey(_key: string): string {
  return '<configured; hidden>';
}

/** Read a secret from a terminal without echoing it to the output stream. */
export async function promptSecret(
  question: string,
  input: NodeJS.ReadableStream = process.stdin,
  output: NodeJS.WritableStream = process.stdout,
): Promise<string> {
  let muted = true;
  const mutedOutput = new Writable({
    write(chunk, _encoding, callback) {
      if (!muted) output.write(chunk);
      callback();
    },
  });
  output.write(question);
  const rl = createInterface({
    input,
    output: mutedOutput,
    terminal: Boolean((input as NodeJS.ReadStream).isTTY),
  });
  try {
    return await rl.question('');
  } finally {
    muted = false;
    rl.close();
    output.write('\n');
  }
}

/** Build a safe append block for an existing dotenv file. */
export function dotenvAppendBlock(existing: string, key: string, mode: string): string {
  if (/[\r\n]/.test(key)) throw new Error('SMARTLEAD_API_KEY must not contain a newline');
  const prefix = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
  return `${prefix}SMARTLEAD_API_KEY=${key}\nSMARTLEAD_MCP_MODE=${mode}\n`;
}

export const HELP = `${PKG} — unofficial MCP server for the Smartlead API

${bold('USAGE')}
  ${PKG}                      Start the MCP server on stdio (what MCP clients run)
  ${PKG} <command>            Run a helper command

${bold('COMMANDS')}
  init            Interactive setup: check the API key and print client config
  doctor          Diagnose configuration and verify the API key against Smartlead
  config          Print the effective configuration (credential redacted)
  tools           List available tools and their safety classification
  help            Show this help
  version         Print the version

${bold('ENVIRONMENT')}
  SMARTLEAD_API_KEY                  required
  SMARTLEAD_MCP_MODE                 readonly | standard | unrestricted   (default readonly)
  SMARTLEAD_MCP_ALLOW_CREDIT_SPEND   true | false                         (default false)
  SMARTLEAD_MCP_ALLOW_SEND           true | false                         (default false)
  SMARTLEAD_MCP_ALLOW_DESTRUCTIVE    true | false                         (default false)

${dim('Not affiliated with, endorsed by, or sponsored by Smartlead.ai.')}
`;

/** Claude Desktop's config path, per platform. */
export function claudeDesktopConfigPath(): string {
  const home = homedir();
  if (platform() === 'darwin') {
    return resolve(home, 'Library/Application Support/Claude/claude_desktop_config.json');
  }
  if (platform() === 'win32') {
    return resolve(process.env.APPDATA ?? resolve(home, 'AppData/Roaming'), 'Claude/claude_desktop_config.json');
  }
  return resolve(home, '.config/Claude/claude_desktop_config.json');
}

export function clientSnippets(mode: string): { label: string; path?: string; body: string }[] {
  const env = {
    SMARTLEAD_API_KEY: '<your key>',
    SMARTLEAD_MCP_MODE: mode,
  };
  return [
    {
      label: 'Claude Desktop',
      path: claudeDesktopConfigPath(),
      body: JSON.stringify(
        { mcpServers: { smartlead: { command: 'npx', args: ['-y', PKG], env } } },
        null,
        2,
      ),
    },
    {
      label: 'Claude Code',
      body: `claude mcp add smartlead --env SMARTLEAD_API_KEY=<your key> --env SMARTLEAD_MCP_MODE=${mode} -- npx -y ${PKG}`,
    },
    {
      label: 'Hermes (~/.hermes/config.yaml)',
      body: [
        'mcp_servers:',
        '  smartlead:',
        '    command: "npx"',
        `    args: ["-y", "${PKG}"]`,
        '    env:',
        '      SMARTLEAD_API_KEY: "<your key>"',
        `      SMARTLEAD_MCP_MODE: "${mode}"`,
      ].join('\n'),
    },
  ];
}

/**
 * Validate a key against a free, read-only endpoint.
 *
 * `GET /countries?limit=1` costs nothing and touches no contact data, so
 * `doctor` can never spend credits or reveal a prospect.
 */
async function verifyKey(config: SmartleadConfig): Promise<{ ok: true } | { ok: false; reason: string; kind: string }> {
  const registry = new ClientRegistry(config);
  try {
    await registry.call('prospect', 'GET', '/countries', { query: { limit: 1 } });
    return { ok: true };
  } catch (error) {
    const api = error instanceof SmartleadApiError ? error : undefined;
    return {
      ok: false,
      kind: api?.kind ?? 'unknown',
      reason: redactSecrets(api?.message ?? String(error), [config.apiKey]),
    };
  }
}

async function commandDoctor(): Promise<number> {
  out(bold('smartleadai-mcp doctor'));
  out();

  let config: SmartleadConfig;
  try {
    config = loadConfig();
  } catch (error) {
    out(`${red('✗')} configuration  ${error instanceof ConfigError ? error.message : String(error)}`);
    out();
    out(`  Set SMARTLEAD_API_KEY, then re-run. Get a key from:`);
    out(`  https://app.smartlead.ai/app/settings/profile`);
    return 1;
  }

  out(`${green('✓')} configuration  valid`);
  out(`  key            ${maskKey(config.apiKey)}`);
  out(`  mode           ${config.mode}${config.mode === 'readonly' ? dim('  (default — no writes, no credit spend)') : ''}`);
  out(`  credit spend   ${config.allowCreditSpend ? yellow('enabled') : 'disabled'}`);
  out(`  sending        ${config.allowSend ? yellow('enabled') : 'disabled'}`);
  out(`  destructive    ${config.allowDestructive ? yellow('enabled') : 'disabled'}`);
  out(`  timeout        ${config.timeoutMs}ms`);
  out();

  out(dim('  checking the key against a free read-only endpoint...'));
  const result = await verifyKey(config);
  if (result.ok) {
    out(`${green('✓')} api key        accepted by Smartlead`);
  } else {
    out(`${red('✗')} api key        ${result.kind}: ${result.reason}`);
    if (result.kind === 'authentication') {
      out(`  The key was rejected. Check it at https://app.smartlead.ai/app/settings/profile`);
    } else if (result.kind === 'permission') {
      out(`  The key is valid but lacks SmartProspect access on this plan.`);
    }
    return 1;
  }

  out(`${green('✓')} tools          ${allTools.length} registered`);
  out();
  out(dim('  No credits were spent: doctor only calls GET /countries?limit=1.'));
  return 0;
}

function commandConfig(): number {
  try {
    const config = loadConfig();
    out(JSON.stringify(describeConfig(config), null, 2));
    return 0;
  } catch (error) {
    out(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }, null, 2));
    return 1;
  }
}

function commandTools(argv: string[]): number {
  const filter = argv.find((a) => !a.startsWith('-'));
  const rows = allTools
    .filter((t) => !filter || t.name.includes(filter))
    .map((t) => {
      const marks: string[] = [];
      if (t.capability.readOnly) marks.push('read-only');
      else marks.push('mutates');
      if (t.capability.creditSpending) marks.push(yellow('COSTS CREDITS'));
      if (t.capability.sending) marks.push(yellow('SENDS EMAIL'));
      if (t.capability.destructive) marks.push(red('DESTRUCTIVE'));
      return { name: t.name, marks: marks.join(', ') };
    });

  if (rows.length === 0) {
    out(`no tools match "${filter}"`);
    return 1;
  }
  const width = Math.max(...rows.map((r) => r.name.length));
  for (const r of rows) out(`${r.name.padEnd(width)}  ${dim(r.marks)}`);
  out();
  out(`${rows.length} tool(s)${filter ? ` matching "${filter}"` : ''}`);
  return 0;
}

async function commandInit(): Promise<number> {
  out(bold(`${PKG} setup`));
  out();
  out(dim('Not affiliated with, endorsed by, or sponsored by Smartlead.ai.'));
  out();

  let key = process.env.SMARTLEAD_API_KEY?.trim() ?? '';
  if (key) {
    out(`Found SMARTLEAD_API_KEY in the environment: ${maskKey(key)}`);
  } else {
    out('Get your API key from https://app.smartlead.ai/app/settings/profile');
    out();
    key = (await promptSecret('Smartlead API key: ')).trim();
    if (!key) {
      out(red('No key entered.'));
      return 1;
    }
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    out();
    out(dim('Verifying against a free read-only endpoint...'));
    const probe = await verifyKey({ ...loadConfigWithKey(key) });
    if (!probe.ok) {
      out(`${red('✗')} ${probe.kind}: ${probe.reason}`);
      return 1;
    }
    out(`${green('✓')} key accepted by Smartlead`);
    out();

    const answer = (
      await rl.question('Mode — [1] readonly (recommended)  [2] standard  [3] unrestricted: ')
    ).trim();
    const mode = answer === '3' ? 'unrestricted' : answer === '2' ? 'standard' : 'readonly';
    out();
    if (mode !== 'readonly') {
      out(yellow(`Mode ${mode} allows writes to your Smartlead account.`));
      out(
        dim(
          '  Credit spend, sending and destructive actions each still need their own\n' +
            '  environment flag AND a per-call confirmation, so this alone cannot spend money.',
        ),
      );
      out();
    }

    for (const snippet of clientSnippets(mode)) {
      out(bold(snippet.label));
      if (snippet.path) out(dim(`  ${snippet.path}${existsSync(snippet.path) ? '' : '  (not found — create it)'}`));
      out();
      out(
        snippet.body
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n'),
      );
      out();
    }

    out(dim('Replace <your key> with your real key. Keep it out of shell history and'));
    out(dim('out of version control — the server only ever reads it from the environment.'));
    out();

    const writeEnv = (await rl.question('Also write a local .env file for development? [y/N]: ')).trim().toLowerCase();
    if (writeEnv === 'y' || writeEnv === 'yes') {
      const path = resolve(process.cwd(), '.env');
      let existing = '';
      if (existsSync(path)) {
        existing = await readFile(path, 'utf8');
        if (existing.includes('SMARTLEAD_API_KEY')) {
          out(yellow(`  .env already defines SMARTLEAD_API_KEY — leaving it untouched.`));
          return 0;
        }
      }
      await writeFile(path, dotenvAppendBlock(existing, key, mode), { flag: 'a' });
      await chmod(path, 0o600);
      out(`${green('✓')} wrote ${path} (mode 0600)`);
      out(dim('  Make sure .env is git-ignored.'));
    }
    return 0;
  } finally {
    rl.close();
  }
}

/** Build a config around a supplied key, leaving other settings at their defaults. */
function loadConfigWithKey(key: string): SmartleadConfig {
  return loadConfig({ ...process.env, SMARTLEAD_API_KEY: key });
}

export const CLI_COMMANDS = ['init', 'doctor', 'config', 'tools', 'help', 'version', '--help', '-h', '--version', '-v'];

export function isCliInvocation(argv: readonly string[]): boolean {
  return argv.length > 0 && CLI_COMMANDS.includes(argv[0] as string);
}

export async function runCli(argv: string[], version: string): Promise<number> {
  const [command, ...rest] = argv;
  switch (command) {
    case 'version':
    case '--version':
    case '-v':
      out(`${SERVER_NAME} ${version}`);
      return 0;
    case 'doctor':
      return commandDoctor();
    case 'config':
      return commandConfig();
    case 'tools':
      return commandTools(rest);
    case 'init':
      return commandInit();
    case 'help':
    case '--help':
    case '-h':
    default:
      out(HELP);
      return 0;
  }
}
