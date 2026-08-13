import { READ_ONLY } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import * as schema from '../../schemas/core.js';

/** Read-only view of the sending infrastructure. No mailbox mutation in 0.1.0. */

const listEmailAccounts = defineTool({
  name: 'smartlead_list_email_accounts',
  title: 'Smartlead: list email accounts',
  summary: 'List connected sending accounts with warmup, SMTP and provider filters.',
  notes: ['Free and read-only.', 'Returns mailbox addresses, which are personal data.'],
  capability: READ_ONLY,
  endpoint: { host: 'core', method: 'GET', route: '/email-accounts/' },
  inputSchema: schema.listEmailAccountsSchema,
  handler: async (args, ctx) => {
    const { isInUse, isSmtpSuccess, isWarmupBlocked, fetch_campaigns, ...rest } = args;
    // Smartlead documents these filters as the strings "true"/"false".
    const query = {
      ...rest,
      isInUse: isInUse === undefined ? undefined : String(isInUse),
      isSmtpSuccess: isSmtpSuccess === undefined ? undefined : String(isSmtpSuccess),
      isWarmupBlocked: isWarmupBlocked === undefined ? undefined : String(isWarmupBlocked),
      fetch_campaigns: fetch_campaigns === undefined ? undefined : String(fetch_campaigns),
    };
    const result = await ctx.core.listEmailAccounts(query);
    return { data: result.data, pagination: { limit: args.limit, offset: args.offset } };
  },
});

export const emailAccountTools = toolList(listEmailAccounts);
