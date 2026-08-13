import type { SmartleadConfig, ServerMode } from '../config.js';

/**
 * What a tool actually does to the outside world.
 *
 * Every tool declares this honestly; the policy layer is the single place that
 * decides whether the declaration is permitted under the current configuration.
 */
export interface Capability {
  /** True only if the operation neither mutates remote state nor spends credits. */
  readOnly: boolean;
  /** May consume SmartProspect credits. */
  creditSpending: boolean;
  /** Creates or modifies state on the Smartlead side. */
  remoteMutation: boolean;
  /** Can cause email to be sent, or activates a campaign that will send. */
  sending: boolean;
  /** Irreversible: deletion, permanent unsubscribe, mailbox teardown. */
  destructive: boolean;
  /** Imports leads into a campaign (requires its own confirmation). */
  leadImport: boolean;
}

export const READ_ONLY: Capability = {
  readOnly: true,
  creditSpending: false,
  remoteMutation: false,
  sending: false,
  destructive: false,
  leadImport: false,
};

export function capability(overrides: Partial<Capability>): Capability {
  const merged = { ...READ_ONLY, ...overrides };
  // readOnly is derived, never asserted independently, so a tool cannot claim to
  // be read-only while also declaring a side effect.
  merged.readOnly =
    !merged.creditSpending &&
    !merged.remoteMutation &&
    !merged.sending &&
    !merged.destructive &&
    !merged.leadImport;
  return merged;
}

export type PolicyDenialCode =
  | 'mode_readonly'
  | 'mode_standard'
  | 'credit_spend_disabled'
  | 'credit_spend_unconfirmed'
  | 'send_disabled'
  | 'send_unconfirmed'
  | 'destructive_disabled'
  | 'destructive_unconfirmed'
  | 'import_unconfirmed';

export interface PolicyDenial {
  allowed: false;
  code: PolicyDenialCode;
  reason: string;
  /** Concrete steps the operator must take to allow this call. */
  requirements: string[];
}

export type PolicyDecision = { allowed: true } | PolicyDenial;

const ALLOWED: PolicyDecision = { allowed: true };

function deny(code: PolicyDenialCode, reason: string, requirements: string[]): PolicyDenial {
  return { allowed: false, code, reason, requirements };
}

/** Explicit boolean `true` only — a truthy string or 1 is not consent. */
function confirmed(args: Record<string, unknown>, field: string): boolean {
  return args[field] === true;
}

function modeGate(cap: Capability, mode: ServerMode): PolicyDecision {
  if (mode === 'readonly' && !cap.readOnly) {
    return deny(
      'mode_readonly',
      'Server is running in readonly mode, which permits read-only operations only.',
      ['Set SMARTLEAD_MCP_MODE=standard (or unrestricted) and restart the MCP server.'],
    );
  }
  if (mode === 'standard' && (cap.sending || cap.destructive)) {
    return deny(
      'mode_standard',
      'Sending and destructive operations are blocked in standard mode.',
      ['Set SMARTLEAD_MCP_MODE=unrestricted and restart the MCP server.'],
    );
  }
  return ALLOWED;
}

/**
 * Decide whether a call may proceed.
 *
 * Returns a denial *before* any HTTP request is attempted, so a blocked
 * credit-spending call never reaches Smartlead and never costs anything.
 */
export function evaluatePolicy(
  cap: Capability,
  config: SmartleadConfig,
  args: Record<string, unknown> = {},
): PolicyDecision {
  const mode = modeGate(cap, config.mode);
  if (!mode.allowed) return mode;

  if (cap.creditSpending) {
    if (!config.allowCreditSpend) {
      return deny(
        'credit_spend_disabled',
        'This operation can consume SmartProspect credits and credit spending is disabled.',
        ['Set SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true and restart the MCP server.'],
      );
    }
    if (!confirmed(args, 'confirm_credit_spend')) {
      return deny(
        'credit_spend_unconfirmed',
        'This operation can consume SmartProspect credits and was not explicitly confirmed.',
        ['Call again with confirm_credit_spend: true.'],
      );
    }
  }

  if (cap.sending) {
    if (!config.allowSend) {
      return deny('send_disabled', 'This operation can cause email to be sent and sending is disabled.', [
        'Set SMARTLEAD_MCP_ALLOW_SEND=true and restart the MCP server.',
      ]);
    }
    if (!confirmed(args, 'confirm_send')) {
      return deny(
        'send_unconfirmed',
        'This operation can cause email to be sent and was not explicitly confirmed.',
        ['Call again with confirm_send: true.'],
      );
    }
  }

  if (cap.destructive) {
    if (!config.allowDestructive) {
      return deny(
        'destructive_disabled',
        'This operation is destructive and destructive operations are disabled.',
        ['Set SMARTLEAD_MCP_ALLOW_DESTRUCTIVE=true and restart the MCP server.'],
      );
    }
    if (!confirmed(args, 'confirm_destructive')) {
      return deny(
        'destructive_unconfirmed',
        'This operation is destructive and was not explicitly confirmed.',
        ['Call again with confirm_destructive: true.'],
      );
    }
  }

  if (cap.leadImport && !confirmed(args, 'confirm_import')) {
    return deny('import_unconfirmed', 'Lead import was not explicitly confirmed.', [
      'Call again with confirm_import: true.',
    ]);
  }

  return ALLOWED;
}
