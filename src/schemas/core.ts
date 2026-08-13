import { z } from 'zod';
import {
  boundedInt,
  confirmationFlag,
  emailAddress,
  nonEmptyString,
  nonNegativeInt,
  positiveInt,
} from './common.js';

/**
 * Zod schemas for the subset of the core Smartlead API exposed in 0.1.0.
 * Constraints mirror https://api.smartlead.ai/api-reference/* as checked on 2026-08-14.
 */

export const listCampaignsSchema = z.strictObject({
  client_id: positiveInt.optional().describe('Restrict to one client (agency / white-label accounts).'),
  include_tags: z.boolean().optional().describe('Include campaign tags in the response.'),
});

export const getCampaignSchema = z.strictObject({
  campaign_id: positiveInt.describe('Campaign ID.'),
  include_tags: z.boolean().optional().describe('Include campaign tags in the response.'),
});

export const getCampaignAnalyticsSchema = z.strictObject({
  campaign_id: positiveInt.describe('Campaign ID.'),
});

export const LEAD_STATUSES = ['STARTED', 'INPROGRESS', 'COMPLETED', 'PAUSED', 'STOPPED'] as const;
export const LEAD_EMAIL_STATUSES = [
  'is_opened',
  'is_clicked',
  'is_bounced',
  'is_replied',
  'is_unsubscribed',
  'is_spam',
  'is_accepted',
  'not_replied',
  'is_sender_bounced',
] as const;

export const getCampaignLeadsSchema = z.strictObject({
  campaign_id: positiveInt.describe('Campaign ID.'),
  offset: nonNegativeInt.default(0).describe('Pagination offset.'),
  limit: boundedInt(1, 100).default(100).describe('Records per page (1-100).'),
  created_at_gt: nonEmptyString.optional().describe('ISO 8601 timestamp; leads created after this.'),
  last_sent_time_gt: nonEmptyString
    .optional()
    .describe('ISO 8601 timestamp; leads whose last email was sent after this.'),
  event_time_gt: nonEmptyString.optional().describe('ISO 8601 timestamp; filter by last event time.'),
  status: z.enum(LEAD_STATUSES).optional().describe('Lead sequence status filter.'),
  lead_category_id: positiveInt.optional().describe('Filter by lead category ID.'),
  emailStatus: z.enum(LEAD_EMAIL_STATUSES).optional().describe('Filter by email engagement status.'),
});

export const ESP_VALUES = ['GMAIL', 'OUTLOOK', 'SMTP'] as const;
export const WARMUP_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export const listEmailAccountsSchema = z.strictObject({
  offset: nonNegativeInt.default(0).describe('Pagination offset.'),
  limit: boundedInt(1, 100).default(100).describe('Accounts per page (1-100).'),
  isInUse: z.boolean().optional().describe('Filter by whether the account is used in campaigns.'),
  emailWarmupStatus: z.enum(WARMUP_STATUSES).optional().describe('Filter by warmup status.'),
  isSmtpSuccess: z.boolean().optional().describe('Filter by SMTP connection success.'),
  isWarmupBlocked: z.boolean().optional().describe('Filter by warmup blocked status.'),
  esp: z.enum(ESP_VALUES).optional().describe('Filter by email service provider.'),
  username: nonEmptyString.optional().describe('Partial match on the account username.'),
  client_id: positiveInt.optional().describe('Filter by client ID.'),
  fetch_campaigns: z.boolean().optional().describe('Include the campaign IDs each account is used in.'),
});

export const getLeadByEmailSchema = z.strictObject({
  email: emailAddress.describe('Email address to look up.'),
});

export const listLeadListsSchema = z.strictObject({
  listName: nonEmptyString.optional().describe('Partial match on the list name.'),
  tagIds: z
    .string()
    .trim()
    .regex(/^\d+(,\d+)*$/, 'must be a comma-separated list of numeric tag IDs, e.g. "1,2,3"')
    .optional()
    .describe('Comma-separated tag IDs, e.g. "1,2,3".'),
  limit: boundedInt(1, 1000).default(10).describe('Lists to return (1-1000).'),
  offset: nonNegativeInt.default(0).describe('Records to skip.'),
});

