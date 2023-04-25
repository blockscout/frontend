import { useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork, NetworkGroup } from 'types/networks';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';

const TABS: Array<NetworkGroup> = [ 'Mainnets', 'Testnets', 'Other' ];

export default function useNetworkMenu() {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();

  const apiFetch = useApiFetch();
  const { isLoading, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>(
    [ 'featured-network' ],
    async() => apiFetch(appConfig.featuredNetworks || ''),
    {
      enabled: Boolean(appConfig.featuredNetworks) && isOpen,
      staleTime: Infinity,
    });

  return React.useMemo(() => ({
    isOpen,
    onClose,
    onOpen,
    onToggle,
    isLoading,
    data,
    availableTabs: TABS.filter((tab) => data?.some(({ group }) => group === tab)),
  }), [ isOpen, onClose, onOpen, onToggle, data, isLoading ]);
}
