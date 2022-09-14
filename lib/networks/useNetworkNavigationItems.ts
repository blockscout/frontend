import { useRouter } from 'next/router';
import React from 'react';

import useNetwork from 'lib/hooks/useNetwork';
import isAccountRoute from 'lib/link/isAccountRoute';
import { link } from 'lib/link/link';
import { ROUTES } from 'lib/link/routes';
import useCurrentRoute from 'lib/link/useCurrentRoute';
import NETWORKS from 'lib/networks/availableNetworks';

export default function useNetworkNavigationItems() {
  const selectedNetwork = useNetwork();
  const currentRouteName = useCurrentRoute()();
  const currentRoute = ROUTES[currentRouteName];
  const router = useRouter();
  const isAccount = isAccountRoute(currentRouteName);

  return React.useMemo(() => {
    return NETWORKS.map((network) => {

      const routeName = (() => {
        if ('crossNetworkNavigation' in currentRoute && currentRoute.crossNetworkNavigation) {
          if ((isAccount && network.isAccountSupported) || !isAccount) {
            return currentRouteName;
          }
        }

        return 'network_index';
      })();

      const url = link(routeName, { ...router.query, network_type: network.type, network_sub_type: network.subType });

      return {
        ...network,
        url: url,
        isActive: selectedNetwork?.type === network.type && selectedNetwork?.subType === network?.subType,
      };
    });
  }, [ currentRoute, currentRouteName, isAccount, router.query, selectedNetwork?.subType, selectedNetwork?.type ]);
}
