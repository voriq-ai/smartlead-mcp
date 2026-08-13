import { z } from 'zod';
import {
  boundedInt,
  confirmationFlag,
  includeFullRecords,
  nonEmptyString,
  nonNegativeInt,
  positiveInt,
  searchTerm,
} from './common.js';

/**
 * Zod schemas for the SmartProspect API.
 *
 * Constraints mirror https://api.smartlead.ai/api-reference/smart-prospect/* as
 * checked on 2026-08-14. Where the documentation states no maximum, a generous
 * defensive bound is applied and called out in docs/endpoint-coverage.md.
 */

/** Documented pagination for lookup endpoints: limit 1–100, offset ≥ 0. */
const boundedLookupPagination = {
  limit: boundedInt(1, 100).default(10).describe('Number of records to return (1-100).'),
  offset: nonNegativeInt.default(0).describe('Number of records to skip.'),
};

/** Lookup endpoints whose documentation states a default but no maximum. */
const openLookupPagination = {
  limit: boundedInt(1, 1000)
    .default(100)
    .describe('Number of records to return. Smartlead documents a default of 100 and no maximum; 1000 is a client-side guard.'),
  offset: nonNegativeInt.default(0).describe('Number of records to skip.'),
};

export const listCountriesSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match country names starting with this value.'),
});

export const listStatesSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match state names starting with this value.'),
  country: searchTerm
    .optional()
    .describe('Comma-separated country names to filter by, e.g. "india,usa,canada".'),
});

export const listCitiesSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match city names starting with this value.'),
  state: searchTerm
    .optional()
    .describe('Comma-separated state names to filter by, e.g. "california,texas".'),
  country: searchTerm
    .optional()
    .describe('Comma-separated country names. Smartlead documents that this requires `state`.'),
});

export const listDepartmentsSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match department names starting with this value.'),
});

export const listLevelsSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match seniority level names starting with this value.'),
});

export const listHeadCountsSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match head count ranges starting with this value.'),
});

export const listIndustriesSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match industry names starting with this value.'),
  withSubIndustry: z
    .boolean()
    .optional()
    .describe('Include the sub-industry list for each industry.'),
});

export const listSubIndustriesSchema = z.strictObject({
  ...boundedLookupPagination,
  search: searchTerm.optional().describe('Match sub-industry names starting with this value.'),
  industry_id: positiveInt.optional().describe('Restrict results to one industry ID.'),
});

export const listCompaniesSchema = z.strictObject({
  ...openLookupPagination,
  search: searchTerm.optional().describe('Filter companies by name.'),
});

export const listDomainsSchema = z.strictObject({
  ...openLookupPagination,
  search: searchTerm.optional().describe('Filter company domains by name.'),
});

export const listJobTitlesSchema = z.strictObject({
  ...openLookupPagination,
  search: searchTerm.optional().describe('Filter job titles by name.'),
});

export const listKeywordsSchema = z.strictObject({
  ...openLookupPagination,
  search: searchTerm.optional().describe('Filter keywords by name.'),
});

export const listRevenueRangesSchema = z.strictObject({});

export const replyAnalyticsSchema = z.strictObject({});

export const searchAnalyticsSchema = z.strictObject({
  filter_id: nonNegativeInt
    .optional()
    .describe('Return leads-found and emails-fetched figures for one saved filter.'),
});

/** Searches list endpoints document a default of 10 and no maximum. */
const searchListPagination = {
  limit: boundedInt(1, 1000)
    .default(10)
    .describe('Number of records to return. Smartlead documents no maximum; 1000 is a client-side guard.'),
  offset: nonNegativeInt.default(0).describe('Number of records to skip.'),
};

export const listSavedSearchesSchema = z.strictObject({ ...searchListPagination });
export const listRecentSearchesSchema = z.strictObject({ ...searchListPagination });
export const listFetchedSearchesSchema = z.strictObject({ ...searchListPagination });

/** Documented cap of 2000 items on every search-contacts array filter. */
const MAX_FILTER_ITEMS = 2000;
const filterArray = (label: string) =>
  z
    .array(nonEmptyString)
    .max(MAX_FILTER_ITEMS)
    .optional()
    .describe(`${label} (max ${MAX_FILTER_ITEMS} items).`);

const searchFilterFields = {
  name: filterArray('Full names'),
  firstName: filterArray('First names'),
  lastName: filterArray('Last names'),
  title: filterArray('Job titles'),
  excludeTitle: filterArray('Job titles to exclude'),
  includeTitle: filterArray('Job titles to include'),
  excludeCompany: filterArray('Companies to exclude'),
  excludeCompanyDomain: filterArray('Company domains to exclude'),
  includeCompany: filterArray('Companies to include'),
  includeCompanyDomain: filterArray('Company domains to include'),
  department: filterArray('Departments'),
  level: filterArray('Seniority levels'),
  companyName: filterArray('Company names'),
  companyDomain: filterArray('Company domains'),
  companyKeyword: filterArray('Company keywords'),
  companyHeadCount: filterArray('Company head count ranges'),
  companyRevenue: filterArray('Company revenue ranges'),
  companyIndustry: filterArray('Industries'),
  companySubIndustry: filterArray('Sub-industries'),
  city: filterArray('Cities'),
  state: filterArray('States'),
  country: filterArray('Countries'),
  dontDisplayOwnedContact: z.boolean().optional().describe('Exclude contacts you already own.'),
  titleExactMatch: z.boolean().optional().describe('Match job titles exactly.'),
  companyExactMatch: z.boolean().optional().describe('Match company names exactly.'),
  companyDomainExactMatch: z.boolean().optional().describe('Match company domains exactly.'),
};

