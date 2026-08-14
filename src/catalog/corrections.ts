import { CATALOG } from './endpoints.js';
import type { CatalogEntry, CatalogParam } from './types.js';

/**
 * Catalog pages that cannot safely or correctly become one generic MCP tool.
 * Keep the reasons close to the filter so regeneration cannot silently re-add
 * an unsafe operation.
 */
export const EXCLUDED_CATALOG_TOOLS = {
  smartlead_clients_api_keys:
    'One documentation page combines four methods and create/reset responses contain reusable API credentials.',
  smartlead_campaigns_update_lead:
    'Duplicate of smartlead_leads_update on the same canonical endpoint.',
  smartlead_campaigns_forward_email:
    'Official documentation has no verified request body for this sending operation.',
  smartdelivery_create_automated_test:
    'Official documentation supplies only an empty placeholder body for a configuration-heavy sending operation.',
  smartdelivery_create_manual_test:
    'Official documentation supplies only an empty placeholder body for test creation.',
  smartdelivery_delete_tests_bulk:
    'Official documentation does not specify the test-ID request body required for bulk deletion.',
  smartsenders_get_otp:
    'Returns a live mailbox OTP and MCP has no secure secret-output channel.',
  smartsenders_place_order:
    'Purchases domains/mailboxes but no dedicated financial-consent capability exists.',
} as const;

const capabilityCorrections: Record<string, CatalogEntry['capability']> = {
  smartlead_email_accounts_unsuspend: { remoteMutation: true, sending: true },
  smartlead_email_accounts_warmup_settings: { remoteMutation: true, sending: true },
  smartlead_email_accounts_update: { remoteMutation: true, sending: true },
  smartsenders_auto_generate: {},
  smartlead_campaigns_remove_email_accounts: { remoteMutation: true },
};

/** Child fields that the docs render separately but the API expects nested. */
const nestedChildren = new Set([
  'smartlead_campaigns_reply_email_thread:file_url',
  'smartlead_campaigns_reply_email_thread:file_type',
  'smartlead_campaigns_reply_email_thread:file_size',
  'smartlead_campaigns_update_schedule:days',
  'smartlead_campaigns_update_schedule:start_hour',
  'smartlead_campaigns_update_schedule:end_hour',
  'smartlead_campaigns_update_schedule:min_time_btw_emails',
  'smartlead_campaigns_update_sequences:seq_number',
  'smartlead_campaigns_update_sequences:subject',
  'smartlead_campaigns_update_sequences:email_body',
  'smartlead_campaigns_update_sequences:seq_delay_details',
  'smartlead_campaigns_update_settings:autoReactivateOOO',
  'smartlead_campaigns_update_settings:reactivateOOOwithDelay',
  'smartlead_campaigns_update_settings:autoCategorizeOOO',
]);

const numberParams = new Set([
  'smartlead_campaign_statistics_get_by_date_range:campaign_id',
  'smartlead_campaign_statistics_get_by_id:campaign_id',
  'smartlead_campaign_statistics_get_by_id:offset',
  'smartlead_campaign_statistics_get_by_id:limit',
  'smartlead_campaign_statistics_get_by_id:email_sequence_number',
  'smartlead_campaign_statistics_lead_statistics:campaign_id',
  'smartlead_campaign_statistics_lead_statistics:limit',
  'smartlead_campaign_statistics_lead_statistics:offset',
  'smartlead_campaign_statistics_mailbox_statistics:campaign_id',
  'smartlead_campaign_statistics_mailbox_statistics:client_id',
  'smartlead_campaign_statistics_mailbox_statistics:offset',
  'smartlead_campaign_statistics_mailbox_statistics:limit',
  'smartlead_campaign_statistics_top_level_by_date:campaign_id',
  'smartlead_campaigns_update_settings:follow_up_percentage',
  'smartlead_campaigns_update_settings:client_id',
  'smartsenders_search_domain:vendor_id',
]);

function correctParam(tool: string, param: CatalogParam): CatalogParam | undefined {
  // Dotted names are documentation breadcrumbs, not literal JSON keys. The
  // parent object remains available and accepts the real nested structure.
  if (param.name.includes('.') || nestedChildren.has(`${tool}:${param.name}`)) return undefined;

  const key = `${tool}:${param.name}`;
  if (
    param.name === 'action' &&
    (tool === 'smartlead_lead_lists_push_between_lists' || tool === 'smartlead_lead_lists_push_to_campaign')
  ) {
    return { ...param, enumValues: ['copy', 'move'] };
  }
  if (tool === 'smartlead_webhooks_create' && param.name === 'association_type') {
    return { ...param, enumValues: ['campaign', 'client', 'user'] };
  }
  if (!numberParams.has(key)) return param;

  const corrected: CatalogParam = { ...param, type: 'number' };
  if (param.name === 'offset') corrected.min = 0;
  if (param.name === 'limit') {
    corrected.min = 1;
    if (tool.includes('campaign_statistics')) corrected.max = 20;
  }
  if (tool === 'smartlead_campaigns_update_settings' && param.name === 'follow_up_percentage') {
    corrected.min = 0;
    corrected.max = 100;
  }
  return corrected;
}

function correctEntry(entry: CatalogEntry): CatalogEntry {
  return {
    ...entry,
    capability: capabilityCorrections[entry.tool] ?? entry.capability,
    params: entry.params.flatMap((param) => {
      const corrected = correctParam(entry.tool, param);
      return corrected ? [corrected] : [];
    }),
  };
}

/** The reviewed catalog that may be exposed through MCP. */
export const SUPPORTED_CATALOG: readonly CatalogEntry[] = CATALOG.filter(
  (entry) => !(entry.tool in EXCLUDED_CATALOG_TOOLS),
).map(correctEntry);
