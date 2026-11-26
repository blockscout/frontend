// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceName } from 'src/api/resources';

export interface PrimedResource {
  resource: ResourceName;

  // A string value is used as is; `{ routeParam }` is substituted in the browser with the
  // matching `[param]` segment of `location.pathname`.
  pathParams?: Record<string, string | { routeParam: string }>;
  queryParams?: Record<string, string | Array<string> | number | boolean | null | undefined>;

  // Names of URL query-string params to forward to this request, read from `location.search`
  // in the browser and appended in the order given. The order must match the order the page
  // assembles its params, so the query string is byte-identical; absent or empty params are skipped.
  searchParams?: Array<string>;

  // Prime only when one of these tabs is active. The active tab is the `tab` query param,
  // falling back to the page's `defaultTab` when the param is absent. A resource shared by
  // several tabs lists them all here. Omit to prime on every tab.
  tabs?: Array<string>;
}

// Must be deterministic for a given runtime config (see CONTEXT.md). Request-specific values never
// enter it: route params and the active tab are resolved in the browser, through `pathParams` and `tabs`.
export type GetPagePrimedResources = () => Array<PrimedResource>;

export interface PagePrimerConfig {

  // The id of the tab the page renders when the `tab` query param is absent. Required for `tabs`
  // restrictions to resolve on the default tab; without it, tab-restricted resources are primed
  // only when the param is present.
  defaultTab?: string;
  resources: GetPagePrimedResources;
}

export type PrimedRequestTuple = [
  url: string,
  serverHeaders: Record<string, string> | null,
  cookieHeaders: Array<[ header: string, cookie: string, kind: 'value' | 'flag' ]> | null,
  routeParams: Array<[ placeholder: string, param: string ]> | null,
  searchParams: Array<string> | null,
  tabs: Array<string> | null,
];

export interface PrimerPayload {
  route: string;
  defaultTab: string | null;
  requests: Array<PrimedRequestTuple>;
}
