import { READ_ONLY } from '../../security/policy.js';
import { defineTool, toolList } from '../types.js';
import { unwrap } from '../shape.js';
import * as schema from '../../schemas/smart-prospect.js';

/**
 * SmartProspect reference-data lookups.
 *
 * All of these are free, read-only GETs used to build valid filter values
 * before running a search. None of them touch credits.
 */

const NO_CREDIT_NOTE = 'Reference data only. Does not reveal contacts and does not consume credits.';

const listCountries = defineTool({
  name: 'smartprospect_list_countries',
  title: 'SmartProspect: list countries',
  summary: 'List country values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/countries' },
  inputSchema: schema.listCountriesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listCountries(args)),
});

const listStates = defineTool({
  name: 'smartprospect_list_states',
  title: 'SmartProspect: list states',
  summary: 'List state/region values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/states' },
  inputSchema: schema.listStatesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listStates(args)),
});

const listCities = defineTool({
  name: 'smartprospect_list_cities',
  title: 'SmartProspect: list cities',
  summary: 'List city values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE, 'Smartlead documents that filtering by `country` also requires `state`.'],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/cities' },
  inputSchema: schema.listCitiesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listCities(args)),
});

const listDepartments = defineTool({
  name: 'smartprospect_list_departments',
  title: 'SmartProspect: list departments',
  summary: 'List department values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/departments' },
  inputSchema: schema.listDepartmentsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listDepartments(args)),
});

const listSeniorityLevels = defineTool({
  name: 'smartprospect_list_seniority_levels',
  title: 'SmartProspect: list seniority levels',
  summary: 'List seniority level values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/levels' },
  inputSchema: schema.listLevelsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listLevels(args)),
});

const listIndustries = defineTool({
  name: 'smartprospect_list_industries',
  title: 'SmartProspect: list industries',
  summary: 'List industry values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/industries' },
  inputSchema: schema.listIndustriesSchema,
  handler: async (args, ctx) => {
    const { withSubIndustry, ...rest } = args;
    return unwrap(
      await ctx.prospect.listIndustries({
        ...rest,
        // Documented as the string "true"/"false".
        withSubIndustry: withSubIndustry === undefined ? undefined : String(withSubIndustry),
      }),
    );
  },
});

const listSubIndustries = defineTool({
  name: 'smartprospect_list_sub_industries',
  title: 'SmartProspect: list sub-industries',
  summary: 'List sub-industry values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/sub-industries' },
  inputSchema: schema.listSubIndustriesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listSubIndustries(args)),
});

const listRevenueRanges = defineTool({
  name: 'smartprospect_list_revenue_ranges',
  title: 'SmartProspect: list revenue ranges',
  summary: 'List company revenue range values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE, 'This endpoint takes no pagination parameters.'],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/revenue' },
  inputSchema: schema.listRevenueRangesSchema,
  handler: async (_args, ctx) => unwrap(await ctx.prospect.listRevenueRanges()),
});

const listHeadCounts = defineTool({
  name: 'smartprospect_list_head_counts',
  title: 'SmartProspect: list company head count ranges',
  summary: 'List company head count (size) ranges available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/head-counts' },
  inputSchema: schema.listHeadCountsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listHeadCounts(args)),
});

const listCompanies = defineTool({
  name: 'smartprospect_list_companies',
  title: 'SmartProspect: list companies',
  summary: 'List company names available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/company' },
  inputSchema: schema.listCompaniesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listCompanies(args)),
});

const listDomains = defineTool({
  name: 'smartprospect_list_domains',
  title: 'SmartProspect: list company domains',
  summary: 'List company domains available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/domain' },
  inputSchema: schema.listDomainsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listDomains(args)),
});

const listJobTitles = defineTool({
  name: 'smartprospect_list_job_titles',
  title: 'SmartProspect: list job titles',
  summary: 'List job title values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/job-title' },
  inputSchema: schema.listJobTitlesSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listJobTitles(args)),
});

const listKeywords = defineTool({
  name: 'smartprospect_list_keywords',
  title: 'SmartProspect: list company keywords',
  summary: 'List company keyword values available as SmartProspect search filters.',
  notes: [NO_CREDIT_NOTE],
  capability: READ_ONLY,
  endpoint: { host: 'prospect', method: 'GET', route: '/keywords' },
  inputSchema: schema.listKeywordsSchema,
  handler: async (args, ctx) => unwrap(await ctx.prospect.listKeywords(args)),
});

export const lookupTools = toolList(
  listCountries,
  listStates,
  listCities,
  listDepartments,
  listSeniorityLevels,
  listIndustries,
  listSubIndustries,
  listRevenueRanges,
  listHeadCounts,
  listCompanies,
  listDomains,
  listJobTitles,
  listKeywords,
);
