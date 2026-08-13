import { CoreClient } from '../../src/client/core-client.js';
import { ProspectClient } from '../../src/client/prospect-client.js';
import { ClientRegistry } from '../../src/client/registry.js';
import type { SmartleadConfig } from '../../src/config.js';
import type { ToolContext } from '../../src/tools/types.js';
import { createMockFetch, noSleep, testConfig, type MockFetch, type MockReply } from './mock-fetch.js';

export interface TestContext {
  ctx: ToolContext;
  mock: MockFetch;
}

/** Build a ToolContext backed by a scripted fetch stub. */
export function createTestContext(
  replies: MockReply[] = [{ json: { success: true, data: [] } }],
  overrides: Partial<SmartleadConfig> = {},
): TestContext {
  const config = testConfig(overrides);
  const mock = createMockFetch(replies);
  return {
    mock,
    ctx: {
      config,
      core: new CoreClient(config, mock.fetch, noSleep),
      prospect: new ProspectClient(config, mock.fetch, noSleep),
      clients: new ClientRegistry(config, mock.fetch, noSleep),
    },
  };
}

/** Config with every gate open, for tests that care about routing rather than policy. */
export const permissiveOverrides: Partial<SmartleadConfig> = {
  mode: 'unrestricted',
  allowCreditSpend: true,
  allowSend: true,
  allowDestructive: true,
};
