import { describe, expect, it } from 'vitest';
import { executeTool, findTool, allTools } from '../../src/tools/register.js';
import { dedupeLeads } from '../../src/tools/core/leads.js';
import { summarizeCredits } from '../../src/tools/smart-prospect/analytics.js';
import { createTestContext, permissiveOverrides } from '../helpers/context.js';
import { TEST_API_KEY } from '../helpers/mock-fetch.js';
import type { AnyToolDefinition } from '../../src/tools/types.js';

function tool(name: string): AnyToolDefinition {
  const definition = findTool(name);
  if (!definition) throw new Error(`tool ${name} not registered`);
  return definition;
}

async function run(name: string, rawArgs: Record<string, unknown>, overrides = permissiveOverrides, replies?: Parameters<typeof createTestContext>[0]) {
  const definition = tool(name);
  const { ctx, mock } = createTestContext(replies, overrides);
  const args = definition.inputSchema.parse(rawArgs);
  const envelope = await executeTool(definition, args, ctx);
  return { envelope, mock };
}

const CONTACT = { firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' };

describe('envelope shape', () => {
  it('returns the normalised success envelope', async () => {
    const { envelope } = await run('smartprospect_list_countries', {}, permissiveOverrides, [
      { json: { success: true, data: [{ id: 1, country_name: 'United States' }], pagination: { limit: 10 } } },
    ]);
    expect(envelope).toMatchObject({
      ok: true,
      operation: 'smartprospect_list_countries',
      credit_spending: false,
      remote_mutation: false,
      data: [{ id: 1, country_name: 'United States' }],
      pagination: { limit: 10 },
      warnings: [],
    });
    expect(envelope.error).toBeUndefined();
  });

  it('reports upstream failures as a structured error without a stack trace', async () => {
    const { envelope } = await run('smartprospect_list_countries', {}, permissiveOverrides, [
      { status: 401, json: { statusCode: 401, success: false, message: 'Unauthorized' } },
    ]);
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.kind).toBe('authentication');
    expect(JSON.stringify(envelope)).not.toContain('at Object');
    expect(JSON.stringify(envelope)).not.toContain(TEST_API_KEY);
  });

  it('marks credit_spending true on the envelope for credit tools', async () => {
    const { envelope } = await run(
      'smartprospect_find_emails',
      { contacts: [CONTACT], confirm_credit_spend: true },
      permissiveOverrides,
      [{ json: { success: true, data: [{ ...CONTACT, email_id: 'ada@example.com', status: 'Found' }] } }],
    );
    expect(envelope.credit_spending).toBe(true);
    expect(envelope.remote_mutation).toBe(true);
  });
});

describe('credit gating', () => {
  it('refuses find_emails without the environment flag and makes no request', async () => {
    const { envelope, mock } = await run('smartprospect_find_emails', {
      contacts: [CONTACT],
      confirm_credit_spend: true,
    }, { mode: 'unrestricted', allowCreditSpend: false });
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.code).toBe('credit_spend_disabled');
    expect(mock.calls).toHaveLength(0);
  });

  it('refuses find_emails without the per-call confirmation and makes no request', async () => {
    const { envelope, mock } = await run(
      'smartprospect_find_emails',
      { contacts: [CONTACT] },
      { mode: 'unrestricted', allowCreditSpend: true },
    );
    expect(envelope.error?.code).toBe('credit_spend_unconfirmed');
    expect(mock.calls).toHaveLength(0);
  });

  it('refuses fetch_contacts in readonly mode and makes no request', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 10, confirm_credit_spend: true },
      { mode: 'readonly', allowCreditSpend: true },
    );
    expect(envelope.error?.code).toBe('mode_readonly');
    expect(mock.calls).toHaveLength(0);
  });
});