export const getDomainBlockListSchema = z.strictObject({
  offset: nonNegativeInt.default(0).describe('Pagination offset.'),
  limit: boundedInt(1, 1000).default(100).describe('Records to return (1-1000).'),
  filter_client_id: positiveInt.optional().describe('Filter by client ID.'),
  filter_email_or_domain: nonEmptyString.optional().describe('Search by email or domain name.'),
  filter_email_with_domain: nonEmptyString.optional().describe('Search by email with domain.'),
});

export const createCampaignSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .describe('Campaign name. Smartlead defaults to "Untitled Campaign".'),
  client_id: positiveInt.optional().describe('Associate the campaign with a client.'),
});

export const CAMPAIGN_STATUSES = ['START', 'PAUSED', 'STOPPED'] as const;

export const updateCampaignStatusSchema = z.strictObject({
  campaign_id: positiveInt.describe('Campaign ID.'),
  status: z
    .enum(CAMPAIGN_STATUSES)
    .describe(
      'New status. START begins or resumes sending (Smartlead documents "START", not "ACTIVE"); PAUSED halts sending; STOPPED permanently stops the campaign.',
    ),
  confirm_send: confirmationFlag(
    'Must be true when status is START. Acknowledges that activating the campaign will send email.',
  ),
});

/** Documented maximum number of leads per add-leads request. */
export const ADD_LEADS_MAX = 400;
/** Documented maximum number of custom fields per lead. */
export const MAX_CUSTOM_FIELDS = 200;

const leadSchema = z.strictObject({
  email: emailAddress.describe('Lead email address (required).'),
  first_name: nonEmptyString.optional(),
  last_name: nonEmptyString.optional(),
  company_name: nonEmptyString.optional(),
  phone_number: nonEmptyString.optional(),
  website: nonEmptyString.optional(),
  location: nonEmptyString.optional(),
  linkedin_profile: nonEmptyString.optional(),
  company_url: nonEmptyString.optional(),
  custom_fields: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .refine((value) => Object.keys(value).length <= MAX_CUSTOM_FIELDS, {
      message: `custom_fields supports at most ${MAX_CUSTOM_FIELDS} keys`,
    })
    .optional()
    .describe(`Custom field key/value pairs (max ${MAX_CUSTOM_FIELDS}).`),
});

export const addLeadsToCampaignSchema = z.strictObject({
  campaign_id: positiveInt.describe('Target campaign ID. Required — leads are never imported implicitly.'),
  lead_list: z
    .array(leadSchema)
    .min(1)
    .max(ADD_LEADS_MAX)
    .describe(`Leads to import (1-${ADD_LEADS_MAX}). Duplicate emails are removed locally before sending.`),
  settings: z
    .strictObject({
      ignore_global_block_list: z.boolean().optional(),
      ignore_unsubscribe_list: z.boolean().optional(),
      ignore_duplicate_leads_in_other_campaign: z.boolean().optional(),
      ignore_community_bounce_list: z.boolean().optional(),
      return_lead_ids: z.boolean().optional(),
    })
    .optional()
    .describe('Smartlead validation and duplicate-handling settings.'),
  confirm_import: confirmationFlag(
    'Must be true. Acknowledges that leads will be written into the target campaign.',
  ),
});

export const addDomainBlockListSchema = z.strictObject({
  domain_block_list: z
    .array(nonEmptyString)
    .min(1)
    .max(1000)
    .describe('Domains or email addresses to block. Smartlead documents no maximum; 1000 is a client-side guard.'),
  client_id: positiveInt.optional().describe('Associate the entries with a client.'),
});

export const removeDomainBlockListSchema = z.strictObject({
  id: positiveInt.describe('ID of the block list entry to delete (from smartlead_get_domain_block_list).'),
  confirm_destructive: confirmationFlag(
    'Must be true. Deleting a block list entry re-enables outreach to that domain.',
  ),
});