/** Documented maximum for `limit` on POST /search-contacts. */
export const SEARCH_CONTACTS_MAX_LIMIT = 500;

export const searchContactsSchema = z.strictObject({
  limit: boundedInt(1, SEARCH_CONTACTS_MAX_LIMIT).describe(
    `Number of contacts to return (1-${SEARCH_CONTACTS_MAX_LIMIT}). Required by Smartlead.`,
  ),
  scroll_id: nonEmptyString
    .optional()
    .describe('Scroll ID returned by a previous search, to fetch the next page.'),
  ...searchFilterFields,
  include_full_records: includeFullRecords.default(false).describe(
    'Return complete preview records including names and personal fields. Defaults to false for privacy; opt in explicitly when those fields are needed.',
  ),
});

export const saveSearchSchema = z.strictObject({
  search_string: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .describe('Human-readable name for the saved search.'),
  limit: boundedInt(1, 10_000).optional().describe('Result limit stored with the filter (1-10000).'),
  ...searchFilterFields,
});

export const updateSavedSearchSchema = z.strictObject({
  id: positiveInt.describe('ID of the saved search to rename.'),
  search_string: z.string().trim().min(1).max(255).describe('New name for the saved search.'),
});

export const updateFetchedSearchSchema = z.strictObject({
  id: positiveInt.describe('ID of the fetched search to rename.'),
  search_string: z.string().trim().min(1).max(255).describe('New name for the fetched search.'),
});

export const reviewContactsSchema = z.strictObject({
  filter_id: nonNegativeInt.describe('Filter ID whose contacts should be re-synced.'),
});

export const VERIFICATION_STATUSES = ['valid', 'catch_all', 'invalid'] as const;
export const CATCH_ALL_STATUSES = [
  'catch_all_verified',
  'catch_all_soft_bounced',
  'catch_all_hard_bounced',
  'catch_all_unknown',
  'catch_all_bounced',
] as const;

/** Documented maximum number of adapt IDs accepted by POST /get-contacts. */
export const GET_CONTACTS_MAX_IDS = 200;

export const getContactsSchema = z
  .strictObject({
    id: z
      .array(nonEmptyString)
      .min(1)
      .max(GET_CONTACTS_MAX_IDS)
      .optional()
      .describe(`Adapt IDs to retrieve (max ${GET_CONTACTS_MAX_IDS}). Mutually exclusive with filter_id.`),
    filter_id: positiveInt
      .optional()
      .describe('Filter ID to retrieve contacts for. Mutually exclusive with id.'),
    limit: boundedInt(1, 1000).optional().describe('Records to return (1-1000). Use with filter_id.'),
    offset: nonNegativeInt.optional().describe('Records to skip. Use with filter_id.'),
    search: searchTerm.optional().describe('Match first name, last name or full name.'),
    verification_status: z
      .enum(VERIFICATION_STATUSES)
      .optional()
      .describe('Filter by email verification status.'),
    catch_all_status: z.enum(CATCH_ALL_STATUSES).optional().describe('Filter by catch-all status.'),
    include_full_records: includeFullRecords,
  })
  // Smartlead documents an XOR between `id` and `filter_id`.
  .refine((value) => (value.id === undefined) !== (value.filter_id === undefined), {
    message: 'Provide exactly one of `id` or `filter_id` (not both, not neither).',
    path: ['filter_id'],
  });

/** Documented maximum number of contacts per find-emails call. */
export const FIND_EMAILS_MAX_CONTACTS = 10;

export const findEmailsSchema = z.strictObject({
  contacts: z
    .array(
      z.strictObject({
        firstName: nonEmptyString.describe('Contact first name.'),
        lastName: nonEmptyString.describe('Contact last name.'),
        companyDomain: nonEmptyString.describe('Company domain, e.g. example.com.'),
      }),
    )
    .min(1)
    .max(FIND_EMAILS_MAX_CONTACTS)
    .describe(`Contacts to look up (1-${FIND_EMAILS_MAX_CONTACTS}).`),
  confirm_credit_spend: confirmationFlag(
    'Must be true. Acknowledges that this call can consume SmartProspect credits.',
  ),
  include_full_records: includeFullRecords,
});

/** Documented standard maximum for fetch-contacts `limit`. */
export const FETCH_CONTACTS_STANDARD_MAX_LIMIT = 10_000;
/** Documented elevated maximum available to some accounts. */
export const FETCH_CONTACTS_ELEVATED_MAX_LIMIT = 30_000;

export const fetchContactsSchema = z
  .strictObject({
    filter_id: positiveInt.describe('Filter ID returned by smartprospect_search_contacts.'),
    id: z
      .array(nonEmptyString)
      .min(1)
      .optional()
      .describe('Adapt IDs to fetch. Mutually exclusive with limit.'),
    limit: boundedInt(1, FETCH_CONTACTS_ELEVATED_MAX_LIMIT)
      .optional()
      .describe(
        `Number of contacts to fetch for the filter. Smartlead documents 1-${FETCH_CONTACTS_STANDARD_MAX_LIMIT} (up to ${FETCH_CONTACTS_ELEVATED_MAX_LIMIT} for some accounts). Mutually exclusive with id.`,
      ),
    visual_limit: boundedInt(1, 1000).optional().describe('Page size for the returned page (1-1000).'),
    visual_offset: nonNegativeInt.optional().describe('Offset for the returned page.'),
    confirm_credit_spend: confirmationFlag(
      'Must be true. Acknowledges that this call can consume SmartProspect credits.',
    ),
    include_full_records: includeFullRecords,
  })
  .refine((value) => (value.id === undefined) !== (value.limit === undefined), {
    message: 'Provide exactly one of `id` or `limit` (not both, not neither).',
    path: ['limit'],
  });
