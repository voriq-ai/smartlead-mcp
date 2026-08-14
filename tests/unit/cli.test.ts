import { describe, expect, it } from 'vitest';
import { PassThrough } from 'node:stream';
import {
  CLI_COMMANDS,
  HELP,
  claudeDesktopConfigPath,
  clientSnippets,
  isCliInvocation,
  maskKey,
  promptSecret,
} from '../../src/cli.js';
import { TEST_API_KEY } from '../helpers/mock-fetch.js';

describe('maskKey', () => {
  it('confirms configuration without revealing any key characters', () => {
    const masked = maskKey(TEST_API_KEY);
    expect(masked).toBe('<configured; hidden>');
    for (const fragment of [TEST_API_KEY.slice(0, 4), TEST_API_KEY.slice(-4)]) {
      expect(masked).not.toContain(fragment);
    }
  });

  it('never reveals any character of a short key', () => {
    expect(maskKey('abc123')).toBe('<configured; hidden>');
  });
});

describe('promptSecret', () => {
  it('returns terminal input without echoing any secret characters', async () => {
    const input = new PassThrough() as PassThrough & { isTTY: boolean };
    input.isTTY = true;
    const output = new PassThrough();
    let transcript = '';
    output.on('data', (chunk) => {
      transcript += chunk.toString();
    });

    const answer = promptSecret('Smartlead API key: ', input, output);
    input.end(`${TEST_API_KEY}\n`);

    await expect(answer).resolves.toBe(TEST_API_KEY);
    expect(transcript).toContain('Smartlead API key: ');
    expect(transcript).not.toContain(TEST_API_KEY);
    expect(transcript).not.toContain(TEST_API_KEY.slice(0, 4));
    expect(transcript).not.toContain(TEST_API_KEY.slice(-4));
  });
});

describe('isCliInvocation', () => {
  it('treats no arguments as MCP server mode', () => {
    expect(isCliInvocation([])).toBe(false);
  });

  it.each(CLI_COMMANDS)('recognises %s as a CLI command', (cmd) => {
    expect(isCliInvocation([cmd])).toBe(true);
  });

  it('does not treat an unknown argument as a CLI command', () => {
    expect(isCliInvocation(['--transport=http'])).toBe(false);
    expect(isCliInvocation(['nonsense'])).toBe(false);
  });
});

describe('client snippets', () => {
  it('uses the published package name and never embeds a real key', () => {
    for (const snippet of clientSnippets('readonly')) {
      expect(snippet.body).toContain('smartleadai-mcp');
      expect(snippet.body).toContain('<your key>');
      expect(snippet.body).not.toContain(TEST_API_KEY);
    }
  });

  it('propagates the chosen mode into every snippet', () => {
    for (const snippet of clientSnippets('standard')) {
      expect(snippet.body).toContain('standard');
    }
  });

  it('offers Claude Desktop, Claude Code and Hermes', () => {
    const labels = clientSnippets('readonly').map((s) => s.label);
    expect(labels.some((l) => l.includes('Claude Desktop'))).toBe(true);
    expect(labels.some((l) => l.includes('Claude Code'))).toBe(true);
    expect(labels.some((l) => l.includes('Hermes'))).toBe(true);
  });

  it('produces valid JSON for the Claude Desktop snippet', () => {
    const desktop = clientSnippets('readonly').find((s) => s.label.includes('Claude Desktop'))!;
    const parsed = JSON.parse(desktop.body) as {
      mcpServers: Record<string, { command: string; args: string[] }>;
    };
    expect(parsed.mcpServers.smartlead!.command).toBe('npx');
    expect(parsed.mcpServers.smartlead!.args).toEqual(['-y', 'smartleadai-mcp']);
  });
});

describe('claudeDesktopConfigPath', () => {
  it('returns an absolute path', () => {
    expect(claudeDesktopConfigPath().startsWith('/') || /^[A-Za-z]:/.test(claudeDesktopConfigPath())).toBe(true);
  });
});

describe('help text', () => {
  it('documents every command and carries the non-affiliation notice', () => {
    for (const cmd of ['init', 'doctor', 'config', 'tools']) {
      expect(HELP).toContain(cmd);
    }
    expect(HELP).toContain('Not affiliated with');
  });

  it('states that readonly is the default mode', () => {
    expect(HELP).toContain('default readonly');
  });
});
