import { z } from 'zod';

export const DEFAULT_CORE_BASE_URL = 'https://server.smartlead.ai/api/v1';
export const DEFAULT_PROSPECT_BASE_URL = 'https://prospect-api.smartlead.ai/api/v1/search-email-leads';
export const DEFAULT_DELIVERY_BASE_URL = 'https://smartdelivery.smartlead.ai/api/v1';
export const DEFAULT_SENDERS_BASE_URL = 'https://smart-senders.smartlead.ai/api/v1';
export const DEFAULT_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_RETRIES = 2;

export const SERVER_NAME = 'smartleadai-mcp';

export type ServerMode = 'readonly' | 'standard' | 'unrestricted';

export interface SmartleadConfig {
  apiKey: string;
  coreBaseUrl: string;
  prospectBaseUrl: string;
  deliveryBaseUrl: string;
  sendersBaseUrl: string;
  mode: ServerMode;
  allowCreditSpend: boolean;
  allowSend: boolean;
  allowDestructive: boolean;
  timeoutMs: number;
  maxRetries: number;
}

const booleanFlag = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => v === 'true' || v === 'false', {
    message: 'must be exactly "true" or "false"',
  })
  .transform((v) => v === 'true');

const httpUrl = z
  .string()
  .trim()
  .min(1)
  .refine(
    (v) => {
      try {
        const parsed = new URL(v);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'must be a valid http(s) URL' },
  )
  // Trailing slashes would produce `//` when joined with a path.
  .transform((v) => v.replace(/\/+$/, ''));

const intInRange = (min: number, max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, 'must be a non-negative integer')
    .transform(Number)
    .refine((n) => n >= min && n <= max, { message: `must be between ${min} and ${max}` });

const envSchema = z.object({
  SMARTLEAD_API_KEY: z
    .string({ error: 'SMARTLEAD_API_KEY is required but was not set in the environment' })
    .trim()
    .min(1, 'SMARTLEAD_API_KEY is required but was not set in the environment'),
  SMARTLEAD_CORE_BASE_URL: httpUrl.default(DEFAULT_CORE_BASE_URL),
  SMARTLEAD_PROSPECT_BASE_URL: httpUrl.default(DEFAULT_PROSPECT_BASE_URL),
  SMARTLEAD_DELIVERY_BASE_URL: httpUrl.default(DEFAULT_DELIVERY_BASE_URL),
  SMARTLEAD_SENDERS_BASE_URL: httpUrl.default(DEFAULT_SENDERS_BASE_URL),
  SMARTLEAD_MCP_MODE: z.enum(['readonly', 'standard', 'unrestricted']).default('readonly'),
  SMARTLEAD_MCP_ALLOW_CREDIT_SPEND: booleanFlag.default(false),
  SMARTLEAD_MCP_ALLOW_SEND: booleanFlag.default(false),
  SMARTLEAD_MCP_ALLOW_DESTRUCTIVE: booleanFlag.default(false),
  SMARTLEAD_MCP_TIMEOUT_MS: intInRange(1_000, 600_000).default(DEFAULT_TIMEOUT_MS),
  SMARTLEAD_MCP_MAX_RETRIES: intInRange(0, 5).default(DEFAULT_MAX_RETRIES),
});

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * Build the runtime config from environment variables.
 *
 * Empty-string values are treated as "unset" so that a Claude Desktop config
 * with `"SMARTLEAD_MCP_MODE": ""` falls back to the safe default instead of
 * failing the enum check.
 *
 * The API key is never echoed back in an error message.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): SmartleadConfig {
  const candidate: Record<string, string> = {};
  for (const key of Object.keys(envSchema.shape)) {
    const raw = env[key];
    if (typeof raw === 'string' && raw.trim() !== '') candidate[key] = raw;
  }

  const parsed = envSchema.safeParse(candidate);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new ConfigError(`Invalid Smartlead MCP configuration — ${issues}`);
  }

  const value = parsed.data;
  return {
    apiKey: value.SMARTLEAD_API_KEY,
    coreBaseUrl: value.SMARTLEAD_CORE_BASE_URL,
    prospectBaseUrl: value.SMARTLEAD_PROSPECT_BASE_URL,
    deliveryBaseUrl: value.SMARTLEAD_DELIVERY_BASE_URL,
    sendersBaseUrl: value.SMARTLEAD_SENDERS_BASE_URL,
    mode: value.SMARTLEAD_MCP_MODE,
    allowCreditSpend: value.SMARTLEAD_MCP_ALLOW_CREDIT_SPEND,
    allowSend: value.SMARTLEAD_MCP_ALLOW_SEND,
    allowDestructive: value.SMARTLEAD_MCP_ALLOW_DESTRUCTIVE,
    timeoutMs: value.SMARTLEAD_MCP_TIMEOUT_MS,
    maxRetries: value.SMARTLEAD_MCP_MAX_RETRIES,
  };
}

/** Config summary that is safe to expose (contains no credential material). */
export function describeConfig(config: SmartleadConfig): Record<string, unknown> {
  return {
    mode: config.mode,
    core_base_url: config.coreBaseUrl,
    prospect_base_url: config.prospectBaseUrl,
    delivery_base_url: config.deliveryBaseUrl,
    senders_base_url: config.sendersBaseUrl,
    allow_credit_spend: config.allowCreditSpend,
    allow_send: config.allowSend,
    allow_destructive: config.allowDestructive,
    timeout_ms: config.timeoutMs,
    max_retries: config.maxRetries,
    api_key_configured: config.apiKey.length > 0,
  };
}
