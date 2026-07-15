// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceName } from 'src/api/resources';

/**
 * A single API request to prime for a page.
 */
export interface PrimedResource {
  resource: ResourceName;

  /**
   * A string value is used as is; `{ routeParam }` is substituted in the browser with the
   * matching `[param]` segment of `location.pathname` (the inline script receives the page's
   * route pattern), keeping the generated script deterministic per config.
   */
  pathParams?: Record<string, string | { routeParam: string }>;
  queryParams?: Record<string, string | Array<string> | number | boolean | null | undefined>;

  /**
   * Prime only when one of these tabs is active. The active tab is the `tab` query param,
   * falling back to the page's `defaultTab` when the param is absent. A resource shared by
   * several tabs lists them all here. Omit to prime on every tab.
   */
  tabs?: Array<string>;
}

/**
 * Produces the first-render API requests of a page (see registry.ts).
 *
 * Must be deterministic for a given runtime config: the CSP allows the generated inline
 * script by a hash computed once at server startup (see getPrimerScriptCspHashes).
 * Request-specific values never enter the script — route params and the active tab are
 * resolved by the script itself in the browser from `location`.
 */
export type GetPagePrimedResources = () => Array<PrimedResource>;

/**
 * A page's entry in the primer registry.
 */
export interface PagePrimerConfig {

  /**
   * The id of the page's first tab (`useActiveTabFromQuery` renders it when the `tab` query
   * param is absent). Required for `tabs` restrictions to resolve on the default tab;
   * without it, tab-restricted resources are primed only when the param is present.
   */
  defaultTab?: string;
  resources: GetPagePrimedResources;
}

/**
 * One primed request as consumed by the inline script:
 * [ url template (may contain route-param placeholders), headers resolved on the server,
 *   cookie-derived header descriptors ([ header, cookie, kind ] — see
 *   src/api/utils/cookie-headers.ts), route-param substitutions ([ placeholder, param ]),
 *   tabs the request is restricted to ].
 */
export type PrimedRequestTuple = [
  url: string,
  serverHeaders: Record<string, string> | null,
  cookieHeaders: Array<[ header: string, cookie: string, kind: 'value' | 'flag' ]> | null,
  routeParams: Array<[ placeholder: string, param: string ]> | null,
  tabs: Array<string> | null,
];

/**
 * The argument of the inline script: the page's Next.js route pattern, its default tab (for
 * resolving an absent `tab` query param), and its primed requests.
 */
export interface PrimerPayload {
  route: string;
  defaultTab: string | null;
  requests: Array<PrimedRequestTuple>;
}
