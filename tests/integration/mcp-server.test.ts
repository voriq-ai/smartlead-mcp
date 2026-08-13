import { describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../../src/server.js';
import { allTools } from '../../src/tools/register.js';
import { createMockFetch, noSleep, testConfig, TEST_API_KEY, type MockReply } from '../helpers/mock-fetch.js';
import type { SmartleadConfig } from '../../src/config.js';

async function connect(replies: MockReply[] = [{ json: { success: true, data: [] } }], overrides: Partial<SmartleadConfig> = {}) {
  const mock = createMockFetch(replies);
  const { server } = createServer(testConfig(overrides), { fetchImpl: mock.fetch, sleep: noSleep });
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return { client, server, mock };
}

describe('MCP initialization and tools/list', () => {
  it('initializes and lists every registered tool', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(allTools.length);

    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(allTools.map((t) => t.name).sort());
    await server.close();
  });

  it('matches the expected tool inventory', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    // The full name list is 193 entries; assert the shape that actually matters.
    expect(tools).toHaveLength(191);
    expect(tools.filter((t) => t.name.startsWith('smartprospect_'))).toHaveLength(26);
    expect(tools.filter((t) => t.name.startsWith('smartdelivery_'))).toHaveLength(27);
    expect(tools.filter((t) => t.name.startsWith('smartsenders_'))).toHaveLength(7);
    expect(new Set(tools.map((t) => t.name)).size).toBe(tools.length);
    await server.close();
  });

  it('publishes an input schema, description and annotations for every tool', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description, tool.name).toBeTruthy();
      expect(tool.description, tool.name).toContain('Safety —');
      expect(tool.description, tool.name).toContain('Endpoint:');
      expect(tool.inputSchema, tool.name).toBeTruthy();
      expect(tool.inputSchema.type, tool.name).toBe('object');
      expect(tool.outputSchema, tool.name).toBeTruthy();
      expect(tool.annotations, tool.name).toBeDefined();
    }
    await server.close();
  });

  it('never mentions the removed /verify-emails route', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    const serialized = JSON.stringify(tools);
    expect(serialized).not.toContain('verify-emails');
    expect(serialized).not.toContain('verify_emails');
    await server.close();
  });

  it('never exposes an api key input on any tool', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    for (const tool of tools) {
      const properties = (tool.inputSchema.properties ?? {}) as Record<string, unknown>;
      for (const key of Object.keys(properties)) {
        expect(key.toLowerCase(), tool.name).not.toContain('api_key');
        expect(key.toLowerCase(), tool.name).not.toContain('apikey');
        expect(key.toLowerCase(), tool.name).not.toContain('token');
      }
    }
    await server.close();
  });

  it('advertises the correct read-only and destructive annotations', async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();
    const byName = new Map(tools.map((t) => [t.name, t]));
    expect(byName.get('smartprospect_list_countries')?.annotations?.readOnlyHint).toBe(true);
    expect(byName.get('smartprospect_fetch_contacts')?.annotations?.readOnlyHint).toBe(false);
    expect(byName.get('smartlead_remove_domain_from_block_list')?.annotations?.destructiveHint).toBe(true);
    await server.close();
  });
});

describe('tools/call through the assembled transport', () => {
  it('returns a structured envelope for a successful read-only call', async () => {
    const { client, server, mock } = await connect([
      { json: { success: true, data: [{ id: 1, country_name: 'United States' }], pagination: { limit: 1 } } },
    ]);
    const result = await client.callTool({
      name: 'smartprospect_list_countries',
      arguments: { limit: 1 },
    });

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toMatchObject({
      ok: true,
      operation: 'smartprospect_list_countries',
      credit_spending: false,
      remote_mutation: false,
      data: [{ id: 1, country_name: 'United States' }],
    });

    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0]!.type).toBe('text');
    expect(JSON.parse(content[0]!.text)).toEqual(result.structuredContent);
    expect(mock.calls[0]!.url).toContain('prospect-api.smartlead.ai');
    await server.close();
  });

  it('refuses a credit-consuming call in the default readonly configuration', async () => {
    const { client, server, mock } = await connect();
    const result = await client.callTool({
      name: 'smartprospect_find_emails',
      arguments: {
        contacts: [{ firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' }],
        confirm_credit_spend: true,
      },
    });
    expect(result.isError).toBe(true);
    expect(result.structuredContent).toMatchObject({
      ok: false,
      error: { kind: 'policy', code: 'mode_readonly' },
    });
    expect(mock.calls).toHaveLength(0);
    await server.close();
  });

  it('rejects arguments that violate the documented schema', async () => {
    const { client, server, mock } = await connect();
    const result = await client.callTool({
      name: 'smartprospect_search_contacts',
      arguments: { limit: 5000 },
    });
    expect(result.isError).toBe(true);
    expect(mock.calls).toHaveLength(0);
    await server.close();
  });

  it('rejects an attempt to pass an api key as a tool argument', async () => {
    const { client, server, mock } = await connect();
    const result = await client.callTool({
      name: 'smartprospect_list_countries',
      arguments: { limit: 1, api_key: 'attacker-supplied-key' },
    });
    expect(result.isError).toBe(true);
    expect(mock.calls).toHaveLength(0);
    await server.close();
  });

  it('never leaks the configured api key in a tool result', async () => {
    const { client, server } = await connect([
      { status: 401, json: { statusCode: 401, success: false, message: `Invalid key ${TEST_API_KEY}` } },
    ]);
    const result = await client.callTool({
      name: 'smartprospect_list_countries',
      arguments: { limit: 1 },
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain(TEST_API_KEY);
    expect(serialized).toContain('[REDACTED]');
    await server.close();
  });

  it('reports an unknown tool as an error rather than crashing', async () => {
    const { client, server, mock } = await connect();
    const result = await client.callTool({ name: 'smartlead_send_everything', arguments: {} });
    expect(result.isError).toBe(true);
    expect(mock.calls).toHaveLength(0);
    await server.close();
  });
});
