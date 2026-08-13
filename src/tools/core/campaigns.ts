import { READ_ONLY, capability } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import * as schema from '../../schemas/core.js';

/**
 * Core Smartlead campaign operations.
 *
 * Read tools are always available. `create` and `update_status` mutate remote
 * state; starting a campaign additionally counts as sending and is gated
 * separately (see `resolveCapability`).
 */

const listCampaigns = defineTool({
  name: 'smartlead_list_campaigns',
  title: 'Smartlead: list campaigns',
  summary: 'List all Smartlead campaigns with status, schedule and sending configuration.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/campaigns/' },
  inputSchema: schema.listCampaignsSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.listCampaigns(args);
    return { data: result.data };
  },
});

const getCampaign = defineTool({
  name: 'smartlead_get_campaign',
  title: 'Smartlead: get campaign',
  summary: 'Retrieve full configuration for one campaign by ID.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/campaigns/{campaign_id}' },
  inputSchema: schema.getCampaignSchema,
  handler: async (args, ctx) => {
    const { campaign_id, ...query } = args;
    const result = await ctx.core.getCampaign(campaign_id, query);
    return { data: result.data };
  },
});

const getCampaignAnalytics = defineTool({
  name: 'smartlead_get_campaign_analytics',
  title: 'Smartlead: get campaign analytics',
  summary: 'Retrieve performance analytics for one campaign (sent, opened, replied, bounced).',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/campaigns/{campaign_id}/analytics' },
  inputSchema: schema.getCampaignAnalyticsSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.getCampaignAnalytics(args.campaign_id);
    return { data: result.data };
  },
});

const createCampaign = defineTool({
  name: 'smartlead_create_campaign',
  title: 'Smartlead: create campaign',
  summary: 'Create a new Smartlead campaign. Smartlead creates it in DRAFTED status.',
  notes: [
    'Creates remote state. Blocked in readonly mode.',
    'The new campaign is a draft: it does not send anything until it is explicitly started.',
    'Never auto-retried — a retry could create a duplicate campaign.',
  ],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'core', method: 'POST', route: '/campaigns/create' },
  inputSchema: schema.createCampaignSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.createCampaign(args);
    return { data: result.data };
  },
});

const updateCampaignStatus = defineTool({
  name: 'smartlead_update_campaign_status',
  title: 'Smartlead: update campaign status',
  summary: 'Start, pause or stop a campaign.',
  notes: [
    'PAUSED and STOPPED are ordinary mutations and work in standard mode.',
    'START activates the campaign and will cause email to be sent: it requires unrestricted mode, SMARTLEAD_MCP_ALLOW_SEND=true and confirm_send: true.',
    'Smartlead documents the activation value as "START", not "ACTIVE".',
  ],
  // Worst case for documentation and annotations; narrowed per call below.
  capability: capability({ remoteMutation: true, sending: true }),
  resolveCapability: (args: { status: string }) =>
    args.status === 'START'
      ? capability({ remoteMutation: true, sending: true })
      : capability({ remoteMutation: true }),
  endpoint: { host: 'core', method: 'POST', route: '/campaigns/{campaign_id}/status' },
  inputSchema: schema.updateCampaignStatusSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.updateCampaignStatus(args.campaign_id, { status: args.status });
    return {
      data: result.data,
      warnings:
        args.status === 'START'
          ? [`Campaign ${args.campaign_id} was set to START and will begin sending email.`]
          : [`Campaign ${args.campaign_id} was set to ${args.status}.`],
    };
  },
});

export const campaignTools = toolList(
  listCampaigns,
  getCampaign,
  getCampaignAnalytics,
  createCampaign,
  updateCampaignStatus,
);
