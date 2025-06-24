import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork, FeaturedChain } from 'types/networks';
import { NETWORK_GROUPS } from 'types/networks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import * as mixpanel from 'lib/mixpanel/index';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

export function useNetworkMenu() {
  const { open, onClose, onOpen, onOpenChange, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>({
    queryKey: [ 'featured-network' ],
    queryFn: async() => fetch(config.UI.navigation.featuredNetworks || '', undefined, { resource: 'featured-network' }),
    enabled: Boolean(config.UI.navigation.featuredNetworks) && open,
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
    availableTabs: NETWORK_GROUPS.filter((tab) => data?.some(({ id }) => id === tab)),
  }), [ open, onClose, onOpen, onToggle, handleOpenChange, data, isPending ]);
}

export function useChainMenu() {
  const { open, onClose, onOpen, onOpenChange, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedChain>>({
    queryKey: [ 'featured-chain' ],
    queryFn: async() => fetch(config.UI.navigation.featuredChains || '', undefined, { resource: 'featured-chain' }),
    enabled: Boolean(config.UI.navigation.featuredChains) && open,
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
