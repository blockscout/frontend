// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';
import { route as nextjsRoute } from 'nextjs-routes';

import type { ExternalChain } from 'src/shared/external-chains/types';

import config from 'src/config';

import { stripTrailingSlash } from 'src/toolkit/utils/url';

export interface RouteParams {
  external?: boolean;
  chain?: ExternalChain & { slug?: string };
  absolute?: boolean;
}

export const route = (route: Route, params?: RouteParams | null) => {
  const generatedRoute = nextjsRoute(routeParams(route, params));

  if (params && params.chain && params.external && params.chain.explorer_url) {
    return stripTrailingSlash(params.chain.explorer_url) + generatedRoute;
  }

  if (params && params.absolute) {
    return config.app.baseUrl + generatedRoute;
  }

  return generatedRoute;
};

export const routeParams = (route: Route, params?: RouteParams | null): Route => {
  if (!params?.external && params?.chain?.slug) {
    const pathname = '/chain/[chain_slug_or_id]' + route.pathname;
    return { ...route, pathname, query: { ...route.query, chain_slug_or_id: params.chain.slug } } as Route;
  }
  return route;
};
