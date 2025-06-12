import type { Route } from 'nextjs-routes';
import { route as nextjsRoute } from 'nextjs-routes';

import type { TMultichainContext } from 'lib/contexts/multichain';

export const route = (route: Route, multichainContext?: TMultichainContext | null) => {
  if (multichainContext) {
    const pathname = '/subchain/[subchain-slug]' + route.pathname;
    return nextjsRoute({ ...route, pathname, query: { ...route.query, 'subchain-slug': multichainContext.subchain.slug } } as Route);
  }
  return nextjsRoute(route);
};
