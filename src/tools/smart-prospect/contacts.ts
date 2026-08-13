import { READ_ONLY, capability } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import { applyRecordVisibility, listLength, unwrap } from '../shape.js';
import * as schema from '../../schemas/smart-prospect.js';
import { isRecord, type SearchContactsData } from '../../types/smartlead.js';

/**
 * Contact search and retrieval.
 *
 * `search_contacts` previews matches and returns a `filter_id` plus a
 * `scroll_id`. Running a search does not itself reveal credit-gated email
 * addresses; only `find_emails` and `fetch_contacts` spend credits.
 */

const searchContacts = defineTool({
  name: 'smartprospect_search_contacts',
  title: 'SmartProspect: search contacts',
  summary:
    'Search the SmartProspect contact database with filters and return a preview page plus filter_id, total_count and scroll_id.',
  notes: [
    'Read-only. Running a search does not fetch or reveal credit-gated contacts and does not spend credits by itself.',
    `\`limit\` is required and must be 1-${schema.SEARCH_CONTACTS_MAX_LIMIT}; every array filter accepts at most 2000 items.`,
    'Pass the returned `scroll_id` back in to page through results; keep the `filter_id` to fetch or retrieve contacts later.',
  ],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'POST', route: '/search-contacts' },
  inputSchema: schema.searchContactsSchema,
  handler: async (args, ctx) => {
    const { include_full_records, ...body } = args;
    const result = await ctx.prospect.searchContacts(body);
    const unwrapped = unwrap(result);
    const data = unwrapped.data as SearchContactsData | null;

    const pagination = isRecord(data)
      ? {
          scroll_id: data.scroll_id ?? null,
          filter_id: data.filter_id ?? null,
          total_count: data.total_count ?? null,
          returned: listLength(data) ?? 0,
          limit: body.limit,
        }
      : null;

    const warnings: string[] = [];
    const returned = listLength(data);
    if (returned !== undefined && returned < body.limit) {
      warnings.push(`Smartlead returned ${returned} contact(s) for a requested limit of ${body.limit}.`);
    }

    return {
      data: applyRecordVisibility(data, include_full_records),
      pagination,
      warnings,
    };
  },
});

const getContacts = defineTool({
  name: 'smartprospect_get_contacts',
  title: 'SmartProspect: get already-fetched contacts',
  summary:
    'Retrieve contacts that were already saved or fetched, by adapt IDs or by filter_id, with optional verification and catch-all filtering.',
  notes: [
    'Read-only. Returns contacts whose emails were already paid for; it does not spend credits.',
    `Provide exactly one of \`id\` (max ${schema.GET_CONTACTS_MAX_IDS} adapt IDs) or \`filter_id\` — never both.`,
    '`limit`, `offset`, `search`, `verification_status` and `catch_all_status` apply when using `filter_id`.',
  ],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'POST', route: '/get-contacts' },
  inputSchema: schema.getContactsSchema,
  handler: async (args, ctx) => {
    const { include_full_records, ...body } = args;
    const unwrapped = unwrap(await ctx.prospect.getContacts(body));
    const data = unwrapped.data;
    const pagination = isRecord(data) && isRecord(data.pagination) ? data.pagination : unwrapped.pagination;
    return {
      data: applyRecordVisibility(data, include_full_records),
      pagination,
    };
  },
});

const reviewContacts = defineTool({
  name: 'smartprospect_review_contacts',
  title: 'SmartProspect: review (re-sync) contacts for a filter',
  summary:
    'Re-sync contact metrics and statuses for a SmartProspect filter, returning updated counts for emails, bounces and verification.',
  notes: [
    'Modifies remote state (records are updated) but does not consume credits.',
    'Blocked in readonly mode.',
  ],
  capability: capability({ remoteMutation: true }),
  endpoint: { host: 'prospect', method: 'PATCH', route: '/review-contacts/{filter_id}' },
  inputSchema: schema.reviewContactsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.reviewContacts(args.filter_id)),
});

export const contactTools = toolList(searchContacts, getContacts, reviewContacts);
