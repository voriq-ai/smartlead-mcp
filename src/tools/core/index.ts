import { toolList } from '../types.js';
import { campaignTools } from './campaigns.js';
import { leadTools } from './leads.js';
import { emailAccountTools } from './email-accounts.js';
import { blockListTools } from './blocklist.js';

/**
 * Hand-written core Smartlead tools. These carry documented constraints and
 * per-call capability narrowing that the catalog factory cannot express; the
 * rest of the core surface is generated.
 */
export const coreTools = toolList(...campaignTools, ...leadTools, ...emailAccountTools, ...blockListTools);
