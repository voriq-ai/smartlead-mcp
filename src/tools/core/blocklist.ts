import { READ_ONLY, capability } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import * as schema from '../../schemas/core.js';

/**
 * Domain block list management.
 *
 * Adding a block is a normal mutation. Removing one is classified as
 * destructive: it deletes a suppression record and re-enables outreach to a
 * domain that was blocked (often because of a bounce or spam complaint), and
 * the deletion cannot be undone without knowing what was removed.
 */

const getDomainBlockList = defineTool({
  name: 'smartlead_get_domain_block_list',
  title: 'Smartlead: get domain block list',
  summary: 'List blocked domains and email addresses with their source and client association.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/leads/get-domain-block-list' },
  inputSchema: schema.getDomainBlockListSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.getDomainBlockList(args);
    return { data: result.data, pagination: { limit: args.limit, offset: args.offset } };
  },
});

const addDomainToBlockList = defineTool({
  name: 'smartlead_add_domain_to_block_list',
  title: 'Smartlead: add domains to the block list',
  summary: 'Add domains or email addresses to the global block list so no campaign emails them.',
  notes: [
    'Creates remote state. Blocked in readonly mode. Does not send email.',
    'This is a suppression action: it reduces, never increases, outbound sending.',
  ],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'core', method: 'POST', route: '/leads/add-domain-block-list' },
  inputSchema: schema.addDomainBlockListSchema,
  handler: async (args, ctx) => {
    const body: Record<string, unknown> = { domain_block_list: args.domain_block_list };
    if (args.client_id !== undefined) body.client_id = args.client_id;
    const result = await ctx.core.addDomainBlockList(body);
    return {
      data: result.data,
      pagination: { submitted: args.domain_block_list.length },
      warnings: [`${args.domain_block_list.length} entry/entries submitted to the global block list.`],
    };
  },
});

const removeDomainFromBlockList = defineTool({
  name: 'smartlead_remove_domain_from_block_list',
  title: 'Smartlead: remove an entry from the block list',
  summary: 'Delete one entry from the global block list, re-enabling outreach to that domain or address.',
  notes: [
    'Classified as DESTRUCTIVE: it deletes a suppression record and re-enables sending to a previously blocked recipient.',
    'Requires unrestricted mode, SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true and confirm_destructive: true.',
    'Call smartlead_get_domain_block_list first to confirm which entry the ID refers to.',
  ],
  capability: capability({ remoteMutation: true, destructive: true }),
  endpoint: { host: 'core', method: 'DELETE', route: '/leads/delete-domain-block-list' },
  inputSchema: schema.removeDomainBlockListSchema,
  handler: async (args, ctx) => {
    const result = await ctx.core.deleteDomainBlockList(args.id);
    return {
      data: result.data,
      warnings: [`Block list entry ${args.id} was deleted; that recipient can be emailed again.`],
    };
  },
});

export const blockListTools = toolList(getDomainBlockList, addDomainToBlockList, removeDomainFromBlockList);
