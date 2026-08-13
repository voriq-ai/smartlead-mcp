import { HttpClient, type HttpResult, type QueryValue } from './http.js';
import { DEFAULT_PROSPECT_BASE_URL, type SmartleadConfig } from '../config.js';

export type ProspectQuery = Record<string, QueryValue>;

/**
 * Client for the SmartProspect host.
 *
 * Base URL: https://prospect-api.smartlead.ai/api/v1/search-email-leads
 *
 * This is a different host from the core Smartlead API and the two must never
 * be collapsed into one client — the paths below are relative to the
 * `/search-email-leads` prefix.
 */
export class ProspectClient {
  private readonly http: HttpClient;

  constructor(config: SmartleadConfig, fetchImpl?: typeof fetch, sleep?: (ms: number) => Promise<void>) {
    this.http = new HttpClient({
      baseUrl: config.prospectBaseUrl || DEFAULT_PROSPECT_BASE_URL,
      apiKey: config.apiKey,
      timeoutMs: config.timeoutMs,
      maxRetries: config.maxRetries,
      host: 'SmartProspect',
      fetchImpl,
      sleep,
    });
  }

  // --- Read-only lookups (GET) -------------------------------------------------

  listCountries(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/countries', query });
  }

  listStates(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/states', query });
  }

  listCities(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/cities', query });
  }

  listCompanies(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/company', query });
  }

  listDomains(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/domain', query });
  }

  listDepartments(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/departments', query });
  }

  listLevels(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/levels', query });
  }

  listIndustries(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/industries', query });
  }

  listSubIndustries(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/sub-industries', query });
  }

  listRevenueRanges(): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/revenue' });
  }

  listHeadCounts(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/head-counts', query });
  }

  listJobTitles(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/job-title', query });
  }

  listKeywords(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/keywords', query });
  }

  getSearchAnalytics(query: ProspectQuery = {}): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/search-analytics', query });
  }

  getReplyAnalytics(): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/reply-analytics' });
  }

  listSavedSearches(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/search-filters/saved-searches', query });
  }

  listRecentSearches(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/search-filters/recent-searches', query });
  }

  listFetchedSearches(query: ProspectQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/search-filters/fetched-searches', query });
  }

  // --- Read-only POSTs ---------------------------------------------------------
  //
  // These are POSTs because the filter payload is large, but they neither mutate
  // remote state in a user-visible way nor reveal credit-gated email addresses.
  // They are still not auto-retried: a POST is not provably idempotent here.

  searchContacts(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({ method: 'POST', path: '/search-contacts', body, retryable: false });
  }

  getContacts(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({ method: 'POST', path: '/get-contacts', body, retryable: false });
  }

  // --- Remote-state mutations --------------------------------------------------

  saveSearch(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'POST',
      path: '/search-filters/save-search',
      body,
      retryable: false,
    });
  }

  updateSavedSearch(id: number, body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'PUT',
      path: `/search-filters/save-search/${id}`,
      body,
      retryable: false,
    });
  }

  updateFetchedSearch(id: number, body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'PUT',
      path: `/search-filters/fetched-searches/${id}`,
      body,
      retryable: false,
    });
  }

  reviewContacts(filterId: number): Promise<HttpResult> {
    return this.http.request({
      method: 'PATCH',
      path: `/review-contacts/${filterId}`,
      retryable: false,
    });
  }

  // --- Credit-consuming operations ---------------------------------------------
  //
  // `retryable: false` is load-bearing, not decorative: a retried request could
  // charge the account twice.

  findEmails(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'POST',
      path: '/search-contacts/find-emails',
      body,
      retryable: false,
    });
  }

  fetchContacts(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({ method: 'POST', path: '/fetch-contacts', body, retryable: false });
  }
}
