import { useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';
import { NETWORK_GROUPS } from 'types/networks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

export default function useNetworkMenu() {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>({
    queryKey: [ 'featured-network' ],
    queryFn: async() => fetch(config.UI.sidebar.featuredNetworks || '', undefined, { resource: 'featured-network' }),
    enabled: Boolean(config.UI.sidebar.featuredNetworks) && isOpen,
    staleTime: Infinity,
  });

  return React.useMemo(() => ({
    isOpen,
    onClose,
    onOpen,
    onToggle,
    isPending,
    data,
    availableTabs: NETWORK_GROUPS.filter((tab) => data?.some(({ group }) => group === tab)),
  }), [ isOpen, onClose, onOpen, onToggle, data, isPending ]);
}
