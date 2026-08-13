import type { z } from 'zod';
import type { CoreClient } from '../client/core-client.js';
import type { ProspectClient } from '../client/prospect-client.js';
import type { SmartleadConfig } from '../config.js';
import type { Capability } from '../security/policy.js';
import type { HttpMethod } from '../client/http.js';

export interface ToolContext {
  config: SmartleadConfig;
  core: CoreClient;
  prospect: ProspectClient;
}

/** Documented upstream endpoint a tool maps onto. Surfaced in docs and tests. */
export interface EndpointRef {
  host: 'core' | 'prospect';
  method: HttpMethod;
  /** Route relative to the host base URL, e.g. `/search-contacts`. */
  route: string;
}

export interface ToolPayload {
  data: unknown;
  pagination?: unknown;
  warnings?: string[];
}

/**
 * A refusal produced by a handler itself (as opposed to the policy layer),
 * for example a local limit check that would otherwise waste credits.
 */
export class ToolRefusal extends Error {
  readonly code: string;
  readonly requirements: string[];

  constructor(code: string, message: string, requirements: string[] = []) {
    super(message);
    this.name = 'ToolRefusal';
    this.code = code;
    this.requirements = requirements;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyZodObject = z.ZodObject<any>;

export interface ToolDefinition<S extends AnyZodObject = AnyZodObject> {
  name: string;
  title: string;
  /** One-sentence purpose. The full description is generated from this plus metadata. */
  summary: string;
  /** Optional extra guidance: documented limits, workflow ordering, gotchas. */
  notes?: string[];
  /**
   * Worst-case capability for this tool. Used for the generated description and
   * for the tool annotations advertised to MCP clients.
   */
  capability: Capability;
  /**
   * Narrow the capability for a specific call. Used where one endpoint has both
   * benign and high-impact modes (e.g. pausing vs. starting a campaign).
   * Enforcement uses this result; the description still states the worst case.
   */
  resolveCapability?: (args: z.infer<S>) => Capability;
  endpoint: EndpointRef;
  inputSchema: S;
  handler: (args: z.infer<S>, ctx: ToolContext) => Promise<ToolPayload>;
}

/**
 * A tool definition with its argument type erased, for storage in registries.
 * `any` is required here: `handler` is contravariant in its argument, so a
 * specific definition is not otherwise assignable to a general one.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyToolDefinition = ToolDefinition<any>;

/** Build a tool definition while preserving the inferred argument type. */
export function defineTool<S extends AnyZodObject>(definition: ToolDefinition<S>): ToolDefinition<S> {
  return definition;
}

/** Collect definitions into a registry list without per-file casts. */
export function toolList(...definitions: AnyToolDefinition[]): AnyToolDefinition[] {
  return definitions;
}
