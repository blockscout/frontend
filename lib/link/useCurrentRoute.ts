import { useRouter } from 'next/router';
import React from 'react';

import type { RouteName } from 'lib/link/routes';
import { ROUTES } from 'lib/link/routes';

export default function useCurrentRoute() {
  const { route: nextRoute } = useRouter();

  return React.useCallback((): RouteName => {
    for (const routeName in ROUTES) {
      const route = ROUTES[routeName as RouteName];
      if (route.pattern === nextRoute) {
        return routeName as RouteName;
      }
    }

    return 'network_index';
  }, [ nextRoute ]);
}
