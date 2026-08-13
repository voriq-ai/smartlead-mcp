import { describe, expect, it, beforeAll } from 'vitest';
import { loadConfig } from '../../src/config.js';
import { ProspectClient } from '../../src/client/prospect-client.js';
import { summarizeCredits } from '../../src/tools/smart-prospect/analytics.js';
import { unwrap } from '../../src/tools/shape.js';

/**
 * Opt-in live suite.
 *
 * Runs only when SMARTLEAD_LIVE_TESTS=true and SMARTLEAD_API_KEY is present.
 *
 * Strictly read-only. It deliberately never calls find-emails, fetch-contacts,
 * lead import, campaign mutation, sending, deletion or unsubscribe. Credit
 * balance is measured before and after the whole suite to prove nothing here
 * spent credits.
 */

const enabled = process.env.SMARTLEAD_LIVE_TESTS === 'true' && Boolean(process.env.SMARTLEAD_API_KEY);

describe.skipIf(!enabled)('live read-only smoke tests', () => {
  let prospect: ProspectClient;
  let creditsBefore: number | undefined;

  beforeAll(async () => {
    prospect = new ProspectClient(loadConfig());
    const analytics = unwrap(await prospect.getSearchAnalytics());
    creditsBefore = summarizeCredits(analytics.data)?.available;
  });

  it('lists one country', async () => {
    const result = unwrap(await prospect.listCountries({ limit: 1 }));
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data as unknown[]).length).toBeLessThanOrEqual(1);
  });

  it('returns search analytics with a credit balance', async () => {
    const result = unwrap(await prospect.getSearchAnalytics());
    const credits = summarizeCredits(result.data);
    expect(credits).toBeDefined();
    expect(typeof credits?.available === 'number' || credits?.available === undefined).toBe(true);
  });

  it('searches contacts with limit 1 without revealing paid emails', async () => {
    const result = unwrap(await prospect.searchContacts({ limit: 1 }));
    const data = result.data as { list?: unknown[]; filter_id?: number; total_count?: number };
    expect(data).toBeTruthy();
    expect(Array.isArray(data.list)).toBe(true);
    expect(data.list!.length).toBeLessThanOrEqual(1);
  });

  it('did not consume any credits', async () => {
    const analytics = unwrap(await prospect.getSearchAnalytics());
    const creditsAfter = summarizeCredits(analytics.data)?.available;
    // If the account does not report a numeric balance there is nothing to compare.
    if (typeof creditsBefore !== 'number' || typeof creditsAfter !== 'number') {
      expect(creditsAfter).toBe(creditsBefore);
      return;
    }
    expect(creditsAfter).toBe(creditsBefore);
  });
});

describe.skipIf(enabled)('live suite gating', () => {
  it('is skipped unless SMARTLEAD_LIVE_TESTS=true and a key is present', () => {
    expect(enabled).toBe(false);
  });
});
