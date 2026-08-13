import { SmartleadApiError, isTransientKind, kindFromStatus } from './errors.js';
import { redactSecrets } from '../security/redaction.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryValue = string | number | boolean | undefined | null;

export interface HttpClientOptions {
  /** Base URL without a trailing slash, e.g. `https://server.smartlead.ai/api/v1`. */
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  /** Maximum extra attempts for retryable requests (0 disables retries). */
  maxRetries: number;
  /** Human label used in error messages: `core` or `prospect`. */
  host: string;
  fetchImpl?: typeof fetch;
  /** Injectable for tests so backoff does not slow the suite down. */
  sleep?: (ms: number) => Promise<void>;
}

export interface RequestOptions {
  method: HttpMethod;
  /** Path relative to the base URL, always starting with `/`. */
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  /**
   * Whether this request may be retried on a transient failure.
   *
   * Defaults to `true` for GET only. Every non-GET call must opt in explicitly,
   * and credit-consuming or state-mutating calls must never do so.
   */
  retryable?: boolean;
  timeoutMs?: number;
}

export interface HttpResult<T = unknown> {
  status: number;
  data: T;
  /** Small allowlist of response headers that are useful and non-sensitive. */
  headers: Record<string, string>;
}

const EXPOSED_HEADERS = [
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'retry-after',
  'content-type',
];

const BASE_BACKOFF_MS = 250;
const MAX_BACKOFF_MS = 8_000;

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Minimal HTTP client for the two Smartlead hosts.
 *
 * Responsibilities that must not move elsewhere: api_key injection, timeouts,
 * safe body parsing, `success: false` detection, retry gating, and redaction of
 * the credential from every value that leaves this class.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly host: string;
  private readonly fetchImpl: typeof fetch;
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs;
    this.maxRetries = options.maxRetries;
    this.host = options.host;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.sleep = options.sleep ?? defaultSleep;
  }

  /** The secrets that must be scrubbed from anything this client produces. */
  private get secrets(): string[] {
    return [this.apiKey];
  }

  /**
   * Build the request URL. `api_key` is appended last and is the only place the
   * credential is ever written.
   */
  buildUrl(path: string, query?: Record<string, QueryValue>): URL {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue;
        url.searchParams.set(key, String(value));
      }
    }
    url.searchParams.set('api_key', this.apiKey);
    return url;
  }

  /** URL with the credential masked — the only form safe to surface. */
  redactedUrl(path: string, query?: Record<string, QueryValue>): string {
    return redactSecrets(this.buildUrl(path, query).toString(), this.secrets);
  }

  async request<T = unknown>(options: RequestOptions): Promise<HttpResult<T>> {
    const retryable = options.retryable ?? options.method === 'GET';
    const attempts = retryable ? this.maxRetries + 1 : 1;

    let lastError: SmartleadApiError | undefined;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        return await this.attempt<T>(options);
      } catch (error) {
        const apiError =
          error instanceof SmartleadApiError
            ? error
            : new SmartleadApiError(
                { kind: 'unknown', message: String(error), cause: error },
                this.secrets,
              );
        lastError = apiError;

        const canRetry = retryable && attempt < attempts - 1 && isTransientKind(apiError.kind);
        if (!canRetry) throw apiError;

        await this.sleep(backoffMs(attempt, apiError.retryAfterSeconds));
      }
    }
    /* c8 ignore next 2 -- unreachable: the loop always returns or throws. */
    throw lastError;
  }

  private async attempt<T>(options: RequestOptions): Promise<HttpResult<T>> {
    const url = this.buildUrl(options.path, options.query);
    const safeUrl = redactSecrets(url.toString(), this.secrets);
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = { accept: 'application/json' };
    let requestBody: string | undefined;
    if (options.body !== undefined) {
      headers['content-type'] = 'application/json';
      requestBody = JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: options.method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });
    } catch (error) {
      const aborted = controller.signal.aborted || (error as Error | undefined)?.name === 'AbortError';
      throw new SmartleadApiError(
        {
          kind: aborted ? 'timeout' : 'transport',
          message: aborted
            ? `Smartlead ${this.host} request timed out after ${timeoutMs}ms`
            : `Smartlead ${this.host} request failed before a response was received: ${
                error instanceof Error ? error.message : String(error)
              }`,
          method: options.method,
          url: safeUrl,
          retryable: true,
        },
        this.secrets,
      );
    } finally {
      clearTimeout(timer);
    }

    const headersOut = pickHeaders(response.headers);
    const rawText = await safeReadText(response);
    const parsed = safeParseJson(rawText);

    if (!response.ok) {
      throw this.buildHttpError(response.status, headersOut, parsed, rawText, options, safeUrl);
    }

    if (parsed.kind === 'invalid') {
      throw new SmartleadApiError(
        {
          kind: 'protocol',
          message: `Smartlead ${this.host} returned HTTP ${response.status} with a non-JSON body`,
          status: response.status,
          method: options.method,
          url: safeUrl,
          details: { content_type: headersOut['content-type'], body_preview: preview(rawText) },
        },
        this.secrets,
      );
    }

    // Smartlead frequently signals failure with HTTP 200 and `success: false`.
    const body = parsed.value;
    if (isRecord(body) && body.success === false) {
      const message = stringField(body, 'message') ?? stringField(body, 'error') ?? 'unspecified failure';
      throw new SmartleadApiError(
        {
          kind: looksLikeCreditFailure(message) ? 'payment' : 'api_failure',
          message: `Smartlead ${this.host} reported failure (HTTP 200, success=false): ${message}`,
          status: response.status,
          method: options.method,
          url: safeUrl,
          details: body,
        },
        this.secrets,
      );
    }

    return { status: response.status, data: body as T, headers: headersOut };
  }

  private buildHttpError(
    status: number,
    headers: Record<string, string>,
    parsed: ParseResult,
    rawText: string,
    options: RequestOptions,
    safeUrl: string,
  ): SmartleadApiError {
    const kind = kindFromStatus(status);
    const details =
      parsed.kind === 'json' ? parsed.value : { body_preview: preview(rawText), non_json: true };
    const upstreamMessage =
      parsed.kind === 'json' && isRecord(parsed.value)
        ? stringField(parsed.value, 'message') ??
          stringField(parsed.value, 'error') ??
          nestedErrorMessage(parsed.value)
        : undefined;

    const retryAfterHeader = headers['retry-after'];
    const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;

    return new SmartleadApiError(
      {
        kind,
        message: `Smartlead ${this.host} request failed with HTTP ${status}${
          upstreamMessage ? `: ${upstreamMessage}` : ''
        }`,
        status,
        method: options.method,
        url: safeUrl,
        details,
        retryable: isTransientKind(kind),
        retryAfterSeconds:
          retryAfterSeconds !== undefined && Number.isFinite(retryAfterSeconds)
            ? retryAfterSeconds
            : undefined,
      },
      this.secrets,
    );
  }
}

