// SPDX-License-Identifier: LicenseRef-Blockscout

// Early-fetch primer, server side. For pages registered in registry.ts, _document embeds an
// inline script into the HTML <head> that fires the page's first-render API requests while
// the JS bundle is still downloading/evaluating. The fetch layer consumes each primed
// request instead of hitting the network a second time (src/api/utils/primed-fetch.ts).

import type { PagePrimerConfig, PrimedRequestTuple, PrimerPayload } from './types';

import buildHeaders from 'src/api/utils/build-headers';
import buildUrl from 'src/api/utils/build-url';
import { getCookieHeaderDescriptors } from 'src/api/utils/cookie-headers';
import getResourceParams from 'src/api/utils/get-resource-params';

import { PRIMED_FETCH_SCRIPT } from './inlineScript';
import { PRIMED_PAGES } from './registry';

function getRequestTuples(pageConfig: PagePrimerConfig): Array<PrimedRequestTuple> {
  return pageConfig.resources().map(({ resource, pathParams, queryParams, tabs }) => {
    // route-param references become alphanumeric placeholders that survive buildUrl's
    // path compilation unencoded; the inline script substitutes them in the browser
    const routeParams: Array<[ string, string ]> = [];
    const resolvedPathParams = pathParams && Object.fromEntries(Object.entries(pathParams).map(([ name, value ]) => {
      if (typeof value === 'string') {
        return [ name, value ];
      }

      const placeholder = `PRIMERROUTEPARAM${ routeParams.length }`;
      routeParams.push([ placeholder, value.routeParam ]);
      return [ name, placeholder ];
    }));

    const url = buildUrl(resource, resolvedPathParams, queryParams);
    // on the server buildHeaders resolves only the cookie-independent part of the headers
    // (proxy routing + static per-resource headers) — there are no cookies here
    const serverHeaders = buildHeaders(resource) as Record<string, string>;
    const cookieHeaders = getCookieHeaderDescriptors(getResourceParams(resource).apiName)
      .map(({ header, cookie, kind }): [ string, string, 'value' | 'flag' ] => [ header, cookie, kind ]);

    return [
      url,
      Object.keys(serverHeaders).length > 0 ? serverHeaders : null,
      cookieHeaders.length > 0 ? cookieHeaders : null,
      routeParams.length > 0 ? routeParams : null,
      tabs && tabs.length > 0 ? tabs : null,
    ];
  });
}

/**
 * The inline primer script for a page, or an empty string when the page has no primed
 * requests. `page` is the Next.js page id (`__NEXT_DATA__.page`).
 */
export function getPrimerScript(page: string | undefined): string {
  try {
    const pageConfig = page ? PRIMED_PAGES[page] : undefined;
    if (!pageConfig) {
      return '';
    }

    const requests = getRequestTuples(pageConfig);
    if (requests.length === 0) {
      return '';
    }

    const payload: PrimerPayload = {
      route: page as string,
      defaultTab: pageConfig.defaultTab ?? null,
      requests,
    };

    // escape "<" so that the JSON payload cannot terminate the surrounding <script> element
    return `${ PRIMED_FETCH_SCRIPT }(${ JSON.stringify(payload).replace(/</g, '\\u003c') })`;
  } catch (error) {
    return '';
  }
}

/**
 * CSP script-src tokens (quoted sha256 hashes) of every registered page's primer script.
 * The scripts are deterministic for a given runtime config (see types.ts), so the hashes are
 * computed once at startup when the CSP policy is generated (src/server/csp/index.ts).
 */
export async function getPrimerScriptCspHashes(): Promise<Array<string>> {
  const scripts = Object.keys(PRIMED_PAGES)
    .map((page) => getPrimerScript(page))
    .filter(Boolean);

  return Promise.all(scripts.map(async(script) => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(script));
    return `'sha256-${ btoa(String.fromCharCode(...new Uint8Array(digest))) }'`;
  }));
}
