import { z } from 'zod';
import { capability } from '../security/policy.js';
import { confirmationFlag } from '../schemas/common.js';
import { defineTool, type AnyToolDefinition, type ToolPayload } from './types.js';
import { unwrap } from './shape.js';
import type { CatalogEntry, CatalogParam } from '../catalog/types.js';
import type { QueryValue } from '../client/http.js';

/**
 * Build MCP tools from the endpoint catalog.
 *
 * The 39 hand-written tools encode every documented constraint and stay
 * hand-written. Catalog tools cover the long tail: they validate parameter
 * names, types, presence and any range or enum the documentation stated
 * explicitly, but they cannot express cross-field rules (XOR, conditional
 * requirements). Where such a rule exists, the endpoint belongs in a
 * hand-written tool instead.
 */

function scalarSchema(param: CatalogParam): z.ZodTypeAny {
  if (param.enumValues && param.enumValues.length > 1) {
    return z.enum(param.enumValues as [string, ...string[]]);
  }
  switch (param.type) {
    case 'number': {
      let schema = z.number();
      if (param.min !== undefined) schema = schema.min(param.min);
      if (param.max !== undefined) schema = schema.max(param.max);
      return schema;
    }
    case 'boolean':
      return z.boolean();
    case 'array':
      // The documentation rarely states the element type; accept any JSON value
      // rather than guessing and rejecting a valid request.
      return z.array(z.unknown()).min(param.required ? 1 : 0);
    case 'object':
      return z.record(z.string(), z.unknown());
    case 'string':
    default: {
      let schema = z.string();
      if (param.min !== undefined) schema = schema.min(param.min);
      if (param.max !== undefined) schema = schema.max(param.max);
      return schema;
    }
  }
}

function buildInputSchema(entry: CatalogEntry): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const param of entry.params) {
    let schema = scalarSchema(param).describe(
      `${param.description || param.name} (${param.in} parameter)`.trim(),
    );
    // Path parameters are structurally required: the route cannot be built without them.
    const required = param.required || param.in === 'path';
    if (!required) schema = schema.optional();
    shape[param.name] = schema;
  }

  const cap = entry.capability;
  if (cap.creditSpending) {
    shape.confirm_credit_spend = confirmationFlag(
      'Must be true. Acknowledges that this call can consume SmartProspect credits.',
    );
  }
  if (cap.sending) {
    shape.confirm_send = confirmationFlag(
      'Must be true. Acknowledges that this call can cause email to be sent.',
    );
  }
  if (cap.destructive) {
    shape.confirm_destructive = confirmationFlag(
      'Must be true. Acknowledges that this call is irreversible.',
    );
  }
  if (cap.leadImport) {
    shape.confirm_import = confirmationFlag(
      'Must be true. Acknowledges that leads will be written into the target campaign.',
    );
  }

  // Not strict: Smartlead documents optional fields inconsistently across
  // families, and rejecting an undocumented-but-valid field would be worse than
  // forwarding it. Hand-written tools remain strict.
  return z.object(shape as z.ZodRawShape);
}

const CONFIRMATION_FIELDS = new Set([
  'confirm_credit_spend',
  'confirm_send',
  'confirm_destructive',
  'confirm_import',
]);

export function toolFromCatalog(entry: CatalogEntry): AnyToolDefinition {
  const inputSchema = buildInputSchema(entry);
  const byLocation = {
    path: entry.params.filter((p) => p.in === 'path'),
    query: entry.params.filter((p) => p.in === 'query'),
    body: entry.params.filter((p) => p.in === 'body'),
  };

  return defineTool({
    name: entry.tool,
    title: entry.title,
    summary: entry.summary,
    notes: [...(entry.notes ?? []), `Documentation: ${entry.docUrl}`],
    capability: capability(entry.capability),
    endpoint: { host: entry.host, method: entry.method, route: entry.route },
    inputSchema,
    handler: async (args: Record<string, unknown>, ctx): Promise<ToolPayload> => {
      const pathParams: Record<string, string | number> = {};
      for (const p of byLocation.path) {
        const value = args[p.name];
        if (value !== undefined) pathParams[p.name] = value as string | number;
      }

      const query: Record<string, QueryValue> = {};
      for (const p of byLocation.query) {
        const value = args[p.name];
        if (value !== undefined) query[p.name] = value as QueryValue;
      }

      let body: Record<string, unknown> | undefined;
      for (const p of byLocation.body) {
        const value = args[p.name];
        if (value === undefined) continue;
        body ??= {};
        body[p.name] = value;
      }

      // Confirmation flags are policy inputs, never request payload.
      for (const key of Object.keys(args)) {
        if (CONFIRMATION_FIELDS.has(key)) continue;
        const known = entry.params.some((p) => p.name === key);
        if (!known && body) delete body[key];
      }

      const result = await ctx.clients.call(entry.host, entry.method, entry.route, {
        pathParams,
        query,
        body,
        // A mutation is never auto-retried: Smartlead documents no idempotency key.
        retryable: entry.method === 'GET',
      });

      return unwrap(result);
    },
  }) as AnyToolDefinition;
}

export function toolsFromCatalog(entries: readonly CatalogEntry[]): AnyToolDefinition[] {
  return entries.map(toolFromCatalog);
}
