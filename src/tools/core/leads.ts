import { READ_ONLY, capability } from '../../security/policy.js';
import { ToolRefusal, defineTool, toolList } from '../types.js';
import { normalizeEmail } from '../../schemas/common.js';
import * as schema from '../../schemas/core.js';

/** Core Smartlead lead operations: read leads, look one up, and import in bulk. */

const getCampaignLeads = defineTool({
  name: 'smartlead_get_campaign_leads',
  title: 'Smartlead: get campaign leads',
  summary: 'List leads in a campaign with pagination and status/engagement filters.',
  notes: ['Free and read-only.', 'Returns personal data (lead email addresses and names).'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/campaigns/{campaign_id}/leads' },
  inputSchema: schema.getCampaignLeadsSchema,
  handler: async (args, ctx) => {
    const { campaign_id, ...query } = args;
    const result = await ctx.core.listCampaignLeads(campaign_id, query);
    return {
      data: result.data,
      pagination: { limit: query.limit, offset: query.offset },
    };
  },
});

const getLeadByEmail = defineTool({
  name: 'smartlead_get_lead_by_email',
  title: 'Smartlead: get lead by email',
  summary: 'Look up a single lead by email address and return its associated campaign data.',
  notes: ['Free and read-only.', 'Returns personal data for the matched lead.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/leads/' },
  inputSchema: schema.getLeadByEmailSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.getLeadByEmail(args.email);
    return { data: result.data };
  },
});

const listLeadLists = defineTool({
  name: 'smartlead_list_lead_lists',
  title: 'Smartlead: list lead lists',
  summary: 'List saved lead lists with optional name and tag filtering.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/lead-list/' },
  inputSchema: schema.listLeadListsSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.listLeadLists(args);
    return { data: result.data, pagination: { limit: args.limit, offset: args.offset } };
  },
});

const addLeadsToCampaign = defineTool({
  name: 'smartlead_add_leads_to_campaign',
  title: 'Smartlead: add leads to a campaign',
  summary: 'Import leads into an explicitly named campaign.',
  notes: [
    `Creates remote state. Blocked in readonly mode. Requires an explicit campaign_id and confirm_import: true. Maximum ${schema.ADD_LEADS_MAX} leads per call.`,
    'Duplicate emails are removed locally (case-insensitive, trimmed) before the request and the number removed is reported.',
    'Never activates the campaign — use smartlead_update_campaign_status separately.',
    'Never auto-retried: a retry could import leads twice.',
  ],
  capability: capability({ remoteMutation: true, leadImport: true }),
  endpoint: { host: 'core', method: 'POST', route: '/campaigns/{campaign_id}/leads' },
  inputSchema: schema.addLeadsToCampaignSchema,
  handler: async (args, ctx) => {
    const { unique, duplicatesRemoved } = dedupeLeads(args.lead_list);
    if (unique.length === 0) {
      throw new ToolRefusal('no_unique_leads', 'No unique lead email addresses remained after deduplication.');
    }

    const body: Record<string, unknown> = { lead_list: unique };
    if (args.settings !== undefined) body.settings = args.settings;

    const result = await ctx.core.addLeadsToCampaign(args.campaign_id, body);

    const warnings: string[] = [
      `Imported ${unique.length} unique lead(s) into campaign ${args.campaign_id}. The campaign status was not changed.`,
    ];
    if (duplicatesRemoved > 0) {
      warnings.push(`${duplicatesRemoved} duplicate email address(es) were removed before the request.`);
    }

    return {
      data: result.data,
      pagination: {
        submitted: unique.length,
        duplicates_removed: duplicatesRemoved,
        campaign_id: args.campaign_id,
      },
      warnings,
    };
  },
});

interface LeadLike {
  email: string;
}

/**
 * Remove duplicate leads by normalised email, keeping the first occurrence.
 * Normalisation is only used for comparison — the original values are sent.
 */
export function dedupeLeads<T extends LeadLike>(leads: T[]): { unique: T[]; duplicatesRemoved: number } {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const lead of leads) {
    const key = normalizeEmail(lead.email);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(lead);
  }
  return { unique, duplicatesRemoved: leads.length - unique.length };
}

export const leadTools = toolList(getCampaignLeads, getLeadByEmail, listLeadLists, addLeadsToCampaign);