describe('fetch_contacts credit preflight', () => {
  const analyticsReply = (available: number, maxSingle = 5000, daily = 10_000, today = 0) => ({
    json: {
      success: true,
      data: {
        availableCredits: { available, total: 1000, used: 1000 - available },
        maxSingleFetchLimit: maxSingle,
        maxDailyFetchLimit: daily,
        leadsFoundToday: today,
      },
    },
  });

  it('runs a read-only preflight before the paid request', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 10, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(500), { json: { success: true, data: { list: [], total_count: 0 } } }],
    );
    expect(mock.calls).toHaveLength(2);
    expect(mock.calls[0]!.url).toContain('/search-analytics');
    expect(mock.calls[0]!.method).toBe('GET');
    expect(mock.calls[1]!.url).toContain('/fetch-contacts');
    expect(envelope.ok).toBe(true);
    expect((envelope.data as Record<string, unknown>).credit_preflight).toMatchObject({
      performed: true,
      credits: { available: 500 },
    });
  });

  it('rejects rather than clamps a request larger than the available credits', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 900, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(100)],
    );
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.code).toBe('insufficient_credits');
    expect(envelope.error?.message).toContain('900');
    expect(envelope.error?.message).toContain('100');
    // Only the free preflight ran; the paid request was never sent.
    expect(mock.calls).toHaveLength(1);
    expect(mock.calls[0]!.url).toContain('/search-analytics');
  });

  it('rejects a request above the account single-fetch limit', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 600, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(100_000, 500)],
    );
    expect(envelope.error?.code).toBe('single_fetch_limit_exceeded');
    expect(mock.calls).toHaveLength(1);
  });

  it('rejects when the request would exceed the daily fetch limit', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 100, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(10_000, 5000, 120, 90)],
    );
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.code).toBe('daily_fetch_limit_exceeded');
    expect(mock.calls).toHaveLength(1);
  });

  it('never sends more than the requested quantity', async () => {
    const { mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 7, visual_limit: 5, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(1000), { json: { success: true, data: { list: [] } } }],
    );
    expect(mock.calls[1]!.body).toEqual({ filter_id: 1, limit: 7, visual_limit: 5 });
  });

  it('fails closed when the preflight itself fails', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 5, confirm_credit_spend: true },
      permissiveOverrides,
      [{ status: 500, json: { message: 'analytics down' } }, { status: 500, json: { message: 'analytics down' } }, { status: 500, json: { message: 'analytics down' } }],
    );
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.code).toBe('credit_preflight_failed');
    expect(mock.calls.every((call) => call.url.includes('/search-analytics'))).toBe(true);
  });

  it('fails closed when the preflight has no recognisable limits', async () => {
    const { envelope, mock } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 5, confirm_credit_spend: true },
      permissiveOverrides,
      [{ json: { success: true, data: {} } }],
    );
    expect(envelope.error?.code).toBe('credit_preflight_unusable');
    expect(mock.calls).toHaveLength(1);
  });

  it('warns when the limit exceeds the standard documented maximum', async () => {
    const { envelope } = await run(
      'smartprospect_fetch_contacts',
      { filter_id: 1, limit: 20_000, confirm_credit_spend: true },
      permissiveOverrides,
      [analyticsReply(30_000, 30_000, 30_000), { json: { success: true, data: { list: [] } } }],
    );
    expect(envelope.warnings.join(' ')).toContain('exceeds the standard documented maximum');
  });
});

describe('sending and destructive gating', () => {
  it('allows PAUSED in standard mode', async () => {
    const { envelope, mock } = await run(
      'smartlead_update_campaign_status',
      { campaign_id: 1, status: 'PAUSED' },
      { mode: 'standard' },
      [{ json: { ok: true } }],
    );
    expect(envelope.ok).toBe(true);
    expect(mock.calls).toHaveLength(1);
  });

  it('blocks START in standard mode', async () => {
    const { envelope, mock } = await run(
      'smartlead_update_campaign_status',
      { campaign_id: 1, status: 'START', confirm_send: true },
      { mode: 'standard', allowSend: true },
    );
    expect(envelope.error?.code).toBe('mode_standard');
    expect(mock.calls).toHaveLength(0);
  });

  it('blocks START without confirm_send even in unrestricted mode', async () => {
    const { envelope, mock } = await run('smartlead_update_campaign_status', { campaign_id: 1, status: 'START' }, {
      mode: 'unrestricted',
      allowSend: true,
    });
    expect(envelope.error?.code).toBe('send_unconfirmed');
    expect(mock.calls).toHaveLength(0);
  });

  it('blocks permanent STOPPED without destructive approval', async () => {
    const { envelope, mock } = await run(
      'smartlead_update_campaign_status',
      { campaign_id: 1, status: 'STOPPED' },
      { mode: 'standard' },
    );
    expect(envelope.error?.code).toBe('mode_standard');
    expect(mock.calls).toHaveLength(0);
  });

  it('blocks block-list deletion without the destructive flag', async () => {
    const { envelope, mock } = await run(
      'smartlead_remove_domain_from_block_list',
      { id: 1, confirm_destructive: true },
      { mode: 'unrestricted', allowDestructive: false },
    );
    expect(envelope.error?.code).toBe('destructive_disabled');
    expect(mock.calls).toHaveLength(0);
  });
});

