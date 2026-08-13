import { HttpClient, type HttpMethod, type HttpResult, type QueryValue } from './http.js';
import {
  DEFAULT_CORE_BASE_URL,
  DEFAULT_DELIVERY_BASE_URL,
  DEFAULT_PROSPECT_BASE_URL,
  DEFAULT_SENDERS_BASE_URL,
  type SmartleadConfig,
} from '../config.js';

/**
 * Smartlead splits its API across four hosts. They are not interchangeable and
 * a route is only valid against its own host.
 */
export type SmartleadHost = 'core' | 'prospect' | 'delivery' | 'senders';

export const HOST_LABEL: Record<SmartleadHost, string> = {
  core: 'core',
  prospect: 'SmartProspect',
  delivery: 'Smart Delivery',
  senders: 'Smart Senders',
};

export const HOST_DEFAULT_BASE_URL: Record<SmartleadHost, string> = {
  core: DEFAULT_CORE_BASE_URL,
  prospect: DEFAULT_PROSPECT_BASE_URL,
  delivery: DEFAULT_DELIVERY_BASE_URL,
  senders: DEFAULT_SENDERS_BASE_URL,
};

export interface CallOptions {
  /** Values substituted into `{placeholders}` in the route. */
  pathParams?: Record<string, string | number>;
  query?: Record<string, QueryValue>;
  body?: unknown;
  /**
   * Whether a transient failure may be retried. Defaults to GET-only, matching
   * HttpClient. Catalog tools pass this explicitly so a mutation is never
   * retried just because someone changed a default.
   */
  retryable?: boolean;
}

/**
 * One HttpClient per host, plus route templating.
 *
 * Catalog-driven tools dispatch through here rather than through a bespoke
 * client class, so adding an endpoint is a data change rather than a code one.
 */
export class ClientRegistry {
  private readonly clients: Record<SmartleadHost, HttpClient>;

  constructor(config: SmartleadConfig, fetchImpl?: typeof fetch, sleep?: (ms: number) => Promise<void>) {
    const make = (host: SmartleadHost, baseUrl: string) =>
      new HttpClient({
        baseUrl: baseUrl || HOST_DEFAULT_BASE_URL[host],
        apiKey: config.apiKey,
        timeoutMs: config.timeoutMs,
        maxRetries: config.maxRetries,
        host: HOST_LABEL[host],
        fetchImpl,
        sleep,
      });

    this.clients = {
      core: make('core', config.coreBaseUrl),
      prospect: make('prospect', config.prospectBaseUrl),
      delivery: make('delivery', config.deliveryBaseUrl),
      senders: make('senders', config.sendersBaseUrl),
    };
  }

  client(host: SmartleadHost): HttpClient {
    return this.clients[host];
  }

  async call(host: SmartleadHost, method: HttpMethod, route: string, options: CallOptions = {}): Promise<HttpResult> {
    return this.clients[host].request({
      method,
      path: applyPathParams(route, options.pathParams),
      query: options.query,
      body: options.body,
      retryable: options.retryable ?? method === 'GET',
    });
  }
}

/**
 * Substitute `{name}` placeholders. Values are URI-encoded because a path
 * parameter is caller-supplied and could otherwise inject extra path segments.
 */
export function applyPathParams(route: string, params: Record<string, string | number> = {}): string {
  return route.replace(/\{([^}]+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined) {
      throw new Error(`missing value for path parameter "${name}" in route ${route}`);
    }
    return encodeURIComponent(String(value));
  });
}
