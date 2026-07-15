// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceName } from 'src/api/resources';

/**
 * A single API request to prime for a page.
 */
export interface PrimedResource {
  resource: ResourceName;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string | Array<string> | number | boolean | null | undefined>;
}

/**
 * Produces the first-render API requests of a page (see registry.ts).
 *
 * Must be deterministic for a given runtime config: the CSP allows the generated inline
 * script by a hash computed once at server startup (see getPrimerScriptCspHashes). When a
 * future page needs request params from the route (e.g. an address hash), the hashing
 * strategy has to change first — per-request hashing in the proxy (it knows the URL) or the
 * existing CSP nonce mechanism.
 */
export type GetPagePrimedResources = () => Array<PrimedResource>;

/**
 * One primed request as consumed by the inline script:
 * [ url, headers resolved on the server, cookie-derived header descriptors to resolve in the browser ].
 * The descriptor tuple is [ header name, cookie name, kind ] — see src/api/utils/cookie-headers.ts.
 */
export type PrimedRequestTuple = [
  url: string,
  serverHeaders: Record<string, string> | null,
  cookieHeaders: Array<[ header: string, cookie: string, kind: 'value' | 'flag' ]> | null,
];