describe('lead import', () => {
  it('refuses without confirm_import and makes no request', async () => {
    const { envelope, mock } = await run(
      'smartlead_add_leads_to_campaign',
      { campaign_id: 1, lead_list: [{ email: 'person@example.com' }] },
      { mode: 'standard' },
    );
    expect(envelope.error?.code).toBe('import_unconfirmed');
    expect(mock.calls).toHaveLength(0);
  });

  it('removes duplicate emails locally and reports the count', async () => {
    const { envelope, mock } = await run(
      'smartlead_add_leads_to_campaign',
      {
        campaign_id: 1,
        confirm_import: true,
        lead_list: [
          { email: 'person@example.com' },
          { email: '  PERSON@Example.com ' },
          { email: 'other@example.org' },
        ],
      },
      { mode: 'standard' },
      [{ json: { ok: true } }],
    );
    expect(envelope.ok).toBe(true);
    expect(envelope.pagination).toMatchObject({ submitted: 2, duplicates_removed: 1, campaign_id: 1 });
    expect(envelope.warnings.join(' ')).toContain('1 duplicate email address(es) were removed');
    expect((mock.calls[0]!.body as { lead_list: unknown[] }).lead_list).toHaveLength(2);
  });

  it('never changes the campaign status as a side effect', async () => {
    const { mock } = await run(
      'smartlead_add_leads_to_campaign',
      { campaign_id: 1, confirm_import: true, lead_list: [{ email: 'person@example.com' }] },
      { mode: 'standard' },
      [{ json: { ok: true } }],
    );
    expect(mock.calls).toHaveLength(1);
    expect(mock.calls[0]!.url).not.toContain('/status');
  });

  it('blocks suppression-bypassing imports without destructive approval', async () => {
    const { envelope, mock } = await run(
      'smartlead_add_leads_to_campaign',
      {
        campaign_id: 1,
        confirm_import: true,
        lead_list: [{ email: 'person@example.com' }],
        settings: { ignore_unsubscribe_list: true },
      },
      { mode: 'standard' },
    );
    expect(envelope.error?.code).toBe('mode_standard');
    expect(mock.calls).toHaveLength(0);
  });
});

describe('dedupeLeads', () => {
  it('keeps the first occurrence and normalises case and whitespace', () => {
    const result = dedupeLeads([
      { email: 'a@example.com', first_name: 'first' },
      { email: 'A@EXAMPLE.COM', first_name: 'second' },
      { email: ' a@example.com ', first_name: 'third' },
      { email: 'b@example.com' },
    ] as { email: string; first_name?: string }[]);
    expect(result.unique).toHaveLength(2);
    expect(result.unique[0]!.first_name).toBe('first');
    expect(result.duplicatesRemoved).toBe(2);
  });
});

describe('include_full_records', () => {
  const contactRow = {
    id: 'abc',
    firstName: 'Ada',
    lastName: 'Lovelace',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    linkedin: 'linkedin.com/in/example',
    title: 'Director',
    country: 'United Kingdom',
  };

  it('omits personal fields by default for preview searches', async () => {
    const { envelope } = await run('smartprospect_search_contacts', { limit: 1 }, permissiveOverrides, [
      { json: { success: true, data: { list: [contactRow], filter_id: 1, total_count: 1 } } },
    ]);
    expect(JSON.stringify(envelope.data)).not.toContain('ada@example.com');
  });

  it('returns full preview records only when explicitly requested', async () => {
    const { envelope } = await run(
      'smartprospect_search_contacts',
      { limit: 1, include_full_records: true },
      permissiveOverrides,
      [{ json: { success: true, data: { list: [contactRow], filter_id: 1, total_count: 1 } } }],
    );
    expect(JSON.stringify(envelope.data)).toContain('ada@example.com');
  });

  it('omits personal fields when include_full_records is false', async () => {
    const { envelope } = await run(
      'smartprospect_search_contacts',
      { limit: 1, include_full_records: false },
      permissiveOverrides,
      [{ json: { success: true, data: { list: [contactRow], filter_id: 1, total_count: 1 } } }],
    );
    const serialized = JSON.stringify(envelope.data);
    expect(serialized).not.toContain('ada@example.com');
    expect(serialized).not.toContain('Lovelace');
    expect(serialized).not.toContain('linkedin.com');
    expect(serialized).toContain('Director');
    expect(serialized).toContain('personal_fields_omitted');
  });
});

