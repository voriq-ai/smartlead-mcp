import { redactSecrets, redactValue } from '../security/redaction.js';

/**
 * Stable, machine-readable error categories. Agents branch on these, so they are
 * part of the public contract of every tool result.
 */
export type SmartleadErrorKind =
  | 'authentication' // 401 — key missing/invalid
  | 'permission' // 403 — key valid, resource forbidden
  | 'payment' // 402 or credit exhaustion reported by the API
  | 'validation' // 400 / 422 — request rejected
  | 'not_found' // 404
  | 'conflict' // 409
  | 'rate_limit' // 429
  | 'server' // 5xx
  | 'timeout' // AbortController fired
  | 'transport' // DNS/TLS/socket failure, no HTTP response
  | 'protocol' // HTTP 200 but body was not the documented shape
  | 'api_failure' // HTTP 200 with `success: false`
  | 'policy' // blocked locally by the safety policy, no request made
  | 'unknown';

export interface SmartleadErrorOptions {
  kind: SmartleadErrorKind;
  message: string;
  status?: number;
  /** Fully redacted request URL. Never construct this by hand. */
  url?: string;
  method?: string;
  /** Redacted upstream payload, when the upstream returned something useful. */
  details?: unknown;
  retryable?: boolean;
  retryAfterSeconds?: number;
  cause?: unknown;
}

/**
 * The only error type this package throws out of the client layer.
 *
 * Construction always runs the message and details through redaction so a
 * credential cannot leak even if a caller stringifies the error directly.
 */
export class SmartleadApiError extends Error {
  readonly kind: SmartleadErrorKind;
  readonly status: number | undefined;
  readonly url: string | undefined;
  readonly method: string | undefined;
  readonly details: unknown;
  readonly retryable: boolean;
  readonly retryAfterSeconds: number | undefined;

  constructor(options: SmartleadErrorOptions, secrets: readonly string[] = []) {
    super(redactSecrets(options.message, secrets));
    this.name = 'SmartleadApiError';
    this.kind = options.kind;
    this.status = options.status;
    this.url = options.url ? redactSecrets(options.url, secrets) : undefined;
    this.method = options.method;
    this.details = options.details === undefined ? undefined : redactValue(options.details, secrets);
    this.retryable = options.retryable ?? false;
    this.retryAfterSeconds = options.retryAfterSeconds;
    // `cause` is retained for local debugging but is deliberately never
    // serialised by toJSON(); upstream causes can contain raw request URLs.
    if (options.cause !== undefined) this.cause = options.cause;
  }

  /** Safe, stack-trace-free representation for MCP tool results. */
  toJSON(): Record<string, unknown> {
    const out: Record<string, unknown> = { kind: this.kind, message: this.message };
    if (this.status !== undefined) out.status = this.status;
    if (this.method) out.method = this.method;
    if (this.url) out.url = this.url;
    if (this.retryAfterSeconds !== undefined) out.retry_after_seconds = this.retryAfterSeconds;
    if (this.details !== undefined) out.details = this.details;
    return out;
  }
}

/** Map an HTTP status code to an error kind. */
export function kindFromStatus(status: number): SmartleadErrorKind {
  if (status === 401) return 'authentication';
  if (status === 402) return 'payment';
  if (status === 403) return 'permission';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 400 || status === 422) return 'validation';
  if (status === 429) return 'rate_limit';
  if (status >= 500) return 'server';
  return 'unknown';
}

/** Transient failures that a *safe, idempotent* request may retry. */
export function isTransientKind(kind: SmartleadErrorKind): boolean {
  return kind === 'rate_limit' || kind === 'server' || kind === 'timeout' || kind === 'transport';
}

/**
 * Normalise anything thrown inside a tool handler into a SmartleadApiError so
 * that stack traces never reach the MCP client.
 */
export function toSmartleadError(error: unknown, secrets: readonly string[] = []): SmartleadApiError {
  if (error instanceof SmartleadApiError) return error;
  const message = error instanceof Error ? error.message : String(error);
  return new SmartleadApiError({ kind: 'unknown', message, cause: error }, secrets);
}
