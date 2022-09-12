import { useRouter } from 'next/router';
import { match } from 'path-to-regexp';
import React from 'react';

import type { RouteName } from 'lib/link/routes';
import { ROUTES } from 'lib/link/routes';

export default function useCurrentRoute() {
  const { asPath } = useRouter();

  return React.useCallback(() => {
    for (const routeName in ROUTES) {
      const route = ROUTES[routeName as RouteName];
      const isMatch = Boolean(match(route.pattern)(asPath));

      if (isMatch) {
        return routeName as RouteName;
      }
    }

    return '';
  }, [ asPath ]);
}
