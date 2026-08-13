import { capability } from '../../security/policy.js';
import { ToolRefusal, defineTool, toolList, type ToolContext } from '../types.js';
import { applyRecordVisibility, listLength, unwrap } from '../shape.js';
import * as schema from '../../schemas/smart-prospect.js';
import { isRecord } from '../../types/smartlead.js';
import { summarizeCredits, type CreditSummary } from './analytics.js';

/**
 * Credit-consuming SmartProspect operations.
 *
 * Both tools are doubly gated: SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true at the
 * process level *and* `confirm_credit_spend: true` per call. The policy layer
 * enforces both before the handler runs, so a blocked call never reaches
 * Smartlead and never costs anything.
 *
 * Neither underlying request is ever auto-retried (see prospect-client.ts).
 */

const CREDIT_CAPABILITY = capability({ creditSpending: true, remoteMutation: true });

const findEmails = defineTool({
  name: 'smartprospect_find_emails',
  title: 'SmartProspect: find emails (consumes credits)',
  summary:
    'Look up email addresses for up to 10 named contacts at their company domains. CONSUMES SMARTPROSPECT CREDITS.',
  notes: [
    `Maximum ${schema.FIND_EMAILS_MAX_CONTACTS} contacts per call; each contact requires firstName, lastName and companyDomain.`,
    'Requires SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true and confirm_credit_spend: true. Without both, the call is refused locally without contacting Smartlead.',
    'Never retried automatically — a retry could be charged twice.',
    'Check smartprospect_get_search_analytics first to see the credit balance.',
  ],
  capability: CREDIT_CAPABILITY,
  endpoint: { host: 'prospect', method: 'POST', route: '/search-contacts/find-emails' },
  inputSchema: schema.findEmailsSchema,
  handler: async (args, ctx) => {
    const body = { contacts: args.contacts };
    const unwrapped = unwrap(await ctx.prospect.findEmails(body));
    const found = Array.isArray(unwrapped.data)
      ? unwrapped.data.filter((entry) => isRecord(entry) && typeof entry.email_id === 'string' && entry.email_id !== '')
          .length
      : undefined;

    const warnings = [
      `Requested ${args.contacts.length} lookup(s); this call may have consumed SmartProspect credits.`,
    ];
    if (found !== undefined && found < args.contacts.length) {
      warnings.push(`${args.contacts.length - found} contact(s) had no email found.`);
    }

    return {
      data: applyRecordVisibility(unwrapped.data, args.include_full_records),
      pagination: { requested: args.contacts.length, emails_found: found ?? null },
      warnings,
    };
  },
});

