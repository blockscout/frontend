/* global fetchMock -- provided by vitest-fetch-mock in vitest/setup.ts */
import { render } from '@testing-library/react';
import React from 'react';

import { normalizeHeaders } from 'src/api/utils/primed-fetch';

import { expect, it, vi } from 'vitest';

import flushPromises from './flushPromises';
import withEnvs from './mockEnvs';
import { mockNextRouter } from './mockRouter';

// Drift check for the early-fetch primer (src/server/primedRequests): asserts that every
// request the primer would fire for a page is also fired — with byte-identical URL and
// headers — by the real page component on its first render. Used by the colocated
// `<Component>.primed.spec.tsx` files; see the "Primed-requests drift tests" section of the
// unit-testing rules.
//
// Mechanics: the REAL inline script runs first (fetchMock records its requests and keeps
// them pending), the primed map is snapshotted and cleared (so the component cannot consume
// it), then the page component mounts under the full provider stack and its own requests are
// recorded. Responses never resolve — "first render" is everything a page requests before
// any data arrives, and pending-forever responses keep components on their placeholder
// states, avoiding any dependence on response shapes.

export interface CheckPrimedRequestsParams {

  /** Next.js page id — a key of PRIMED_PAGES */
  page: string;

  /** browser url to load the page at, e.g. `/tx/${ hash }?tab=logs` */
  url: string;

  /** loader of the page root component (with its layout); dynamic so it re-evaluates after env overrides */
  loadComponent: () => Promise<{ 'default': React.ComponentType }>;

  /** env overrides (see src/config/test-utils/env-presets.ts), applied via withEnvs */
  envs?: Array<[ string, string ]>;

  /** assert that the primer fires nothing for this url (wrong tab, disabled feature, …) */
  expectEmpty?: boolean;
  title?: string;
}

export default function checkPrimedRequests(params: CheckPrimedRequestsParams) {
  const title = params.title ??
    `primed requests of ${ params.page } at "${ params.url }" ${ params.expectEmpty ? 'are empty' : 'match the page\'s first-render requests' }`;

  it(title, { timeout: 20_000 }, async() => {
    window.history.replaceState(null, '', params.url);
    // responses never resolve — see the module comment
    fetchMock.mockResponse(() => new Promise(() => {}));

    mockNextRouter(params.page, params.url);

    try {
      await withEnvs(params.envs, async() => {
        const { getPrimerScript } = await import('src/server/primedRequests');

        const script = getPrimerScript(params.page);
        if (script) {
          new Function(script)();
        }

        const primed = window.__primedFetches ?
          [ ...window.__primedFetches.entries() ].map(([ url, entry ]) => ({ url, headers: normalizeHeaders(entry.headers) })) :
          [];
        // the page must not consume the primed responses — its own requests are the oracle
        window.__primedFetches = undefined;

        if (params.expectEmpty) {
          expect(primed).toEqual([]);
          return;
        }

        expect(primed.length).toBeGreaterThan(0);

        const primerRequestCount = fetchMock.requests().length;

        const [ { wrapper: TestApp }, { 'default': Component } ] = await Promise.all([
          import('../lib'),
          params.loadComponent(),
        ]);

        const { unmount } = render(<TestApp><Component/></TestApp>);

        try {
          // let mount effects fire their queries and any second-wave queries subscribe
          for (let i = 0; i < 10; i++) {
            await flushPromises();
          }

          const pageRequests = fetchMock.requests()
            .slice(primerRequestCount)
            .filter((request) => request.method === 'GET')
            .map((request) => ({ url: request.url, headers: normalizeHeaders(request.headers) }));

          for (const primedRequest of primed) {
            expect(
              pageRequests,
              `the primer fires ${ primedRequest.url } but the page does not request it with these headers on first render`,
            ).toContainEqual(primedRequest);
          }

          const unprimed = pageRequests
            .map(({ url }) => url)
            .filter((url) => !primed.some((request) => request.url === url));
          if (unprimed.length > 0) {
            // advisory only: priming is opt-in per resource
            // eslint-disable-next-line no-console
            console.info(`[primed-requests] first-render requests of ${ params.page } not primed:\n  ${ [ ...new Set(unprimed) ].join('\n  ') }`);
          }
        } finally {
          unmount();
        }
      });
    } finally {
      vi.doUnmock('next/router');
      fetchMock.resetMocks();
      window.history.replaceState(null, '', '/');
    }
  });
}
