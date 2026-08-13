import { describe, expect, it } from 'vitest';
import { HttpClient } from '../../src/client/http.js';
import { SmartleadApiError } from '../../src/client/errors.js';
import { CoreClient } from '../../src/client/core-client.js';
import { ProspectClient } from '../../src/client/prospect-client.js';
import { TEST_API_KEY, createMockFetch, noSleep, parseCall, testConfig } from '../helpers/mock-fetch.js';

/** Await a request that must fail and return the resulting SmartleadApiError. */
async function expectError(promise: Promise<unknown>): Promise<SmartleadApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof SmartleadApiError) return error;
    throw error;
  }
  throw new Error('expected the request to reject');
}

function client(mockFetch: typeof fetch, overrides: Partial<ConstructorParameters<typeof HttpClient>[0]> = {}) {
  return new HttpClient({
    baseUrl: 'https://prospect-api.smartlead.ai/api/v1/search-email-leads',
    apiKey: TEST_API_KEY,
    timeoutMs: 50,
    maxRetries: 2,
    host: 'SmartProspect',
    fetchImpl: mockFetch,
    sleep: noSleep,
    ...overrides,
  });
}

describe('host separation', () => {
  it('sends core operations to server.smartlead.ai', async () => {
    const mock = createMockFetch([{ json: { success: true, data: [] } }]);
    const core = new CoreClient(testConfig(), mock.fetch, noSleep);
    await core.listCampaigns({});
    const { origin, pathname } = parseCall(mock.last());
    expect(origin).toBe('https://server.smartlead.ai');
    expect(pathname).toBe('/api/v1/campaigns/');
  });

  it('sends SmartProspect operations to prospect-api.smartlead.ai', async () => {
    const mock = createMockFetch([{ json: { success: true, data: [] } }]);
    const prospect = new ProspectClient(testConfig(), mock.fetch, noSleep);
    await prospect.listCountries({ limit: 1 });
    const { origin, pathname } = parseCall(mock.last());
    expect(origin).toBe('https://prospect-api.smartlead.ai');
    expect(pathname).toBe('/api/v1/search-email-leads/countries');
  });

  it('never routes a SmartProspect call to the core host and vice versa', async () => {
    const mock = createMockFetch([{ json: { success: true } }]);
    const config = testConfig();
    const core = new CoreClient(config, mock.fetch, noSleep);
    const prospect = new ProspectClient(config, mock.fetch, noSleep);

    await core.listEmailAccounts({});
    await prospect.getSearchAnalytics();

    expect(mock.calls[0]!.url).toContain('https://server.smartlead.ai/api/v1/email-accounts/');
    expect(mock.calls[1]!.url).toContain(
      'https://prospect-api.smartlead.ai/api/v1/search-email-leads/search-analytics',
    );
  });
});

describe('api key injection', () => {
  it('adds api_key as a query parameter on every request', async () => {
    const mock = createMockFetch([{ json: { success: true } }]);
    await client(mock.fetch).request({ method: 'GET', path: '/countries', query: { limit: 5 } });
    const { query } = parseCall(mock.last());
    expect(query.api_key).toBe(TEST_API_KEY);
    expect(query.limit).toBe('5');
  });

  it('drops undefined, null and empty query values', async () => {
    const mock = createMockFetch([{ json: { success: true } }]);
    await client(mock.fetch).request({
      method: 'GET',
      path: '/countries',
      query: { a: undefined, b: null, c: '', d: 0, e: false },
    });
    const { query } = parseCall(mock.last());
    expect(query).toEqual({ d: '0', e: 'false', api_key: TEST_API_KEY });
  });

  it('sets JSON headers only when a body is present', async () => {
    const mock = createMockFetch([{ json: { success: true } }, { json: { success: true } }]);
    const http = client(mock.fetch);
    await http.request({ method: 'GET', path: '/countries' });
    expect(mock.calls[0]!.headers['content-type']).toBeUndefined();
    expect(mock.calls[0]!.headers.accept).toBe('application/json');

    await http.request({ method: 'POST', path: '/search-contacts', body: { limit: 1 }, retryable: false });
    expect(mock.calls[1]!.headers['content-type']).toBe('application/json');
    expect(mock.calls[1]!.body).toEqual({ limit: 1 });
  });

  it('redacts the key from the URL it exposes', () => {
    const mock = createMockFetch([]);
    const redacted = client(mock.fetch).redactedUrl('/countries', { limit: 2 });
    expect(redacted).not.toContain(TEST_API_KEY);
    expect(redacted).toContain('api_key=[REDACTED]');
  });
});

