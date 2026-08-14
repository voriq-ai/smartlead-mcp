import { describe, expect, it } from 'vitest';
import { CATALOG } from '../../src/catalog/endpoints.js';
import { EXCLUDED_CATALOG_TOOLS, SUPPORTED_CATALOG } from '../../src/catalog/corrections.js';
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
  if (entry.tool === 'smartlead_utilities_send_single_email') args.fromEmail = 'sender@example.com';
  if (entry.tool === 'smartlead_lead_lists_push_between_lists') args.fromListId = 1;
  if (entry.tool === 'smartlead_lead_lists_push_to_campaign') {
    args.campaignId = 1;
    args.leadList = { listId: 1 };
  }
  if (entry.tool === 'smartlead_webhooks_create') args.email_campaign_id = 1;
  return args;
}

function expectedRoute(entry: CatalogEntry, args: Record<string, unknown>): string {
  return entry.route.replace(/\{([^}]+)\}/g, (_match, name: string) =>
    encodeURIComponent(String(args[name])),
  );
}

function schemaFor(name: string) {
  const entry = SUPPORTED_CATALOG.find((candidate) => candidate.tool === name);
  if (!entry) throw new Error(`missing supported catalog entry ${name}`);
  return toolFromCatalog(entry).inputSchema;
}

describe('catalog endpoint contracts', () => {
  it('excludes unsafe, duplicate, or malformed documentation pages', () => {
    expect(Object.keys(EXCLUDED_CATALOG_TOOLS)).toHaveLength(8);
    expect(SUPPORTED_CATALOG).toHaveLength(144);
    const supportedNames = new Set(SUPPORTED_CATALOG.map((entry) => entry.tool));
    for (const name of Object.keys(EXCLUDED_CATALOG_TOOLS)) expect(supportedNames.has(name)).toBe(false);
  });

  it('never exposes documentation breadcrumb names as literal dotted JSON fields', () => {
    for (const entry of SUPPORTED_CATALOG) {
      expect(entry.params.filter((param) => param.name.includes('.')), entry.tool).toEqual([]);
    }
  });

  it('keeps nested request structures inside their documented parent values', () => {
    expect(schemaFor('smartlead_campaigns_reply_email_thread').safeParse({
      campaign_id: 1,
      email_stats_id: 'message',
      email_body: 'reply',
    }).success).toBe(true);
    expect(schemaFor('smartlead_campaigns_update_schedule').safeParse({
      campaign_id: 1,
      schedule: { timezone: 'Europe/London', days: [1, 2, 3], start_hour: '09:00', end_hour: '17:00' },
    }).success).toBe(true);
    expect(schemaFor('smartlead_campaigns_update_sequences').safeParse({
      campaign_id: 1,
      sequences: [{ seq_number: 1, email_body: 'Hello', seq_delay_details: { delay_in_days: 1 } }],
    }).success).toBe(true);
  });

  it('enforces documented cross-field requirements before HTTP', () => {
    const send = schemaFor('smartlead_utilities_send_single_email');
    expect(send.safeParse({ to: 'to@example.com', subject: 'subject', body: 'body' }).success).toBe(false);
    expect(send.safeParse({ to: 'to@example.com', subject: 'subject', body: 'body', fromEmailId: 1 }).success).toBe(true);

    const between = schemaFor('smartlead_lead_lists_push_between_lists');
    expect(between.safeParse({ action: 'duplicate', fromListId: 1, toListId: 2 }).success).toBe(false);
    expect(between.safeParse({ action: 'copy', toListId: 2 }).success).toBe(false);
    expect(between.safeParse({ action: 'copy', fromListId: 1, toListId: 2 }).success).toBe(true);

    const campaign = schemaFor('smartlead_lead_lists_push_to_campaign');
    expect(campaign.safeParse({ action: 'copy', campaignId: 1, campaignName: 'duplicate', leadList: { listId: 1 } }).success).toBe(false);
    expect(campaign.safeParse({ action: 'copy', campaignId: 1, leadList: { listId: 1, allLeads: true } }).success).toBe(false);
    expect(campaign.safeParse({ action: 'copy', campaignId: 1, leadList: { listId: 1 } }).success).toBe(true);

    const webhook = schemaFor('smartlead_webhooks_create');
    expect(webhook.safeParse({ webhook_url: 'https://example.com/hook', association_type: 'unknown' }).success).toBe(false);
    expect(webhook.safeParse({ webhook_url: 'https://example.com/hook', association_type: 'campaign' }).success).toBe(false);
    expect(webhook.safeParse({ webhook_url: 'https://example.com/hook', association_type: 'campaign', email_campaign_id: 1 }).success).toBe(true);

    const mailbox = schemaFor('smartlead_campaign_statistics_mailbox_statistics');
    expect(mailbox.safeParse({ campaign_id: 1, start_date: '2026-01-01' }).success).toBe(false);
    expect(mailbox.safeParse({ campaign_id: 1, start_date: '2026-01-01', end_date: '2026-01-31' }).success).toBe(true);
  });

  it('uses numeric schemas for fields documented as integers', () => {
    const mailbox = schemaFor('smartlead_campaign_statistics_mailbox_statistics');
    expect(mailbox.safeParse({ campaign_id: '1' }).success).toBe(false);
    expect(mailbox.safeParse({ campaign_id: 1, offset: 0, limit: 20 }).success).toBe(true);

    const searchDomain = schemaFor('smartsenders_search_domain');
    expect(searchDomain.safeParse({ vendor_id: '1' }).success).toBe(false);
    expect(searchDomain.safeParse({ vendor_id: 1 }).success).toBe(true);
  });

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

  it.each(SUPPORTED_CATALOG)('routes $tool through its documented host and method', async (entry) => {
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
    if (
      requiredBody.length === 0 &&
      entry.params.every((candidate) => candidate.in !== 'body') &&
      entry.method !== 'GET' &&
      entry.method !== 'DELETE'
    ) {
      expect(call.body, entry.tool).toEqual({});
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
