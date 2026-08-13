/**
 * Loose structural types for Smartlead responses.
 *
 * These are intentionally permissive: Smartlead's documented response shapes
 * vary between endpoint families and the server must never crash because an
 * upstream field moved. Tools narrow only what they actually read.
 */

export interface SmartleadEnvelope {
  success?: boolean;
  message?: string;
  data?: unknown;
  pagination?: unknown;
  [key: string]: unknown;
}

export interface SearchContactsData {
  list?: unknown[];
  scroll_id?: string;
  filter_id?: number;
  total_count?: number;
}

export interface SearchAnalyticsData {
  availableCredits?: { available?: number; total?: number; used?: number };
  leadsFound?: Record<string, unknown>;
  emailsFetched?: Record<string, unknown>;
  leadsFoundToday?: number;
  filterData?: { leadsFound?: number; emailsFetched?: number };
  maxDailyFetchLimit?: number;
  maxSingleFetchLimit?: number;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