function backoffMs(attempt: number, retryAfterSeconds?: number): number {
  if (retryAfterSeconds !== undefined && Number.isFinite(retryAfterSeconds)) {
    return Math.min(Math.max(retryAfterSeconds, 0) * 1000, MAX_BACKOFF_MS);
  }
  return Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
}

function pickHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of EXPOSED_HEADERS) {
    const value = headers.get(name);
    if (value !== null) out[name] = value;
  }
  return out;
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

type ParseResult = { kind: 'json'; value: unknown } | { kind: 'invalid' };

function safeParseJson(text: string): ParseResult {
  const trimmed = text.trim();
  if (trimmed === '') return { kind: 'json', value: null };
  try {
    return { kind: 'json', value: JSON.parse(trimmed) };
  } catch {
    return { kind: 'invalid' };
  }
}

function preview(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringField(value: Record<string, unknown>, key: string): string | undefined {
  const raw = value[key];
  return typeof raw === 'string' && raw.trim() !== '' ? raw : undefined;
}

/** Smartlead's guides document a nested `{ error: { code, message } }` shape. */
function nestedErrorMessage(value: Record<string, unknown>): string | undefined {
  const nested = value.error;
  if (isRecord(nested)) return stringField(nested, 'message');
  return undefined;
}

const CREDIT_FAILURE_PATTERN = /credit|quota|insufficient|limit exceeded|upgrade your plan/i;

function looksLikeCreditFailure(message: string): boolean {
  return CREDIT_FAILURE_PATTERN.test(message);
}
