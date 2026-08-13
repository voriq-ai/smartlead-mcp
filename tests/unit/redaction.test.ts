import { describe, expect, it } from 'vitest';
import { REDACTED, redactSecrets, redactUrl, redactValue, summarizeBody } from '../../src/security/redaction.js';
import { SmartleadApiError } from '../../src/client/errors.js';
import { TEST_API_KEY } from '../helpers/mock-fetch.js';

describe('redactUrl', () => {
  it('masks api_key in a full URL', () => {
    const input = `https://prospect-api.smartlead.ai/api/v1/search-email-leads/countries?limit=10&api_key=${TEST_API_KEY}`;
    const out = redactUrl(input);
    expect(out).toBe(
      'https://prospect-api.smartlead.ai/api/v1/search-email-leads/countries?limit=10&api_key=[REDACTED]',
    );
    expect(out).not.toContain(TEST_API_KEY);
  });

  it('masks api_key when it is not the last parameter', () => {
    const out = redactUrl(`https://server.smartlead.ai/api/v1/campaigns/?api_key=${TEST_API_KEY}&include_tags=true`);
    expect(out).toContain('api_key=[REDACTED]&include_tags=true');
    expect(out).not.toContain(TEST_API_KEY);
  });

  it('masks other credential-shaped parameters', () => {
    expect(redactUrl('https://x.test/?token=abc123&access_token=def456')).toBe(
      'https://x.test/?token=[REDACTED]&access_token=[REDACTED]',
    );
  });
});

describe('redactSecrets', () => {
  it('removes a literal secret that is not in a query string', () => {
    const out = redactSecrets(`Authorization header was Bearer ${TEST_API_KEY}`, [TEST_API_KEY]);
    expect(out).not.toContain(TEST_API_KEY);
    expect(out).toContain(REDACTED);
  });

  it('ignores trivially short secrets so unrelated text is not mangled', () => {
    expect(redactSecrets('the abc value', ['abc'])).toBe('the abc value');
  });
});

describe('redactValue', () => {
  it('drops credential-shaped object keys and scrubs nested strings', () => {
    const out = redactValue(
      {
        api_key: TEST_API_KEY,
        nested: { url: `https://x.test/?api_key=${TEST_API_KEY}`, list: [`k=${TEST_API_KEY}`] },
        keep: 'value',
      },
      [TEST_API_KEY],
    );
    expect(JSON.stringify(out)).not.toContain(TEST_API_KEY);
    expect(out.api_key).toBe(REDACTED);
    expect(out.keep).toBe('value');
  });

  it('fails closed at the maximum nesting depth', () => {
    let nested: Record<string, unknown> = { api_key: TEST_API_KEY };
    for (let i = 0; i < 20; i += 1) nested = { nested };
    const out = redactValue(nested, [TEST_API_KEY]);
    expect(JSON.stringify(out)).not.toContain(TEST_API_KEY);
    expect(JSON.stringify(out)).toContain('maximum nesting depth exceeded');
  });
});

describe('summarizeBody', () => {
  it('reports field names and array lengths but never values', () => {
    const summary = summarizeBody({
      contacts: [{ firstName: 'A' }, { firstName: 'B' }],
      filter_id: 1,
      flag: true,
      nothing: null,
      nested: {},
    });
    expect(summary).toEqual({
      contacts: 'array(2)',
      filter_id: 'number',
      flag: 'boolean',
      nothing: 'null',
      nested: 'object',
    });
  });
});

describe('SmartleadApiError', () => {
  it('redacts the key from the message, url and details at construction time', () => {
    const error = new SmartleadApiError(
      {
        kind: 'authentication',
        message: `failed for api_key=${TEST_API_KEY}`,
        url: `https://server.smartlead.ai/api/v1/campaigns/?api_key=${TEST_API_KEY}`,
        details: { echoed: TEST_API_KEY },
        status: 401,
      },
      [TEST_API_KEY],
    );

    expect(error.message).not.toContain(TEST_API_KEY);
    expect(error.url).not.toContain(TEST_API_KEY);
    expect(JSON.stringify(error.toJSON())).not.toContain(TEST_API_KEY);
  });

  it('omits stack traces and causes from its JSON form', () => {
    const error = new SmartleadApiError({
      kind: 'server',
      message: 'boom',
      cause: new Error('inner detail'),
    });
    const json = JSON.stringify(error.toJSON());
    expect(json).not.toContain('inner detail');
    expect(json).not.toContain('at ');
  });
});
