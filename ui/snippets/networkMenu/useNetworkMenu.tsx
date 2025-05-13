import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';
import { NETWORK_GROUPS } from 'types/networks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

export default function useNetworkMenu() {
  const { open, onClose, onOpen, onOpenChange, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>({
    queryKey: [ 'featured-network' ],
    queryFn: async() => fetch(config.UI.navigation.featuredNetworks || '', undefined, { resource: 'featured-network' }),
    enabled: Boolean(config.UI.navigation.featuredNetworks) && open,
    staleTime: Infinity,
  });

  return React.useMemo(() => ({
    open,
    onClose,
    onOpen,
    onToggle,
    onOpenChange,
    isPending,
    data,
    availableTabs: NETWORK_GROUPS.filter((tab) => data?.some(({ group }) => group === tab)),
  }), [ open, onClose, onOpen, onToggle, onOpenChange, data, isPending ]);
}
