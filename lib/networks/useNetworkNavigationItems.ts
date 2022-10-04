import appConfig from 'configs/app/config';
import { useRouter } from 'next/router';
import React from 'react';

import { link } from 'lib/link/link';
import { ROUTES } from 'lib/link/routes';
import useCurrentRoute from 'lib/link/useCurrentRoute';
import featuredNetworks from 'lib/networks/featuredNetworks';

export default function useNetworkNavigationItems() {
  const currentRouteName = useCurrentRoute()();
  const currentRoute = ROUTES[currentRouteName];
  const router = useRouter();

  return React.useMemo(() => {
    return featuredNetworks.map((network) => {
      const routeName = 'crossNetworkNavigation' in currentRoute && currentRoute.crossNetworkNavigation ? currentRouteName : 'network_index';
      const [ , networkType, networkSubtype ] = network.basePath.split('/');
      const url = link(routeName, { ...router.query, network_type: networkType, network_sub_type: networkSubtype });

      return {
        ...network,
        url: url,
        isActive: appConfig.network.basePath === network.basePath,
      };
    });
  }, [ currentRoute, currentRouteName, router.query ]);
}