describe('response handling', () => {
  it('parses JSON success bodies', async () => {
    const mock = createMockFetch([{ json: { success: true, data: [{ id: 1 }] } }]);
    const result = await client(mock.fetch).request({ method: 'GET', path: '/countries' });
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ success: true, data: [{ id: 1 }] });
  });

  it('treats an empty body as null rather than crashing', async () => {
    const mock = createMockFetch([{ text: '', contentType: 'text/plain' }]);
    const result = await client(mock.fetch).request({ method: 'GET', path: '/countries' });
    expect(result.data).toBeNull();
  });

  it('raises a protocol error for a non-JSON 200 body', async () => {
    const mock = createMockFetch([{ text: '<html>gateway</html>', contentType: 'text/html' }]);
    await expect(client(mock.fetch).request({ method: 'GET', path: '/countries' })).rejects.toMatchObject({
      kind: 'protocol',
    });
  });

  it('raises a structured error for a non-JSON error body', async () => {
    const mock = createMockFetch([{ status: 404, text: 'Cannot POST /api/v1/verify-emails', contentType: 'text/html' }]);
    const error = await expectError(client(mock.fetch).request({ method: 'POST', path: '/verify-emails', retryable: false }));
    expect(error).toBeInstanceOf(SmartleadApiError);
    expect(error.kind).toBe('not_found');
    expect(error.status).toBe(404);
    expect(JSON.stringify(error.toJSON())).toContain('Cannot POST');
  });

  it('treats HTTP 200 with success:false as a failure', async () => {
    const mock = createMockFetch([{ json: { success: false, message: 'Filter not found' } }]);
    const error = await expectError(client(mock.fetch).request({ method: 'POST', path: '/fetch-contacts', retryable: false }));
    expect(error.kind).toBe('api_failure');
    expect(error.status).toBe(200);
    expect(error.message).toContain('Filter not found');
  });

  it('classifies a credit-related success:false body as a payment error', async () => {
    const mock = createMockFetch([
      { json: { success: false, message: 'Insufficient credits to fetch these contacts' } },
    ]);
    const error = await expectError(client(mock.fetch).request({ method: 'POST', path: '/fetch-contacts', retryable: false }));
    expect(error.kind).toBe('payment');
  });

  it.each([
    [401, 'authentication'],
    [402, 'payment'],
    [403, 'permission'],
    [404, 'not_found'],
    [409, 'conflict'],
    [422, 'validation'],
    [429, 'rate_limit'],
    [500, 'server'],
  ])('maps HTTP %i to the %s error kind', async (status, kind) => {
    const mock = createMockFetch([{ status, json: { message: 'nope' } }]);
    const error = await expectError(client(mock.fetch, { maxRetries: 0 }).request({ method: 'GET', path: '/countries' }));
    expect(error.kind).toBe(kind);
  });

  it('reads the nested error.message shape documented in the error-handling guide', async () => {
    const mock = createMockFetch([
      { status: 422, json: { error: { code: 'VALIDATION_ERROR', message: 'limit is required' } } },
    ]);
    const error = await expectError(client(mock.fetch).request({ method: 'GET', path: '/countries' }));
    expect(error.message).toContain('limit is required');
  });

  it('never leaks the api key through a thrown error', async () => {
    const mock = createMockFetch([{ status: 401, json: { message: `bad key ${TEST_API_KEY}` } }]);
    const error = await expectError(client(mock.fetch).request({ method: 'GET', path: '/countries' }));
    const serialized = `${error.message}${error.url}${JSON.stringify(error.toJSON())}`;
    expect(serialized).not.toContain(TEST_API_KEY);
  });
});

