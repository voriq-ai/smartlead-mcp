import type { HttpResult } from '../client/http.js';
import { isRecord, type SmartleadEnvelope } from '../types/smartlead.js';

/**
 * Response-shaping helpers.
 *
 * Smartlead wraps most payloads in `{ success, message, data, pagination }`.
 * Tools unwrap that here so the MCP envelope's `data` field is the useful part
 * rather than a doubly-nested envelope.
 */

export interface Unwrapped {
  data: unknown;
  pagination: unknown;
  message?: string;
}

export function unwrap(result: HttpResult): Unwrapped {
  const body = result.data;
  if (!isRecord(body)) return { data: body, pagination: null };

  const envelope = body as SmartleadEnvelope;
  if (!('data' in envelope)) return { data: body, pagination: null };

  const out: Unwrapped = {
    data: envelope.data ?? null,
    pagination: envelope.pagination ?? null,
  };
  if (typeof envelope.message === 'string') out.message = envelope.message;
  return out;
}

/**
 * Fields that may be returned when the caller opted out of full personal
 * records. Everything not on this list — email, names, LinkedIn URL — is
 * dropped rather than masked.
 */
const NON_PERSONAL_CONTACT_FIELDS = [
  'id',
  'title',
  'company',
  'department',
  'level',
  'industry',
  'subIndustry',
  'companyHeadCount',
  'companyRevenue',
  'country',
  'state',
  'city',
  'address',
  'emailDeliverability',
  'status',
  'verificationStatus',
  'verification_status',
  'companyDomain',
] as const;

export function deidentifyContact(record: unknown): unknown {
  if (!isRecord(record)) return record;
  const out: Record<string, unknown> = {};
  for (const field of NON_PERSONAL_CONTACT_FIELDS) {
    if (field in record) out[field] = record[field];
  }
  out.personal_fields_omitted = true;
  return out;
}

export function deidentifyList(list: unknown): unknown {
  if (!Array.isArray(list)) return list;
  return list.map(deidentifyContact);
}

/**
 * Apply the caller's `include_full_records` preference to a `{ list: [...] }`
 * payload, returning the payload unchanged when full records were requested.
 */
export function applyRecordVisibility(data: unknown, includeFullRecords: boolean): unknown {
  if (includeFullRecords) return data;
  if (Array.isArray(data)) return deidentifyList(data);
  if (!isRecord(data)) return data;
  if (!Array.isArray(data.list)) return data;
  return { ...data, list: deidentifyList(data.list) };
}

/** Count entries in a `{ list: [...] }` payload without exposing the entries. */
export function listLength(data: unknown): number | undefined {
  if (Array.isArray(data)) return data.length;
  if (isRecord(data) && Array.isArray(data.list)) return data.list.length;
  return undefined;
}
