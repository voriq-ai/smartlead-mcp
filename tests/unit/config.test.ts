import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  ConfigError,
  DEFAULT_CORE_BASE_URL,
  DEFAULT_PROSPECT_BASE_URL,
  describeConfig,
  loadConfig,
} from '../../src/config.js';
import { SERVER_VERSION } from '../../src/server.js';
import { TEST_API_KEY } from '../helpers/mock-fetch.js';

const base = { SMARTLEAD_API_KEY: TEST_API_KEY } as NodeJS.ProcessEnv;

describe('loadConfig', () => {
  it('applies safe defaults', () => {
    const config = loadConfig(base);
    expect(config).toMatchObject({
      coreBaseUrl: DEFAULT_CORE_BASE_URL,
      prospectBaseUrl: DEFAULT_PROSPECT_BASE_URL,
      mode: 'readonly',
      allowCreditSpend: false,
      allowSend: false,
      allowDestructive: false,
      timeoutMs: 30_000,
      maxRetries: 2,
    });
  });

  it('requires SMARTLEAD_API_KEY', () => {
    expect(() => loadConfig({})).toThrow(ConfigError);
  });

  it('treats an empty value as unset rather than invalid', () => {
    const config = loadConfig({ ...base, SMARTLEAD_MCP_MODE: '  ' });
    expect(config.mode).toBe('readonly');
  });

  it('rejects an unknown mode', () => {
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_MODE: 'yolo' })).toThrow(/SMARTLEAD_MCP_MODE/);
  });

  it('accepts only the literal strings true and false for flags', () => {
    expect(loadConfig({ ...base, SMARTLEAD_MCP_ALLOW_SEND: 'TRUE' }).allowSend).toBe(true);
    expect(loadConfig({ ...base, SMARTLEAD_MCP_ALLOW_SEND: 'false' }).allowSend).toBe(false);
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_ALLOW_SEND: '1' })).toThrow(/ALLOW_SEND/);
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_ALLOW_SEND: 'yes' })).toThrow(/ALLOW_SEND/);
  });

  it('validates the timeout range', () => {
    expect(loadConfig({ ...base, SMARTLEAD_MCP_TIMEOUT_MS: '45000' }).timeoutMs).toBe(45_000);
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_TIMEOUT_MS: '10' })).toThrow(/TIMEOUT_MS/);
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_TIMEOUT_MS: '900000' })).toThrow(/TIMEOUT_MS/);
  });

  it('validates the retry range', () => {
    expect(loadConfig({ ...base, SMARTLEAD_MCP_MAX_RETRIES: '0' }).maxRetries).toBe(0);
    expect(() => loadConfig({ ...base, SMARTLEAD_MCP_MAX_RETRIES: '9' })).toThrow(/MAX_RETRIES/);
  });

  it('strips trailing slashes from base URLs', () => {
    const config = loadConfig({ ...base, SMARTLEAD_CORE_BASE_URL: 'https://example.test/api/v1///' });
    expect(config.coreBaseUrl).toBe('https://example.test/api/v1');
  });

  it('rejects a non-URL base URL', () => {
    expect(() => loadConfig({ ...base, SMARTLEAD_CORE_BASE_URL: 'not a url' })).toThrow(/CORE_BASE_URL/);
  });

  it('never echoes the api key in a validation error', () => {
    try {
      loadConfig({ ...base, SMARTLEAD_MCP_MODE: 'nope' });
      throw new Error('expected loadConfig to throw');
    } catch (error) {
      expect((error as Error).message).not.toContain(TEST_API_KEY);
    }
  });
});

describe('describeConfig', () => {
  it('reports whether a key is configured without revealing it', () => {
    const described = describeConfig(loadConfig(base));
    expect(described.api_key_configured).toBe(true);
    expect(JSON.stringify(described)).not.toContain(TEST_API_KEY);
  });
});

describe('version consistency', () => {
  it('keeps SERVER_VERSION in step with package.json', async () => {
    // These drifted apart once already: the code was rewritten while the version
    // stayed at 0.1.0, which npm would have rejected at publish time.
    const pkg = JSON.parse(
      await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as { version: string };
    expect(SERVER_VERSION).toBe(pkg.version);
  });
});
