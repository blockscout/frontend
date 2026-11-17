// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useMultichainContext } from 'src/features/multichain/context';

import { STATS } from './stubs';

interface Props {
  enabled?: boolean;
  chain?: ClusterChainConfig;
}

export default function useStatsQuery({ enabled = true, chain }: Props = {}) {
  const multichainContext = useMultichainContext();

  return useApiQuery('core:stats', {
    chain: chain ?? multichainContext?.chain,
    queryOptions: {
      enabled,
      refetchOnMount: false,
      placeholderData: STATS,
    },
  });
}
