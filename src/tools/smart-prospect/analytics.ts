import { READ_ONLY } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import { unwrap } from '../shape.js';
import * as schema from '../../schemas/smart-prospect.js';
import { isRecord, asNumber, type SearchAnalyticsData } from '../../types/smartlead.js';

/**
 * Credit and usage analytics. This is the first call in the SmartProspect
 * workflow: inspect credits before doing anything that can spend them.
 */

const getSearchAnalytics = defineTool({
  name: 'smartprospect_get_search_analytics',
  title: 'SmartProspect: search analytics and credit balance',
  summary:
    'Return SmartProspect credit balance (available/total/used), daily and single-fetch limits, and leads-found / emails-fetched metrics.',
  notes: [
    'Read this before any credit-consuming call. Free and read-only.',
    'Pass `filter_id` to also get per-filter leads-found and emails-fetched figures.',
  ],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/search-analytics' },
  inputSchema: schema.searchAnalyticsSchema,
  handler: async (args, ctx) => {
    const result = await ctx.prospect.getSearchAnalytics(args);
    const unwrapped = unwrap(result);
    const warnings: string[] = [];
    const summary = summarizeCredits(unwrapped.data);
    if (summary && summary.available !== undefined && summary.available <= 0) {
      warnings.push('No SmartProspect credits are available; credit-consuming operations will fail.');
    }
    return {
      data: unwrapped.data,
      pagination: unwrapped.pagination,
      warnings,
    };
  },
});

const getReplyAnalytics = defineTool({
  name: 'smartprospect_get_reply_analytics',
  title: 'SmartProspect: reply analytics',
  summary: 'Return SmartProspect reply counts for the current and previous month, with the trend.',
  notes: ['Free and read-only.'],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/reply-analytics' },
  inputSchema: schema.replyAnalyticsSchema,
  handler: async (_args, ctx) => unwrap(await ctx.prospect.getReplyAnalytics()),
});

export interface CreditSummary {
  available?: number;
  total?: number;
  used?: number;
  maxDailyFetchLimit?: number;
  maxSingleFetchLimit?: number;
  leadsFoundToday?: number;
}

/** Extract the credit-relevant fields from a search-analytics payload. */
export function summarizeCredits(data: unknown): CreditSummary | undefined {
  if (!isRecord(data)) return undefined;
  const analytics = data as SearchAnalyticsData;
  const credits = isRecord(analytics.availableCredits) ? analytics.availableCredits : undefined;
  const summary: CreditSummary = {
    available: asNumber(credits?.available),
    total: asNumber(credits?.total),
    used: asNumber(credits?.used),
    maxDailyFetchLimit: asNumber(analytics.maxDailyFetchLimit),
    maxSingleFetchLimit: asNumber(analytics.maxSingleFetchLimit),
    leadsFoundToday: asNumber(analytics.leadsFoundToday),
  };
  return summary;
}

export const analyticsTools = toolList(getSearchAnalytics, getReplyAnalytics);
