import { useRouter } from 'next/router';
import React from 'react';

import type { RouteName } from 'lib/link/routes';
import { ROUTES } from 'lib/link/routes';

const PATH_PARAM_REGEXP = /\/:(\w+)/g;

export default function useCurrentRoute() {
  const { route: nextRoute } = useRouter();

  return React.useCallback((): RouteName => {
    for (const routeName in ROUTES) {
      const route = ROUTES[routeName as RouteName];
      const formattedRoute = route.pattern.replace(PATH_PARAM_REGEXP, (_, paramName: string) => {
        return `/[${ paramName }]`;
      });
      if (formattedRoute === nextRoute) {
        return routeName as RouteName;
      }
    }

    return 'network_index';
  }, [ nextRoute ]);
}
