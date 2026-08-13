import type { HttpMethod } from '../client/http.js';
import type { SmartleadHost } from '../client/registry.js';

/** Where a parameter travels in the HTTP request. */
export type ParamLocation = 'path' | 'query' | 'body';

/** Coarse type taken from the documentation's `ParamField type="..."`. */
export type ParamType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface CatalogParam {
  name: string;
  in: ParamLocation;
  type: ParamType;
  required: boolean;
  description: string;
  /** Documented allowed values, when the description enumerates them. */
  enumValues?: string[];
  /** Documented inclusive bounds, when the description states a range. */
  min?: number;
  max?: number;
}

/**
 * Capability flags, mirrored from `security/policy.ts`.
 *
 * These are stored explicitly per endpoint rather than inferred at runtime so
 * that the safety classification of every endpoint is reviewable in a diff.
 * `readOnly` is derived by `capability()`, never trusted from this table.
 */
export interface CatalogCapability {
  creditSpending?: boolean;
  remoteMutation?: boolean;
  sending?: boolean;
  destructive?: boolean;
  leadImport?: boolean;
}

export interface CatalogEntry {
  /** MCP tool name. Must be unique across hand-written and catalog tools. */
  tool: string;
  title: string;
  summary: string;
  /** Source documentation page, recorded so every route is traceable. */
  docUrl: string;
  host: SmartleadHost;
  method: HttpMethod;
  /** Route relative to the host base URL, with `{placeholders}`. */
  route: string;
  capability: CatalogCapability;
  params: CatalogParam[];
  /** Extra agent-facing guidance appended to the generated description. */
  notes?: string[];
}
