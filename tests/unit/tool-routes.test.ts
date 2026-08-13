import { describe, expect, it } from 'vitest';
import { handWrittenTools, executeTool, findTool } from '../../src/tools/register.js';
import { createTestContext, permissiveOverrides } from '../helpers/context.js';
import { parseCall } from '../helpers/mock-fetch.js';

const PROSPECT = 'https://prospect-api.smartlead.ai';
const PROSPECT_PREFIX = '/api/v1/search-email-leads';
const CORE = 'https://server.smartlead.ai';
const CORE_PREFIX = '/api/v1';

interface RouteCase {
  tool: string;
  args: Record<string, unknown>;
  method: string;
  origin: string;
  pathname: string;
  query?: Record<string, string>;
  body?: unknown;
  /** Scripted upstream reply, when the handler reads the response. */
  reply?: unknown;
}

/**
 * One case per implemented endpoint, asserting the exact host, path, method,
 * query string and request body that reaches Smartlead.
 */
const CASES: RouteCase[] = [
  // --- SmartProspect: analytics --------------------------------------------
  {
    tool: 'smartprospect_get_search_analytics',
    args: { filter_id: 327105 },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-analytics`,
    query: { filter_id: '327105' },
    reply: { success: true, data: { availableCredits: { available: 100, total: 200, used: 100 } } },
  },
  {
    tool: 'smartprospect_get_reply_analytics',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/reply-analytics`,
  },

  // --- SmartProspect: lookups ----------------------------------------------
  {
    tool: 'smartprospect_list_countries',
    args: { limit: 5, offset: 2, search: 'uni' },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/countries`,
    query: { limit: '5', offset: '2', search: 'uni' },
  },
  {
    tool: 'smartprospect_list_states',
    args: { limit: 3, country: 'usa,canada' },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/states`,
    query: { limit: '3', country: 'usa,canada' },
  },
  {
    tool: 'smartprospect_list_cities',
    args: { state: 'texas', country: 'usa' },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/cities`,
    query: { state: 'texas', country: 'usa' },
  },
  {
    tool: 'smartprospect_list_departments',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/departments`,
    query: { limit: '10', offset: '0' },
  },
  {
    tool: 'smartprospect_list_seniority_levels',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/levels`,
  },
  {
    tool: 'smartprospect_list_industries',
    args: { withSubIndustry: true },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/industries`,
    query: { withSubIndustry: 'true' },
  },
  {
    tool: 'smartprospect_list_sub_industries',
    args: { industry_id: 7 },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/sub-industries`,
    query: { industry_id: '7' },
  },
  {
    tool: 'smartprospect_list_revenue_ranges',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/revenue`,
  },
  {
    tool: 'smartprospect_list_head_counts',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/head-counts`,
  },
  {
    tool: 'smartprospect_list_companies',
    args: { search: 'acme' },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/company`,
    query: { search: 'acme', limit: '100' },
  },
  {
    tool: 'smartprospect_list_domains',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/domain`,
  },
  {
    tool: 'smartprospect_list_job_titles',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/job-title`,
  },
  {
    tool: 'smartprospect_list_keywords',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/keywords`,
  },

  // --- SmartProspect: contacts ---------------------------------------------
  {
    tool: 'smartprospect_search_contacts',
    args: { limit: 2, title: ['Director'], country: ['United States'], include_full_records: true },
    method: 'POST',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-contacts`,
    // include_full_records is a client-side switch and must not be forwarded.
    body: { limit: 2, title: ['Director'], country: ['United States'] },
    reply: { success: true, data: { list: [], scroll_id: 's1', filter_id: 1, total_count: 5 } },
  },
  {
    tool: 'smartprospect_get_contacts',
    args: { filter_id: 327105, limit: 50, offset: 0, verification_status: 'valid' },
    method: 'POST',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/get-contacts`,
    body: { filter_id: 327105, limit: 50, offset: 0, verification_status: 'valid' },
    reply: { success: true, data: { list: [], pagination: { total: 0 } } },
  },
  {
    tool: 'smartprospect_review_contacts',
    args: { filter_id: 327105 },
    method: 'PATCH',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/review-contacts/327105`,
  },

  // --- SmartProspect: search management ------------------------------------
  {
    tool: 'smartprospect_list_saved_searches',
    args: { limit: 20, offset: 5 },
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/saved-searches`,
    query: { limit: '20', offset: '5' },
  },
  {
    tool: 'smartprospect_list_recent_searches',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/recent-searches`,
  },
  {
    tool: 'smartprospect_list_fetched_searches',
    args: {},
    method: 'GET',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/fetched-searches`,
  },
  {
    tool: 'smartprospect_save_search',
    args: { search_string: 'Directors in the US', title: ['Director'] },
    method: 'POST',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/save-search`,
    body: { search_string: 'Directors in the US', title: ['Director'] },
  },
  {
    tool: 'smartprospect_update_saved_search',
    args: { id: 327105, search_string: 'Renamed' },
    method: 'PUT',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/save-search/327105`,
    body: { search_string: 'Renamed' },
  },
  {
    tool: 'smartprospect_update_fetched_search',
    args: { id: 327107, search_string: 'Renamed' },
    method: 'PUT',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-filters/fetched-searches/327107`,
    body: { search_string: 'Renamed' },
  },

  // --- SmartProspect: credit-consuming -------------------------------------
  {
    tool: 'smartprospect_find_emails',
    args: {
      contacts: [{ firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' }],
      confirm_credit_spend: true,
    },
    method: 'POST',
    origin: PROSPECT,
    pathname: `${PROSPECT_PREFIX}/search-contacts/find-emails`,
    body: { contacts: [{ firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' }] },
    reply: { success: true, data: [] },
  },

  // --- Core Smartlead -------------------------------------------------------
  {
    tool: 'smartlead_list_campaigns',
    args: { include_tags: true, client_id: 9 },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/`,
    query: { include_tags: 'true', client_id: '9' },
  },
  {
    tool: 'smartlead_get_campaign',
    args: { campaign_id: 123, include_tags: true },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/123`,
    query: { include_tags: 'true' },
  },
  {
    tool: 'smartlead_get_campaign_analytics',
    args: { campaign_id: 123 },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/123/analytics`,
  },
  {
    tool: 'smartlead_get_campaign_leads',
    args: { campaign_id: 123, limit: 50, offset: 10, status: 'INPROGRESS', emailStatus: 'is_replied' },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/123/leads`,
    query: { limit: '50', offset: '10', status: 'INPROGRESS', emailStatus: 'is_replied' },
  },
  {
    tool: 'smartlead_get_lead_by_email',
    args: { email: 'person@example.com' },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/leads/`,
    query: { email: 'person@example.com' },
  },
  {
    tool: 'smartlead_list_lead_lists',
    args: { listName: 'Q3', tagIds: '1,2' },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/lead-list/`,
    query: { listName: 'Q3', tagIds: '1,2', limit: '10', offset: '0' },
  },
  {
    tool: 'smartlead_list_email_accounts',
    args: { limit: 25, esp: 'GMAIL', isInUse: true, fetch_campaigns: true },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/email-accounts/`,
    query: { limit: '25', esp: 'GMAIL', isInUse: 'true', fetch_campaigns: 'true' },
  },
  {
    tool: 'smartlead_get_domain_block_list',
    args: { limit: 10, filter_email_or_domain: 'example.com' },
    method: 'GET',
    origin: CORE,
    pathname: `${CORE_PREFIX}/leads/get-domain-block-list`,
    query: { limit: '10', filter_email_or_domain: 'example.com' },
  },
  {
    tool: 'smartlead_create_campaign',
    args: { name: 'Q4 outbound' },
    method: 'POST',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/create`,
    body: { name: 'Q4 outbound' },
  },
  {
    tool: 'smartlead_update_campaign_status',
    args: { campaign_id: 123, status: 'PAUSED' },
    method: 'POST',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/123/status`,
    body: { status: 'PAUSED' },
  },
  {
    tool: 'smartlead_add_leads_to_campaign',
    args: {
      campaign_id: 123,
      lead_list: [{ email: 'person@example.com', first_name: 'Person' }],
      confirm_import: true,
    },
    method: 'POST',
    origin: CORE,
    pathname: `${CORE_PREFIX}/campaigns/123/leads`,
    body: { lead_list: [{ email: 'person@example.com', first_name: 'Person' }] },
  },
  {
    tool: 'smartlead_add_domain_to_block_list',
    args: { domain_block_list: ['competitor.example'] },
    method: 'POST',
    origin: CORE,
    pathname: `${CORE_PREFIX}/leads/add-domain-block-list`,
    body: { domain_block_list: ['competitor.example'] },
  },
  {
    tool: 'smartlead_remove_domain_from_block_list',
    args: { id: 42, confirm_destructive: true },
    method: 'DELETE',
    origin: CORE,
    pathname: `${CORE_PREFIX}/leads/delete-domain-block-list`,
    query: { id: '42' },
  },
];

describe('endpoint routing', () => {
  it.each(CASES)('$tool hits the documented endpoint', async (testCase) => {
    const definition = findTool(testCase.tool);
    expect(definition, `tool ${testCase.tool} is not registered`).toBeDefined();

    const reply = testCase.reply ?? { success: true, data: [] };
    const { ctx, mock } = createTestContext([{ json: reply }], permissiveOverrides);
    const parsedArgs = definition!.inputSchema.parse(testCase.args);
    const envelope = await executeTool(definition!, parsedArgs, ctx);

    expect(envelope.error, JSON.stringify(envelope.error)).toBeUndefined();
    expect(envelope.ok).toBe(true);

    const call = mock.calls.at(-1)!;
    const parsed = parseCall(call);
    expect(call.method).toBe(testCase.method);
    expect(parsed.origin).toBe(testCase.origin);
    expect(parsed.pathname).toBe(testCase.pathname);
    expect(parsed.query.api_key).toBeDefined();

    if (testCase.query) {
      for (const [key, value] of Object.entries(testCase.query)) {
        expect(parsed.query[key], `query param ${key}`).toBe(value);
      }
    }
    if (testCase.body !== undefined) {
      expect(call.body).toEqual(testCase.body);
    } else if (testCase.method === 'GET' || testCase.method === 'DELETE') {
      expect(call.body).toBeUndefined();
    }
  });

  it('covers every hand-written tool except the ones with dedicated behaviour tests', () => {
    const covered = new Set(CASES.map((c) => c.tool));
    // fetch_contacts runs a preflight request first and is covered in tool-behaviour.test.ts.
    covered.add('smartprospect_fetch_contacts');
    const uncovered = handWrittenTools.map((t) => t.name).filter((name) => !covered.has(name));
    expect(uncovered).toEqual([]);
  });
});
