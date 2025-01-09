import { useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { FeaturedNetwork } from 'types/networks';
import { NETWORK_GROUPS } from 'types/networks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

export default function useNetworkMenu() {
  const { open, onClose, onOpen, onToggle } = useDisclosure();

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<FeaturedNetwork>>({
    queryKey: [ 'featured-network' ],
    queryFn: async() => fetch(config.UI.navigation.featuredNetworks || '', undefined, { resource: 'featured-network' }),
    enabled: Boolean(config.UI.navigation.featuredNetworks) && open,
    staleTime: Infinity,
  });

  const onOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  }, [ onOpen, onClose ]);

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
