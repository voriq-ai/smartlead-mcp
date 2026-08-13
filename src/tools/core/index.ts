import { toolList } from '../types.js';
import { campaignTools } from './campaigns.js';
import { leadTools } from './leads.js';
import { emailAccountTools } from './email-accounts.js';
import { blockListTools } from './blocklist.js';

/**
 * The deliberately small core Smartlead surface exposed in 0.1.0.
 * This package's focus is SmartProspect; these tools exist to complete the
 * prospect-to-campaign workflow, not to mirror the whole Smartlead API.
 */
export const coreTools = toolList(...campaignTools, ...leadTools, ...emailAccountTools, ...blockListTools);
