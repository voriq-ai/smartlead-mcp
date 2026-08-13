import { z } from 'zod';
import { toSmartleadError, type SmartleadApiError } from '../client/errors.js';
import { redactValue } from '../security/redaction.js';
import type { PolicyDenial } from '../security/policy.js';
import { ToolRefusal, type ToolDefinition, type ToolPayload } from './types.js';
import { DEFAULT_CORE_BASE_URL, DEFAULT_PROSPECT_BASE_URL } from '../config.js';

/**
 * Normalised result envelope returned by every tool.
 *
 * Agents can rely on the top-level shape being identical for successes,
 * refusals and upstream failures, so they never have to parse prose.
 */
export interface ToolEnvelope {
  ok: boolean;
  operation: string;
  credit_spending: boolean;
  remote_mutation: boolean;
  data: unknown;
  pagination: unknown;
  warnings: string[];
  error?: {
    kind: string;
    code?: string;
    message: string;
    status?: number;
    requirements?: string[];
    details?: unknown;
  };
}

/** Output schema advertised to MCP clients. Kept permissive on `data`. */
export const envelopeOutputSchema = z.object({
  ok: z.boolean(),
  operation: z.string(),
  credit_spending: z.boolean(),
  remote_mutation: z.boolean(),
  data: z.unknown(),
  pagination: z.unknown(),
  warnings: z.array(z.string()),
  error: z
    .object({
      kind: z.string(),
      code: z.string().optional(),
      message: z.string(),
      status: z.number().optional(),
      requirements: z.array(z.string()).optional(),
      details: z.unknown().optional(),
    })
    .optional(),
});

interface EnvelopeMeta {
  operation: string;
  creditSpending: boolean;
  remoteMutation: boolean;
}

export function successEnvelope(meta: EnvelopeMeta, payload: ToolPayload, secrets: readonly string[]): ToolEnvelope {
  return {
    ok: true,
    operation: meta.operation,
    credit_spending: meta.creditSpending,
    remote_mutation: meta.remoteMutation,
    data: redactValue(payload.data ?? null, secrets),
    pagination: redactValue(payload.pagination ?? null, secrets),
    warnings: payload.warnings ?? [],
  };
}

/**
 * A policy denial. `credit_spending` and `remote_mutation` report false because
 * nothing happened — the request was never sent.
 */
export function policyEnvelope(operation: string, denial: PolicyDenial): ToolEnvelope {
  return {
    ok: false,
    operation,
    credit_spending: false,
    remote_mutation: false,
    data: null,
    pagination: null,
    warnings: [],
    error: {
      kind: 'policy',
      code: denial.code,
      message: denial.reason,
      requirements: denial.requirements,
    },
  };
}

export function refusalEnvelope(operation: string, refusal: ToolRefusal): ToolEnvelope {
  return {
    ok: false,
    operation,
    credit_spending: false,
    remote_mutation: false,
    data: null,
    pagination: null,
    warnings: [],
    error: {
      kind: 'refusal',
      code: refusal.code,
      message: refusal.message,
      requirements: refusal.requirements,
    },
  };
}

export function errorEnvelope(
  meta: EnvelopeMeta,
  error: unknown,
  secrets: readonly string[],
): ToolEnvelope {
  if (error instanceof ToolRefusal) return refusalEnvelope(meta.operation, error);

  const apiError: SmartleadApiError = toSmartleadError(error, secrets);
  const json = apiError.toJSON();
  return {
    ok: false,
    operation: meta.operation,
    credit_spending: meta.creditSpending,
    // An error means we cannot prove the mutation landed; report the intent, not
    // a guess about the outcome.
    remote_mutation: meta.remoteMutation,
    data: null,
    pagination: null,
    warnings: [],
    error: {
      kind: apiError.kind,
      message: apiError.message,
      ...(apiError.status !== undefined ? { status: apiError.status } : {}),
      details: json.details ?? { url: json.url, method: json.method },
    },
  };
}

const HOST_BASE_URL: Record<'core' | 'prospect', string> = {
  core: DEFAULT_CORE_BASE_URL,
  prospect: DEFAULT_PROSPECT_BASE_URL,
};

/**
 * Generate the tool description shown to agents.
 *
 * Every tool gets the same explicit safety sentence so a model never has to
 * infer whether a call costs money or changes remote state.
 */
export function buildDescription(definition: ToolDefinition): string {
  const cap = definition.capability;
  const lines: string[] = [definition.summary];

  const flags = [
    `read-only: ${yn(cap.readOnly)}`,
    `may consume SmartProspect credits: ${yn(cap.creditSpending)}`,
    `creates or modifies remote state: ${yn(cap.remoteMutation)}`,
    `can send email: ${yn(cap.sending)}`,
    `destructive: ${yn(cap.destructive)}`,
  ];
  lines.push(`Safety — ${flags.join('; ')}.`);
  lines.push(
    `Endpoint: ${definition.endpoint.method} ${HOST_BASE_URL[definition.endpoint.host]}${definition.endpoint.route}.`,
  );
  if (definition.notes?.length) lines.push(...definition.notes);
  return lines.join('\n');
}

function yn(value: boolean): string {
  return value ? 'yes' : 'no';
}
