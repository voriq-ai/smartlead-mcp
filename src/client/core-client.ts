import { HttpClient, type HttpResult, type QueryValue } from './http.js';
import { DEFAULT_CORE_BASE_URL, type SmartleadConfig } from '../config.js';

export type CoreQuery = Record<string, QueryValue>;

/**
 * Client for the core Smartlead API host.
 *
 * Base URL: https://server.smartlead.ai/api/v1
 *
 * Deliberately narrow. Version 0.1.0 covers campaigns, leads, email accounts,
 * lead lists and the domain block list — not the full Smartlead surface.
 */
export class CoreClient {
  private readonly http: HttpClient;

  constructor(config: SmartleadConfig, fetchImpl?: typeof fetch, sleep?: (ms: number) => Promise<void>) {
    this.http = new HttpClient({
      baseUrl: config.coreBaseUrl || DEFAULT_CORE_BASE_URL,
      apiKey: config.apiKey,
      timeoutMs: config.timeoutMs,
      maxRetries: config.maxRetries,
      host: 'core',
      fetchImpl,
      sleep,
    });
  }

  // --- Read-only ---------------------------------------------------------------

  listCampaigns(query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/campaigns/', query });
  }

  getCampaign(campaignId: number, query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: `/campaigns/${campaignId}`, query });
  }

  getCampaignAnalytics(campaignId: number): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: `/campaigns/${campaignId}/analytics` });
  }

  listCampaignLeads(campaignId: number, query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: `/campaigns/${campaignId}/leads`, query });
  }

  listEmailAccounts(query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/email-accounts/', query });
  }

  getLeadByEmail(email: string): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/leads/', query: { email } });
  }

  listLeadLists(query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/lead-list/', query });
  }

  getDomainBlockList(query: CoreQuery): Promise<HttpResult> {
    return this.http.request({ method: 'GET', path: '/leads/get-domain-block-list', query });
  }

  // --- Mutations ---------------------------------------------------------------
  //
  // None of these are auto-retried: Smartlead does not document idempotency keys,
  // so a retry could create a duplicate campaign or import leads twice.

  createCampaign(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({ method: 'POST', path: '/campaigns/create', body, retryable: false });
  }

  updateCampaignStatus(campaignId: number, body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'POST',
      path: `/campaigns/${campaignId}/status`,
      body,
      retryable: false,
    });
  }

  addLeadsToCampaign(campaignId: number, body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'POST',
      path: `/campaigns/${campaignId}/leads`,
      body,
      retryable: false,
    });
  }

  addDomainBlockList(body: Record<string, unknown>): Promise<HttpResult> {
    return this.http.request({
      method: 'POST',
      path: '/leads/add-domain-block-list',
      body,
      retryable: false,
    });
  }

  deleteDomainBlockList(id: number): Promise<HttpResult> {
    return this.http.request({
      method: 'DELETE',
      path: '/leads/delete-domain-block-list',
      query: { id },
      retryable: false,
    });
  }
}
