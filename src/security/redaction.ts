/**
 * Secret redaction helpers.
 *
 * The Smartlead API authenticates with an `api_key` *query parameter*, which
 * means the credential ends up inside every request URL. Any URL that escapes
 * this process — in an error message, a tool result, a log line — would leak it.
 * Everything that formats a URL or an error for the outside world must route
 * through here first.
 */

export const REDACTED = '[REDACTED]';

/** Query parameter names whose values must never be surfaced. */
const SECRET_QUERY_PARAMS = ['api_key', 'apikey', 'apiKey', 'token', 'access_token'];

/**
 * Replace the value of every secret-bearing query parameter in a URL-ish string.
 * Works on full URLs, on bare query strings, and on text that merely embeds one.
 */
export function redactUrl(input: string): string {
  const names = SECRET_QUERY_PARAMS.join('|');
  // Matches `api_key=<value>` up to the next `&`, `#`, whitespace, quote or backtick.
  const pattern = new RegExp(`\\b(${names})=([^&#\\s"'\`]*)`, 'gi');
  return input.replace(pattern, (_match, name: string) => `${name}=${REDACTED}`);
}

/**
 * Redact a URL and additionally scrub any literal occurrence of the known
 * secret value, which may have been interpolated somewhere other than a query
 * string (a header dump, a nested error message from the upstream service).
 */
export function redactSecrets(input: string, secrets: readonly string[] = []): string {
  let out = redactUrl(input);
  for (const secret of secrets) {
    // Ignore trivially short values: replacing them would mangle unrelated text.
    if (typeof secret !== 'string' || secret.length < 8) continue;
    out = out.split(secret).join(REDACTED);
  }
  return out;
}

/**
 * Deep-redact an arbitrary value before it is embedded in a tool result.
 * Object keys that look like credentials are dropped entirely rather than
 * partially masked.
 */
const SECRET_KEY_PATTERN = /^(api[_-]?key|apikey|authorization|token|access[_-]?token|secret|password)$/i;

export function redactValue<T>(value: T, secrets: readonly string[] = []): T {
  return redactValueInner(value, secrets, 0) as T;
}

function redactValueInner(value: unknown, secrets: readonly string[], depth: number): unknown {
  if (depth > 12) return value;
  if (typeof value === 'string') return redactSecrets(value, secrets);
  if (Array.isArray(value)) return value.map((v) => redactValueInner(v, secrets, depth + 1));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SECRET_KEY_PATTERN.test(key) ? REDACTED : redactValueInner(v, secrets, depth + 1);
    }
    return out;
  }
  return value;
}

/**
 * Summarise a request body for diagnostics without echoing personal data.
 * Returns field names and array lengths only — never values.
 */
export function summarizeBody(body: unknown): Record<string, string> | undefined {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined;
  const summary: Record<string, string> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (Array.isArray(value)) summary[key] = `array(${value.length})`;
    else if (value === null) summary[key] = 'null';
    else if (typeof value === 'object') summary[key] = 'object';
    else summary[key] = typeof value;
  }
  return summary;
}
