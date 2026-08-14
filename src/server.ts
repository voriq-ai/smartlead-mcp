import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CoreClient } from './client/core-client.js';
import { ProspectClient } from './client/prospect-client.js';
import { ClientRegistry } from './client/registry.js';
import { SERVER_NAME, type SmartleadConfig } from './config.js';
import { registerTools } from './tools/register.js';
import type { ToolContext } from './tools/types.js';

export const SERVER_VERSION = '0.2.1';

export interface CreateServerOptions {
  /** Injected in tests; defaults to the global fetch. */
  fetchImpl?: typeof fetch;
  /** Injected in tests to make retry backoff instant. */
  sleep?: (ms: number) => Promise<void>;
}

export interface SmartleadMcpServer {
  server: McpServer;
  context: ToolContext;
}

/**
 * Build the MCP server and its tool context.
 *
 * Transport-agnostic on purpose: `src/index.ts` attaches a stdio transport, and
 * an HTTP/Streamable HTTP transport could attach to the same instance later
 * without touching the tool or client layers.
 */
export function createServer(config: SmartleadConfig, options: CreateServerOptions = {}): SmartleadMcpServer {
  const context: ToolContext = {
    config,
    core: new CoreClient(config, options.fetchImpl, options.sleep),
    prospect: new ProspectClient(config, options.fetchImpl, options.sleep),
    clients: new ClientRegistry(config, options.fetchImpl, options.sleep),
  };

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions: [
        'Unofficial Smartlead MCP server. Not affiliated with, endorsed by, or sponsored by Smartlead.ai.',
        `Running in ${config.mode} mode.`,
        'SmartProspect workflow: call smartprospect_get_search_analytics to check credits, then smartprospect_search_contacts to preview matches (free), then smartprospect_fetch_contacts or smartprospect_find_emails to reveal emails (consumes credits and requires explicit confirmation).',
        'Tools that consume credits, send email, or delete data are refused unless the corresponding environment flag is enabled and the per-call confirmation boolean is set to true.',
      ].join(' '),
    },
  );

  registerTools(server, context);
  return { server, context };
}

export { loadConfig, describeConfig, ConfigError } from './config.js';
export type { SmartleadConfig, ServerMode } from './config.js';
export { allTools, executeTool, findTool } from './tools/register.js';
export type { ToolContext } from './tools/types.js';
export { SmartleadApiError } from './client/errors.js';
