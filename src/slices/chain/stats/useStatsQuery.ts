// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useMultichainContext } from 'src/features/multichain/context';

import { STATS } from './stubs';

interface Props {
  enabled?: boolean;
}

export default function useStatsQuery({ enabled = true }: Props = {}) {
  const multichainContext = useMultichainContext();

  return useApiQuery('core:stats', {
    chain: multichainContext?.chain,
    queryOptions: {
      enabled,
      refetchOnMount: false,
      placeholderData: STATS,
    },
  });
}
