#!/usr/bin/env node
/**
 * Interactive harness for exercising the MCP server by hand.
 *
 *   node scripts/try-tool.mjs                          # list every tool + safety flags
 *   node scripts/try-tool.mjs <tool>                   # call with no arguments
 *   node scripts/try-tool.mjs <tool> '<json>'          # call with arguments
 *   node scripts/try-tool.mjs --published <tool> ...   # run the npm release instead of ./dist
 *   node scripts/try-tool.mjs --schema <tool>          # print a tool's input schema
 *
 * Examples:
 *   node scripts/try-tool.mjs smartprospect_get_search_analytics
 *   node scripts/try-tool.mjs smartprospect_list_countries '{"limit":3}'
 *   node scripts/try-tool.mjs smartprospect_search_contacts '{"limit":5,"title":["Head of Growth"]}'
 *
 * Environment is inherited, so SMARTLEAD_API_KEY, SMARTLEAD_MCP_MODE and the
 * allow-flags behave exactly as they would under a real MCP client. Defaults
 * therefore apply: without SMARTLEAD_MCP_MODE the server is readonly, and
 * credit-spending tools are refused locally before any request is made.
 */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Client } = await import(require.resolve('@modelcontextprotocol/sdk/client/index.js'));
const { StdioClientTransport } = await import(
  require.resolve('@modelcontextprotocol/sdk/client/stdio.js')
);

const argv = process.argv.slice(2);
const usePublished = argv.includes('--published');
const schemaOnly = argv.includes('--schema');
const positional = argv.filter((a) => !a.startsWith('--'));
const [toolName, rawArgs] = positional;

const projectRoot = new URL('..', import.meta.url).pathname;
const localEntry = `${projectRoot}dist/index.js`;

if (!usePublished && !existsSync(localEntry)) {
  console.error('dist/index.js is missing. Run `npm run build` first, or pass --published.');
  process.exit(1);
}

if (!process.env.SMARTLEAD_API_KEY) {
  console.error(
    'SMARTLEAD_API_KEY is not set. The server will refuse to start.\n' +
      'Set it for a live call, or use any placeholder to explore tools/list and the policy refusals:\n' +
      '  SMARTLEAD_API_KEY=placeholder node scripts/try-tool.mjs\n',
  );
  process.exit(1);
}

const transport = new StdioClientTransport({
  command: usePublished ? 'npx' : 'node',
  args: usePublished ? ['-y', 'smartleadai-mcp'] : [localEntry],
  // Forward the real environment so the safety configuration under test is the
  // same one a production MCP client would produce.
  env: process.env,
  stderr: 'inherit',
});

const client = new Client({ name: 'try-tool', version: '0.0.0' });
await client.connect(transport);

const mode = process.env.SMARTLEAD_MCP_MODE ?? 'readonly (default)';
console.log(`server : ${JSON.stringify(client.getServerVersion())}`);
console.log(`mode   : ${mode}`);
console.log(
  `flags  : credit=${process.env.SMARTLEAD_MCP_ALLOW_CREDIT_SPEND ?? 'false'} ` +
    `send=${process.env.SMARTLEAD_MCP_ALLOW_SEND ?? 'false'} ` +
    `destructive=${process.env.SMARTLEAD_MCP_ALLOW_DESTRUCTIVE ?? 'false'}`,
);
console.log('');

const { tools } = await client.listTools();

if (!toolName) {
  const flag = (t) => {
    const marks = [];
    if (t.annotations?.readOnlyHint) marks.push('read-only');
    else marks.push('MUTATES');
    if (/consume SmartProspect credits: yes/.test(t.description ?? '')) marks.push('COSTS CREDITS');
    if (t.annotations?.destructiveHint) marks.push('DESTRUCTIVE');
    return marks.join(', ');
  };
  const width = Math.max(...tools.map((t) => t.name.length));
  const groups = [
    ['smartprospect_', 'SmartProspect'],
    ['smartlead_', 'Core Smartlead'],
    ['smartdelivery_', 'Smart Delivery'],
    ['smartsenders_', 'Smart Senders'],
  ];
  for (const [prefix, label] of groups) {
    console.log(label);
    for (const t of tools.filter((x) => x.name.startsWith(prefix))) {
      console.log(`  ${t.name.padEnd(width)}  ${flag(t)}`);
    }
    console.log('');
  }
  console.log(`${tools.length} tools. Pass a name to call one, or --schema <tool> to see its inputs.`);
  await client.close();
  process.exit(0);
}

const tool = tools.find((t) => t.name === toolName);
if (!tool) {
  console.error(`Unknown tool: ${toolName}`);
  await client.close();
  process.exit(1);
}

if (schemaOnly) {
  console.log(tool.description);
  console.log('');
  console.log(JSON.stringify(tool.inputSchema, null, 2));
  await client.close();
  process.exit(0);
}

let args = {};
if (rawArgs) {
  try {
    args = JSON.parse(rawArgs);
  } catch (error) {
    console.error(`Arguments must be valid JSON: ${error.message}`);
    await client.close();
    process.exit(1);
  }
}

console.log(`calling ${toolName} with ${JSON.stringify(args)}\n`);
const result = await client.callTool({ name: toolName, arguments: args });
console.log(JSON.stringify(result.structuredContent ?? result, null, 2));

await client.close();
// A refused or failed call exits non-zero so this composes in a shell pipeline.
process.exit(result.isError ? 1 : 0);