describe('timeouts and transport failures', () => {
  it('aborts and reports a timeout error', async () => {
    const mock = createMockFetch([{ hang: true }]);
    const error = await expectError(client(mock.fetch, { timeoutMs: 20, maxRetries: 0 }).request({ method: 'GET', path: '/countries' }));
    expect(error.kind).toBe('timeout');
    expect(error.message).toContain('timed out after 20ms');
  });

  it('still times out when the headers arrive but the body stalls', async () => {
    // A response whose body never settles must not resolve as an empty success.
    const stalledBody = {
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () =>
        new Promise<string>((_resolve, reject) => {
          setTimeout(() => {
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          }, 30);
        }),
      ok: true,
    } as unknown as Response;
    const stallingFetch = (async () => stalledBody) as unknown as typeof fetch;

    const error = await expectError(
      client(stallingFetch, { timeoutMs: 10, maxRetries: 0 }).request({ method: 'GET', path: '/countries' }),
    );
    expect(error.kind).toBe('timeout');
    expect(error.message).toContain('reading the response body');
  });

  it('reports a transport error when fetch throws', async () => {
    const mock = createMockFetch([{ throws: new TypeError('fetch failed') }]);
    const error = await expectError(client(mock.fetch, { maxRetries: 0 }).request({ method: 'GET', path: '/countries' }));
    expect(error.kind).toBe('transport');
  });
});

describe('retry policy', () => {
  it('retries a GET on a transient failure and succeeds', async () => {
    const mock = createMockFetch([
      { status: 503, json: { message: 'unavailable' } },
      { json: { success: true, data: ['ok'] } },
    ]);
    const result = await client(mock.fetch).request({ method: 'GET', path: '/countries' });
    expect(mock.calls).toHaveLength(2);
    expect(result.data).toEqual({ success: true, data: ['ok'] });
  });

  it('stops after maxRetries extra attempts', async () => {
    const mock = createMockFetch([{ status: 500, json: { message: 'boom' } }]);
    await expect(client(mock.fetch).request({ method: 'GET', path: '/countries' })).rejects.toMatchObject({
      kind: 'server',
    });
    expect(mock.calls).toHaveLength(3); // 1 initial + maxRetries(2)
  });

  it('does not retry non-transient failures', async () => {
    const mock = createMockFetch([{ status: 422, json: { message: 'bad input' } }]);
    await expect(client(mock.fetch).request({ method: 'GET', path: '/countries' })).rejects.toMatchObject({
      kind: 'validation',
    });
    expect(mock.calls).toHaveLength(1);
  });

  it('does not retry non-GET requests by default', async () => {
    const mock = createMockFetch([{ status: 500, json: { message: 'boom' } }]);
    await expect(
      client(mock.fetch).request({ method: 'POST', path: '/search-contacts', body: { limit: 1 } }),
    ).rejects.toMatchObject({ kind: 'server' });
    expect(mock.calls).toHaveLength(1);
  });

  it('honours maxRetries: 0', async () => {
    const mock = createMockFetch([{ status: 500, json: { message: 'boom' } }]);
    await expect(
      client(mock.fetch, { maxRetries: 0 }).request({ method: 'GET', path: '/countries' }),
    ).rejects.toBeInstanceOf(SmartleadApiError);
    expect(mock.calls).toHaveLength(1);
  });
});

describe('credit-consuming requests are never auto-retried', () => {
  it('issues exactly one find-emails request even on a 500', async () => {
    const mock = createMockFetch([{ status: 500, json: { message: 'boom' } }]);
    const prospect = new ProspectClient(testConfig(), mock.fetch, noSleep);
    await expect(prospect.findEmails({ contacts: [] })).rejects.toBeInstanceOf(SmartleadApiError);
    expect(mock.calls).toHaveLength(1);
  });

  it('issues exactly one fetch-contacts request even on a 429', async () => {
    const mock = createMockFetch([{ status: 429, json: { message: 'slow down' }, headers: { 'retry-after': '1' } }]);
    const prospect = new ProspectClient(testConfig(), mock.fetch, noSleep);
    await expect(prospect.fetchContacts({ filter_id: 1, limit: 1 })).rejects.toBeInstanceOf(SmartleadApiError);
    expect(mock.calls).toHaveLength(1);
  });

  it('issues exactly one lead import request even on a 503', async () => {
    const mock = createMockFetch([{ status: 503, json: { message: 'unavailable' } }]);
    const core = new CoreClient(testConfig(), mock.fetch, noSleep);
    await expect(core.addLeadsToCampaign(1, { lead_list: [] })).rejects.toBeInstanceOf(SmartleadApiError);
    expect(mock.calls).toHaveLength(1);
  });
});
