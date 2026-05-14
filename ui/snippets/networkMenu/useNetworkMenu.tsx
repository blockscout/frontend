// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';
import { NETWORK_GROUPS } from 'types/networks';

import useFetch from 'client/api/hooks/useFetch';
import type { ResourceError } from 'client/api/resources';

import * as mixpanel from 'client/shared/analytics/mixpanel';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

export default function useNetworkMenu() {
  const { open, onClose, onOpen, onOpenChange, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>({
    queryKey: [ 'featured-network' ],
    queryFn: async() => {
      const configData: Array<FeaturedNetwork> = await (async() => {
        try {
          if (config.UI.featuredNetworks.items) {
            const data = await fetch<Array<FeaturedNetwork>, unknown>(config.UI.featuredNetworks.items, undefined, { resource: 'featured-network' });
            if (Array.isArray(data)) {
              return data;
            }
          }
        } catch (error) {}
        return [];
      })();

      const multichainData: Array<FeaturedNetwork> = (() => {
        if (config.features.multichain.isEnabled) {
          return multichainConfig()?.chains
            .filter((chain) => chain?.explorer_url)
            .filter((chain) => !configData.some((configNetwork) => configNetwork.url.includes(chain.explorer_url ?? '')))
            .map((chain) => ({
              title: chain.name,
              url: chain.explorer_url ?? '',
              group: chain.app_config.chain.isTestnet ? 'Testnets' : 'Mainnets',
              icon: chain.logo,
              invertIconInDarkMode: false,
            })) ?? [];
        }
        return [];
      })();

      return [ ...configData, ...multichainData ];
    },
    enabled: Boolean(config.UI.featuredNetworks.items || config.features.multichain.isEnabled) && open,
    staleTime: Infinity,
  });

  const handleOpenChange = React.useCallback((details: { open: boolean }) => {
    if (details.open) {
      mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Network menu', Source: 'Header' });
    }
    onOpenChange(details);
  }, [ onOpenChange ]);

  return React.useMemo(() => ({
    open,
    onClose,
    onOpen,
    onToggle,
    onOpenChange: handleOpenChange,
    isPending,
    data,
    availableTabs: NETWORK_GROUPS.filter((tab) => data?.some(({ group }) => group === tab)),
  }), [ open, onClose, onOpen, onToggle, handleOpenChange, data, isPending ]);
}
