import { describe, expect, it } from 'vitest';
import { CATALOG } from '../../src/catalog/endpoints.js';
import { toolFromCatalog } from '../../src/tools/from-catalog.js';
import { executeTool } from '../../src/tools/register.js';
import { createTestContext, permissiveOverrides } from '../helpers/context.js';
import type { CatalogEntry, CatalogParam } from '../../src/catalog/types.js';

const BASE_URLS = {
  core: 'https://server.smartlead.ai/api/v1',
  prospect: 'https://prospect-api.smartlead.ai/api/v1/search-email-leads',
  delivery: 'https://smartdelivery.smartlead.ai/api/v1',
  senders: 'https://smart-senders.smartlead.ai/api/v1',
} as const;

function sampleValue(param: CatalogParam): unknown {
  if (param.enumValues?.length) return param.enumValues[0];
  switch (param.type) {
    case 'number':
      return Math.max(param.min ?? 1, 1);
    case 'boolean':
      return true;
    case 'array':
      return ['example'];
    case 'object':
      return { example: true };
    case 'string':
    default:
      return param.in === 'path' ? 'id / value' : 'example';
  }
}

function requiredArgs(entry: CatalogEntry): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  for (const param of entry.params) {
    if (param.required || param.in === 'path') args[param.name] = sampleValue(param);
  }
  if (entry.capability.creditSpending) args.confirm_credit_spend = true;
  if (entry.capability.sending) args.confirm_send = true;
  if (entry.capability.destructive) args.confirm_destructive = true;
  if (entry.capability.leadImport) args.confirm_import = true;
  return args;
}

function expectedRoute(entry: CatalogEntry, args: Record<string, unknown>): string {
  return entry.route.replace(/\{([^}]+)\}/g, (_match, name: string) =>
    encodeURIComponent(String(args[name])),
  );
}

describe('catalog endpoint contracts', () => {
  it('declares every route placeholder as a required path parameter', () => {
    for (const entry of CATALOG) {
      const placeholders = [...entry.route.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
      const pathParams = new Map(entry.params.filter((param) => param.in === 'path').map((param) => [param.name, param]));
      for (const placeholder of placeholders) {
        const param = pathParams.get(placeholder!);
        expect(param, `${entry.tool} is missing path parameter ${placeholder}`).toBeDefined();
        expect(param?.required, `${entry.tool}.${placeholder} must be required`).toBe(true);
      }
    }
  });

  it.each(CATALOG)('routes $tool through its documented host and method', async (entry) => {
    const definition = toolFromCatalog(entry);
    const args = requiredArgs(entry);
    const parsed = definition.inputSchema.parse(args);
    const { ctx, mock } = createTestContext([{ json: { success: true, data: [] } }], permissiveOverrides);

    const result = await executeTool(definition, parsed, ctx);
    expect(result.ok, `${entry.tool}: ${JSON.stringify(result.error)}`).toBe(true);
    expect(mock.calls, entry.tool).toHaveLength(1);

    const call = mock.last();
    const url = new URL(call.url);
    expect(call.method, entry.tool).toBe(entry.method);
    expect(`${url.origin}${url.pathname}`, entry.tool).toBe(
      `${BASE_URLS[entry.host]}${expectedRoute(entry, args)}`,
    );

    for (const param of entry.params.filter((candidate) => candidate.in === 'query' && candidate.required)) {
      expect(url.searchParams.get(param.name), `${entry.tool}.${param.name}`).toBe(String(args[param.name]));
    }

    const requiredBody = entry.params.filter((candidate) => candidate.in === 'body' && candidate.required);
    if (requiredBody.length) {
      expect(call.body, entry.tool).toBeTypeOf('object');
      for (const param of requiredBody) {
        expect((call.body as Record<string, unknown>)[param.name], `${entry.tool}.${param.name}`).toEqual(
          args[param.name],
        );
      }
    }

    for (const confirmation of [
      'confirm_credit_spend',
      'confirm_send',
      'confirm_destructive',
      'confirm_import',
    ]) {
      expect((call.body as Record<string, unknown> | undefined)?.[confirmation], entry.tool).toBeUndefined();
    }
  });
});
