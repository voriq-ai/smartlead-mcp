import { describe, expect, it } from 'vitest';
import * as sp from '../../src/schemas/smart-prospect.js';
import * as core from '../../src/schemas/core.js';

describe('search-contacts schema', () => {
  it('requires limit', () => {
    expect(sp.searchContactsSchema.safeParse({}).success).toBe(false);
  });

  it.each([0, -1, 501, 1.5])('rejects the limit %p', (limit) => {
    expect(sp.searchContactsSchema.safeParse({ limit }).success).toBe(false);
  });

  it.each([1, 250, 500])('accepts the limit %p', (limit) => {
    expect(sp.searchContactsSchema.safeParse({ limit }).success).toBe(true);
  });

  it('enforces the documented 2000-item cap on array filters', () => {
    const ok = sp.searchContactsSchema.safeParse({ limit: 1, title: Array(2000).fill('Director') });
    expect(ok.success).toBe(true);
    const tooMany = sp.searchContactsSchema.safeParse({ limit: 1, title: Array(2001).fill('Director') });
    expect(tooMany.success).toBe(false);
  });

  it('rejects blank strings inside array filters', () => {
    expect(sp.searchContactsSchema.safeParse({ limit: 1, country: ['   '] }).success).toBe(false);
  });

  it('rejects unknown fields', () => {
    expect(sp.searchContactsSchema.safeParse({ limit: 1, notARealFilter: 'x' }).success).toBe(false);
  });

  it('de-identifies search previews by default', () => {
    const parsed = sp.searchContactsSchema.parse({ limit: 1 });
    expect(parsed.include_full_records).toBe(false);
  });
});

describe('get-contacts XOR', () => {
  it('accepts id alone', () => {
    expect(sp.getContactsSchema.safeParse({ id: ['abc'] }).success).toBe(true);
  });

  it('accepts filter_id alone', () => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 327105 }).success).toBe(true);
  });

  it('rejects both', () => {
    const result = sp.getContactsSchema.safeParse({ id: ['abc'], filter_id: 327105 });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain('exactly one');
  });

  it('rejects neither', () => {
    expect(sp.getContactsSchema.safeParse({}).success).toBe(false);
  });

  it('enforces the documented 200-id maximum', () => {
    expect(sp.getContactsSchema.safeParse({ id: Array(200).fill('x') }).success).toBe(true);
    expect(sp.getContactsSchema.safeParse({ id: Array(201).fill('x') }).success).toBe(false);
  });

  it('enforces the documented limit range', () => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, limit: 1000 }).success).toBe(true);
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, limit: 1001 }).success).toBe(false);
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, limit: 0 }).success).toBe(false);
  });

  it.each(sp.VERIFICATION_STATUSES)('accepts verification_status %s', (status) => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, verification_status: status }).success).toBe(true);
  });

  it('rejects an unknown verification_status', () => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, verification_status: 'unknown' }).success).toBe(false);
  });

  it.each(sp.CATCH_ALL_STATUSES)('accepts catch_all_status %s', (status) => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, catch_all_status: status }).success).toBe(true);
  });

  it('rejects an unknown catch_all_status', () => {
    expect(sp.getContactsSchema.safeParse({ filter_id: 1, catch_all_status: 'catch_all' }).success).toBe(false);
  });
});

describe('find-emails schema', () => {
  const contact = { firstName: 'Ada', lastName: 'Lovelace', companyDomain: 'example.com' };

  it('accepts the documented maximum of 10 contacts', () => {
    expect(sp.findEmailsSchema.safeParse({ contacts: Array(10).fill(contact) }).success).toBe(true);
  });

  it('rejects 11 contacts', () => {
    expect(sp.findEmailsSchema.safeParse({ contacts: Array(11).fill(contact) }).success).toBe(false);
  });

  it('rejects an empty batch', () => {
    expect(sp.findEmailsSchema.safeParse({ contacts: [] }).success).toBe(false);
  });

  it.each(['firstName', 'lastName', 'companyDomain'])('requires %s on each contact', (field) => {
    const partial: Record<string, string> = { ...contact };
    delete partial[field];
    expect(sp.findEmailsSchema.safeParse({ contacts: [partial] }).success).toBe(false);
  });

  it('defaults confirm_credit_spend to false', () => {
    expect(sp.findEmailsSchema.parse({ contacts: [contact] }).confirm_credit_spend).toBe(false);
  });

  it('rejects a non-boolean confirmation', () => {
    expect(
      sp.findEmailsSchema.safeParse({ contacts: [contact], confirm_credit_spend: 'true' }).success,
    ).toBe(false);
  });
});

describe('fetch-contacts schema', () => {
  it('requires filter_id', () => {
    expect(sp.fetchContactsSchema.safeParse({ limit: 10 }).success).toBe(false);
  });

  it('requires exactly one of id or limit', () => {
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 10 }).success).toBe(true);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, id: ['a'] }).success).toBe(true);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1 }).success).toBe(false);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 10, id: ['a'] }).success).toBe(false);
  });

  it('enforces the documented limit bounds', () => {
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 0 }).success).toBe(false);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 30_000 }).success).toBe(true);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 30_001 }).success).toBe(false);
  });

  it('enforces the visual pagination bounds', () => {
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 1, visual_limit: 1000 }).success).toBe(true);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 1, visual_limit: 1001 }).success).toBe(false);
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 1, limit: 1, visual_offset: -1 }).success).toBe(false);
  });

  it('rejects a non-positive filter_id', () => {
    expect(sp.fetchContactsSchema.safeParse({ filter_id: 0, limit: 1 }).success).toBe(false);
  });

  it('does not permit bypassing the mandatory credit preflight', () => {
    expect(
      sp.fetchContactsSchema.safeParse({
        filter_id: 1,
        limit: 1,
        confirm_credit_spend: true,
        skip_credit_preflight: true,
      }).success,
    ).toBe(false);
  });
});

