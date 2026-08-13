import type { SmartleadConfig } from '../../src/config.js';

/**
 * Test fixtures.
 *
 * The API key used throughout the suite is obviously synthetic and is asserted
 * against in the redaction tests. Every email address in test data uses
 * example.com / example.org so no real personal data can enter the repository.
 */
export const TEST_API_KEY = 'test-smartlead-api-key-0000000000';

export function testConfig(overrides: Partial<SmartleadConfig> = {}): SmartleadConfig {
  return {
    apiKey: TEST_API_KEY,
    coreBaseUrl: 'https://server.smartlead.ai/api/v1',
    prospectBaseUrl: 'https://prospect-api.smartlead.ai/api/v1/search-email-leads',
    deliveryBaseUrl: 'https://smartdelivery.smartlead.ai/api/v1',
    sendersBaseUrl: 'https://smart-senders.smartlead.ai/api/v1',
    mode: 'readonly',
    allowCreditSpend: false,
    allowSend: false,
    allowDestructive: false,
    timeoutMs: 5_000,
    maxRetries: 2,
    ...overrides,
  };
}

export interface RecordedCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export interface MockReply {
  status?: number;
  json?: unknown;
  text?: string;
  contentType?: string;
  headers?: Record<string, string>;
  /** Throw instead of replying, to simulate a transport failure. */
  throws?: Error;
  /** Never settle, so the AbortController timeout fires. */
  hang?: boolean;
}

export interface MockFetch {
  fetch: typeof fetch;
  calls: RecordedCall[];
  /** Convenience accessor for the most recent call. */
  last(): RecordedCall;
}

/**
 * Build a fetch stub. Replies are consumed in order; the final reply repeats
 * once the queue is exhausted so retry tests can assert steady-state behaviour.
 */
export function createMockFetch(replies: MockReply[]): MockFetch {
  const calls: RecordedCall[] = [];
  let index = 0;

  const impl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const headers: Record<string, string> = {};
    if (init?.headers) {
      for (const [key, value] of Object.entries(init.headers as Record<string, string>)) {
        headers[key.toLowerCase()] = value;
      }
    }
    let body: unknown;
    if (typeof init?.body === 'string') {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = init.body;
      }
    }
    calls.push({ url, method: init?.method ?? 'GET', headers, body });

    const reply = replies[Math.min(index, replies.length - 1)] ?? {};
    index += 1;

    if (reply.throws) throw reply.throws;
    if (reply.hang) {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        signal?.addEventListener('abort', () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });
    }

    const responseHeaders = new Headers({
      'content-type': reply.contentType ?? 'application/json',
      ...(reply.headers ?? {}),
    });
    const payload = reply.text ?? JSON.stringify(reply.json ?? {});
    return new Response(payload, { status: reply.status ?? 200, headers: responseHeaders });
  }) as unknown as typeof fetch;

  return {
    fetch: impl,
    calls,
    last() {
      const call = calls[calls.length - 1];
      if (!call) throw new Error('no fetch calls were recorded');
      return call;
    },
  };
}

/** Backoff stub so retry tests do not wait on real timers. */
export const noSleep = async (): Promise<void> => {};

/** Parse a recorded URL into path + query for assertions. */
export function parseCall(call: RecordedCall): { origin: string; pathname: string; query: Record<string, string> } {
  const url = new URL(call.url);
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return { origin: url.origin, pathname: url.pathname, query };
}
