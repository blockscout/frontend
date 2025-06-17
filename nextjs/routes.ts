import type { Route } from 'nextjs-routes';
import { route as nextjsRoute } from 'nextjs-routes';

import type { TMultichainContext } from 'lib/contexts/multichain';

export const route = (route: Route, multichainContext?: TMultichainContext | null) => {
  return nextjsRoute(routeParams(route, multichainContext));
};

export const routeParams = (route: Route, multichainContext?: TMultichainContext | null): Route => {
  if (multichainContext) {
    const pathname = '/chain/[chain-slug]' + route.pathname;
    return { ...route, pathname, query: { ...route.query, 'chain-slug': multichainContext.chain.slug } } as Route;
  }
  return route;
};
