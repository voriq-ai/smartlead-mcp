import { READ_ONLY, capability } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import { unwrap } from '../shape.js';
import * as schema from '../../schemas/smart-prospect.js';

/**
 * Saved / recent / fetched search management.
 *
 * The three list endpoints are read-only. Saving and renaming create or modify
 * remote state and are therefore blocked in readonly mode.
 */

const listSavedSearches = defineTool({
  name: 'smartprospect_list_saved_searches',
  title: 'SmartProspect: list saved searches',
  summary: 'List saved SmartProspect search filters with their stored filter details.',
  notes: ['Free and read-only. Use the returned `id` as a `filter_id` elsewhere.'],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/search-filters/saved-searches' },
  inputSchema: schema.listSavedSearchesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listSavedSearches(args)),
});

const listRecentSearches = defineTool({
  name: 'smartprospect_list_recent_searches',
  title: 'SmartProspect: list recent searches',
  summary: 'List recently executed SmartProspect searches with their filter details.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/search-filters/recent-searches' },
  inputSchema: schema.listRecentSearchesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listRecentSearches(args)),
});

const listFetchedSearches = defineTool({
  name: 'smartprospect_list_fetched_searches',
  title: 'SmartProspect: list fetched searches',
  summary:
    'List searches whose contacts have already been fetched, including per-filter fetch metrics (total contacts, emails, bounces).',
  notes: [
    'Free and read-only.',
    'Contacts listed here were already paid for; retrieve them with smartprospect_get_contacts rather than fetching again.',
  ],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/search-filters/fetched-searches' },
  inputSchema: schema.listFetchedSearchesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listFetchedSearches(args)),
});

const saveSearch = defineTool({
  name: 'smartprospect_save_search',
  title: 'SmartProspect: save a search filter',
  summary: 'Save a named SmartProspect search filter for later reuse.',
  notes: [
    'Creates remote state. Does not run the search and does not consume credits.',
    'Blocked in readonly mode.',
  ],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'prospect', method: 'POST', route: '/search-filters/save-search' },
  inputSchema: schema.saveSearchSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.saveSearch(args)),
});

const updateSavedSearch = defineTool({
  name: 'smartprospect_update_saved_search',
  title: 'SmartProspect: rename a saved search',
  summary: 'Rename an existing saved SmartProspect search filter.',
  notes: ['Modifies remote state. Blocked in readonly mode. Does not consume credits.'],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'prospect', method: 'PUT', route: '/search-filters/save-search/{id}' },
  inputSchema: schema.updateSavedSearchSchema,
  handler: async (args, ctx) => {
    const { id, ...body } = args;
    return unwrap(await ctx.prospect.updateSavedSearch(id, body));
  },
});

const updateFetchedSearch = defineTool({
  name: 'smartprospect_update_fetched_search',
  title: 'SmartProspect: rename a fetched search',
  summary: 'Rename an existing fetched SmartProspect search (fetched lead set).',
  notes: ['Modifies remote state. Blocked in readonly mode. Does not consume credits.'],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'prospect', method: 'PUT', route: '/search-filters/fetched-searches/{id}' },
  inputSchema: schema.updateFetchedSearchSchema,
  handler: async (args, ctx) => {
    const { id, ...body } = args;
    return unwrap(await ctx.prospect.updateFetchedSearch(id, body));
  },
});

export const searchManagementTools = toolList(
  listSavedSearches,
  listRecentSearches,
  listFetchedSearches,
  saveSearch,
  updateSavedSearch,
  updateFetchedSearch,
);
