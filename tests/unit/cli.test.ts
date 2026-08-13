import { describe, expect, it } from 'vitest';
import {
  CLI_COMMANDS,
  HELP,
  claudeDesktopConfigPath,
  clientSnippets,
  isCliInvocation,
  maskKey,
} from '../../src/cli.js';
import { TEST_API_KEY } from '../helpers/mock-fetch.js';

describe('maskKey', () => {
  it('shows only enough of a key to recognise it', () => {
    const masked = maskKey(TEST_API_KEY);
    expect(masked).not.toBe(TEST_API_KEY);
    expect(masked).not.toContain(TEST_API_KEY);
    expect(masked.startsWith(TEST_API_KEY.slice(0, 4))).toBe(true);
    expect(masked.endsWith(TEST_API_KEY.slice(-4))).toBe(true);
    // The middle must be fully obscured.
    expect(masked.slice(4, -4)).toMatch(/^\*+$/);
  });

  it('never reveals any character of a short key', () => {
    expect(maskKey('abc123')).toBe('******');
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