describe('smart-prospect lookup schemas', () => {
  it('bounds documented lookups to 1-100 with a default of 10', () => {
    expect(sp.listCountriesSchema.parse({}).limit).toBe(10);
    expect(sp.listCountriesSchema.safeParse({ limit: 100 }).success).toBe(true);
    expect(sp.listCountriesSchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(sp.listCountriesSchema.safeParse({ offset: -1 }).success).toBe(false);
  });

  it('bounds search terms to 255 characters', () => {
    expect(sp.listCountriesSchema.safeParse({ search: 'x'.repeat(255) }).success).toBe(true);
    expect(sp.listCountriesSchema.safeParse({ search: 'x'.repeat(256) }).success).toBe(false);
  });

  it('requires a positive industry_id on sub-industries', () => {
    expect(sp.listSubIndustriesSchema.safeParse({ industry_id: 0 }).success).toBe(false);
  });

  it('takes no parameters for revenue ranges', () => {
    expect(sp.listRevenueRangesSchema.safeParse({ limit: 10 }).success).toBe(false);
  });
});

describe('save/update search schemas', () => {
  it('requires a non-empty search_string', () => {
    expect(sp.saveSearchSchema.safeParse({ search_string: '' }).success).toBe(false);
    expect(sp.saveSearchSchema.safeParse({ search_string: 'Directors in the US' }).success).toBe(true);
  });

  it('bounds the saved-search limit to 10000', () => {
    expect(sp.saveSearchSchema.safeParse({ search_string: 'x', limit: 10_000 }).success).toBe(true);
    expect(sp.saveSearchSchema.safeParse({ search_string: 'x', limit: 10_001 }).success).toBe(false);
  });

  it('requires a positive id and a 1-255 character name when renaming', () => {
    expect(sp.updateSavedSearchSchema.safeParse({ id: 0, search_string: 'x' }).success).toBe(false);
    expect(sp.updateSavedSearchSchema.safeParse({ id: 1, search_string: 'x'.repeat(256) }).success).toBe(false);
    expect(sp.updateFetchedSearchSchema.safeParse({ id: 1, search_string: 'ok' }).success).toBe(true);
  });
});

describe('core schemas', () => {
  it('validates the lead email address', () => {
    expect(core.getLeadByEmailSchema.safeParse({ email: 'person@example.com' }).success).toBe(true);
    expect(core.getLeadByEmailSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });

  it('enforces the documented 400-lead import maximum', () => {
    const lead = { email: 'person@example.com' };
    expect(
      core.addLeadsToCampaignSchema.safeParse({ campaign_id: 1, lead_list: Array(400).fill(lead) }).success,
    ).toBe(true);
    expect(
      core.addLeadsToCampaignSchema.safeParse({ campaign_id: 1, lead_list: Array(401).fill(lead) }).success,
    ).toBe(false);
  });

  it('requires an explicit campaign_id for imports', () => {
    expect(core.addLeadsToCampaignSchema.safeParse({ lead_list: [{ email: 'a@example.com' }] }).success).toBe(
      false,
    );
  });

  it('caps custom fields at 200 keys', () => {
    const custom = Object.fromEntries(Array.from({ length: 201 }, (_v, i) => [`k${i}`, 'v']));
    expect(
      core.addLeadsToCampaignSchema.safeParse({
        campaign_id: 1,
        lead_list: [{ email: 'a@example.com', custom_fields: custom }],
      }).success,
    ).toBe(false);
  });

  it('accepts only the documented campaign statuses', () => {
    for (const status of core.CAMPAIGN_STATUSES) {
      expect(core.updateCampaignStatusSchema.safeParse({ campaign_id: 1, status }).success).toBe(true);
    }
    expect(core.updateCampaignStatusSchema.safeParse({ campaign_id: 1, status: 'ACTIVE' }).success).toBe(false);
  });

  it('bounds campaign lead pagination to the documented 1-100', () => {
    expect(core.getCampaignLeadsSchema.safeParse({ campaign_id: 1, limit: 100 }).success).toBe(true);
    expect(core.getCampaignLeadsSchema.safeParse({ campaign_id: 1, limit: 101 }).success).toBe(false);
  });

  it('validates the tagIds comma-separated format', () => {
    expect(core.listLeadListsSchema.safeParse({ tagIds: '1,2,3' }).success).toBe(true);
    expect(core.listLeadListsSchema.safeParse({ tagIds: '1, 2' }).success).toBe(false);
  });

  it('requires positive numeric IDs', () => {
    expect(core.getCampaignSchema.safeParse({ campaign_id: 0 }).success).toBe(false);
    expect(core.getCampaignSchema.safeParse({ campaign_id: -3 }).success).toBe(false);
    expect(core.removeDomainBlockListSchema.safeParse({ id: 0 }).success).toBe(false);
  });

  it('requires at least one entry when blocking domains', () => {
    expect(core.addDomainBlockListSchema.safeParse({ domain_block_list: [] }).success).toBe(false);
    expect(core.addDomainBlockListSchema.safeParse({ domain_block_list: ['example.com'] }).success).toBe(true);
  });
});
