import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { evaluatePolicy } from '../security/policy.js';
import { smartProspectTools } from './smart-prospect/index.js';
import { coreTools } from './core/index.js';
import {
  buildDescription,
  envelopeOutputSchema,
  errorEnvelope,
  policyEnvelope,
  successEnvelope,
  type ToolEnvelope,
} from './envelope.js';
import type { AnyToolDefinition, ToolContext } from './types.js';

/** Every tool this server exposes, SmartProspect first. */
export const allTools: AnyToolDefinition[] = [...smartProspectTools, ...coreTools];

export function findTool(name: string): AnyToolDefinition | undefined {
  return allTools.find((tool) => tool.name === name);
}

/**
 * Run a tool end-to-end: policy check, handler, envelope.
 *
 * Exported separately from MCP registration so the safety behaviour can be
 * tested without standing up a transport.
 *
 * Arguments are expected to have already been validated against the tool's
 * input schema (the MCP SDK does this before invoking the callback).
 */
export async function executeTool(
  definition: AnyToolDefinition,
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<ToolEnvelope> {
  const capability = definition.resolveCapability
    ? definition.resolveCapability(args)
    : definition.capability;

  const decision = evaluatePolicy(capability, ctx.config, args);
  if (!decision.allowed) return policyEnvelope(definition.name, decision);

  const meta = {
    operation: definition.name,
    creditSpending: capability.creditSpending,
    remoteMutation: capability.remoteMutation,
  };
  const secrets = [ctx.config.apiKey];

  try {
    const payload = await definition.handler(args, ctx);
    return successEnvelope(meta, payload, secrets);
  } catch (error) {
    return errorEnvelope(meta, error, secrets);
  }
}

/** Wrap an envelope in the MCP tool result shape. */
export function toCallToolResult(envelope: ToolEnvelope): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(envelope, null, 2) }],
    structuredContent: envelope as unknown as Record<string, unknown>,
    isError: !envelope.ok,
  };
}

/** Register every tool on an McpServer instance. */
export function registerTools(server: McpServer, ctx: ToolContext): void {
  for (const definition of allTools) {
    server.registerTool(
      definition.name,
      {
        title: definition.title,
        description: buildDescription(definition),
        inputSchema: definition.inputSchema,
        outputSchema: envelopeOutputSchema,
        annotations: {
          title: definition.title,
          readOnlyHint: definition.capability.readOnly,
          destructiveHint: definition.capability.destructive,
          // No Smartlead endpoint here documents idempotency guarantees.
          idempotentHint: false,
          openWorldHint: true,
        },
      },
      async (args: Record<string, unknown>) => toCallToolResult(await executeTool(definition, args ?? {}, ctx)),
    );
  }
}
