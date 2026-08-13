import { toolList } from '../types.js';
import { lookupTools } from './lookups.js';
import { analyticsTools } from './analytics.js';
import { searchManagementTools } from './searches.js';
import { contactTools } from './contacts.js';
import { creditTools } from './credits.js';

/** All SmartProspect tools, in workflow order: analytics → lookups → search → manage → spend. */
export const smartProspectTools = toolList(
  ...analyticsTools,
  ...lookupTools,
  ...contactTools,
  ...searchManagementTools,
  ...creditTools,
);
