import React from 'react';

import appConfig from 'configs/app/config';
import featuredNetworks from 'lib/networks/featuredNetworks';

export default function useNetworkNavigationItems() {

  return React.useMemo(() => {
    return featuredNetworks.map((network) => {
      return {
        ...network,
        isActive: network.type ? appConfig.network.type === network.type : false,
      };
    });
  }, []);
}