const fetchContacts = defineTool({
  name: 'smartprospect_fetch_contacts',
  title: 'SmartProspect: fetch contacts for a filter (consumes credits)',
  summary:
    'Reveal contact email addresses for a saved filter, either by explicit adapt IDs or by a bounded limit. CONSUMES SMARTPROSPECT CREDITS.',
  notes: [
    'Provide exactly one of `id` (explicit adapt IDs) or `limit`.',
    `Documented \`limit\` range is 1-${schema.FETCH_CONTACTS_STANDARD_MAX_LIMIT} (up to ${schema.FETCH_CONTACTS_ELEVATED_MAX_LIMIT} on some accounts).`,
    'Requires SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true and confirm_credit_spend: true.',
    'Runs a free, read-only credit preflight first and rejects — never silently reduces — a request that exceeds available credits or the account single-fetch limit.',
    'Never retried automatically.',
  ],
  capability: CREDIT_CAPABILITY,
  endpoint: { host: 'prospect', method: 'POST', route: '/fetch-contacts' },
  inputSchema: schema.fetchContactsSchema,
  handler: async (args, ctx) => {
    const requested = args.limit ?? args.id?.length ?? 0;
    const warnings: string[] = [];

    if (args.limit !== undefined && args.limit > schema.FETCH_CONTACTS_STANDARD_MAX_LIMIT) {
      warnings.push(
        `Requested limit ${args.limit} exceeds the standard documented maximum of ${schema.FETCH_CONTACTS_STANDARD_MAX_LIMIT}; Smartlead only allows up to ${schema.FETCH_CONTACTS_ELEVATED_MAX_LIMIT} for some accounts.`,
      );
    }

    const preflight = args.skip_credit_preflight
      ? { performed: false as const, reason: 'skip_credit_preflight was true' }
      : await runCreditPreflight(ctx);

    if (preflight.performed && preflight.credits) {
      assertWithinCredits(requested, args.limit, preflight.credits);
      const daily = preflight.credits.maxDailyFetchLimit;
      const today = preflight.credits.leadsFoundToday;
      if (daily !== undefined && today !== undefined && today + requested > daily) {
        warnings.push(
          `This request (${requested}) plus today's usage (${today}) may exceed the account daily fetch limit of ${daily}.`,
        );
      }
    } else if (preflight.performed) {
      warnings.push('Credit preflight returned no recognisable credit figures; proceeding as confirmed.');
    } else if (!args.skip_credit_preflight) {
      warnings.push(`Credit preflight could not be completed (${preflight.reason}); proceeding as confirmed.`);
    }

    const body: Record<string, unknown> = { filter_id: args.filter_id };
    if (args.id !== undefined) body.id = args.id;
    if (args.limit !== undefined) body.limit = args.limit;
    if (args.visual_limit !== undefined) body.visual_limit = args.visual_limit;
    if (args.visual_offset !== undefined) body.visual_offset = args.visual_offset;

    const unwrapped = unwrap(await ctx.prospect.fetchContacts(body));
    const data = unwrapped.data;

    warnings.push(`Requested ${requested} contact(s); this call may have consumed SmartProspect credits.`);

    return {
      data: {
        credit_preflight: preflight,
        requested,
        result: applyRecordVisibility(data, args.include_full_records),
      },
      pagination: isRecord(data)
        ? {
            total_count: data.total_count ?? null,
            visual_limit: data.visual_limit ?? null,
            visual_offset: data.visual_offset ?? null,
            returned: listLength(data) ?? 0,
          }
        : null,
      warnings,
    };
  },
});

type Preflight =
  | { performed: true; credits: CreditSummary | undefined }
  | { performed: false; reason: string };

/**
 * Read the current credit state. Uses the free, read-only analytics endpoint,
 * so the preflight itself can never cost anything.
 */
async function runCreditPreflight(ctx: ToolContext): Promise<Preflight> {
  try {
    const analytics = unwrap(await ctx.prospect.getSearchAnalytics({}));
    return { performed: true, credits: summarizeCredits(analytics.data) };
  } catch (error) {
    return { performed: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Reject — never clamp — a request that the account cannot satisfy.
 * Clamping would silently return fewer contacts than the caller asked for while
 * still spending credits, which is exactly the failure mode this guards against.
 */
function assertWithinCredits(requested: number, limit: number | undefined, credits: CreditSummary): void {
  if (credits.available !== undefined && requested > credits.available) {
    throw new ToolRefusal(
      'insufficient_credits',
      `Requested ${requested} contact(s) but only ${credits.available} SmartProspect credit(s) are available. The request was not sent and no credits were spent.`,
      [
        `Reduce the request to ${credits.available} or fewer.`,
        'Or top up SmartProspect credits in the Smartlead dashboard.',
      ],
    );
  }
  if (limit !== undefined && credits.maxSingleFetchLimit !== undefined && limit > credits.maxSingleFetchLimit) {
    throw new ToolRefusal(
      'single_fetch_limit_exceeded',
      `Requested limit ${limit} exceeds this account's single-fetch limit of ${credits.maxSingleFetchLimit}. The request was not sent and no credits were spent.`,
      [`Call again with limit <= ${credits.maxSingleFetchLimit}.`],
    );
  }
}

export const creditTools = toolList(findEmails, fetchContacts);
