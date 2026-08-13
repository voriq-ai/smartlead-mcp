#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ConfigError, loadConfig } from './config.js';
import { createServer } from './server.js';
import { redactSecrets } from './security/redaction.js';

/**
 * Stdio entry point.
 *
 * stdout is reserved for the MCP protocol stream, so every diagnostic goes to
 * stderr. Nothing containing contact data or credentials is ever written to
 * either stream.
 */
async function main(): Promise<void> {
  const config = loadConfig();
  const { server } = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = () => {
    void server.close().finally(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const prefix = error instanceof ConfigError ? 'Configuration error' : 'Fatal error';
  process.stderr.write(`${prefix}: ${redactSecrets(message)}\n`);
  if (error instanceof ConfigError) {
    process.stderr.write(
      'Set SMARTLEAD_API_KEY in the environment. See https://api.smartlead.ai/authentication\n',
    );
  }
  process.exit(1);
});