describe('search_contacts result shaping', () => {
  it('surfaces filter_id, total_count and scroll_id in pagination', async () => {
    const { envelope } = await run('smartprospect_search_contacts', { limit: 2 }, permissiveOverrides, [
      {
        json: {
          success: true,
          data: { list: [{ id: '1' }], scroll_id: 'SCROLL', filter_id: 327105, total_count: 16064669 },
        },
      },
    ]);
    expect(envelope.pagination).toMatchObject({
      scroll_id: 'SCROLL',
      filter_id: 327105,
      total_count: 16064669,
      returned: 1,
      limit: 2,
    });
  });

  it('forwards the scroll_id when paginating', async () => {
    const { mock } = await run(
      'smartprospect_search_contacts',
      { limit: 2, scroll_id: 'SCROLL' },
      permissiveOverrides,
      [{ json: { success: true, data: { list: [] } } }],
    );
    expect(mock.calls[0]!.body).toMatchObject({ scroll_id: 'SCROLL' });
  });

  it('is declared read-only and does not spend credits', () => {
    const definition = tool('smartprospect_search_contacts');
    expect(definition.capability.readOnly).toBe(true);
    expect(definition.capability.creditSpending).toBe(false);
  });
});

describe('summarizeCredits', () => {
  it('extracts the documented credit fields', () => {
    expect(
      summarizeCredits({
        availableCredits: { available: 500, total: 1000, used: 500 },
        maxDailyFetchLimit: 1000,
        maxSingleFetchLimit: 500,
        leadsFoundToday: 50,
      }),
    ).toEqual({
      available: 500,
      total: 1000,
      used: 500,
      maxDailyFetchLimit: 1000,
      maxSingleFetchLimit: 500,
      leadsFoundToday: 50,
    });
  });

  it('returns undefined for a non-object or unrecognisable payload', () => {
    expect(summarizeCredits(null)).toBeUndefined();
    expect(summarizeCredits({})).toBeUndefined();
  });
});

describe('capability declarations', () => {
  it('marks exactly the two credit-consuming SmartProspect tools', () => {
    const creditTools = allTools.filter((t) => t.capability.creditSpending).map((t) => t.name).sort();
    expect(creditTools).toEqual(['smartprospect_fetch_contacts', 'smartprospect_find_emails']);
  });

  it('classifies the known destructive endpoints', () => {
    const destructive = new Set(allTools.filter((t) => t.capability.destructive).map((t) => t.name));
    for (const name of [
      'smartlead_add_leads_to_campaign',
      'smartlead_remove_domain_from_block_list',
      'smartlead_update_campaign_status',
      'smartlead_campaigns_delete',
      'smartlead_leads_unsubscribe',
      'smartlead_email_accounts_delete',
      'smartsenders_place_order',
    ]) {
      expect(destructive.has(name), name).toBe(true);
    }
    // Suppression-increasing actions must NOT be destructive, or the safe action
    // becomes harder to take than the dangerous one.
    for (const name of ['smartlead_inbox_block_domains', 'smartlead_email_accounts_suspend']) {
      expect(destructive.has(name), name).toBe(false);
    }
  });

  it('classifies the known sending endpoints', () => {
    const sending = new Set(allTools.filter((t) => t.capability.sending).map((t) => t.name));
    for (const name of [
      'smartlead_update_campaign_status',
      'smartlead_utilities_send_single_email',
      'smartlead_campaigns_reply_email_thread',
      'smartlead_campaigns_forward_email',
      'smartlead_campaigns_send_test_email',
    ]) {
      expect(sending.has(name), name).toBe(true);
    }
    // Smartlead serves several searches over POST; those are reads, not sends.
    for (const name of ['smartlead_inbox_get_scheduled', 'smartlead_inbox_get_unread']) {
      expect(sending.has(name), name).toBe(false);
    }
  });

  it('never accepts a third-party credential as a tool argument', () => {
    for (const tool of allTools) {
      for (const key of Object.keys(tool.inputSchema.shape ?? {})) {
        expect(/api_?key|apikey|token|secret|password/i.test(key), `${tool.name}.${key}`).toBe(false);
      }
    }
  });

  it('blocks every non-read-only tool in readonly mode', async () => {
    for (const definition of allTools.filter((t) => !t.capability.readOnly)) {
      const { ctx, mock } = createTestContext(undefined, { mode: 'readonly' });
      const envelope = await executeTool(definition, {}, ctx);
      expect(envelope.ok, definition.name).toBe(false);
      expect(envelope.error?.code, definition.name).toBe('mode_readonly');
      expect(mock.calls, definition.name).toHaveLength(0);
    }
  });
});
