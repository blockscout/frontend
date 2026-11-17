// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { RpcPingResult } from './utils';
import { pingRpcNode } from './utils';

export function useRpcNodePingQuery(url: string | undefined): UseQueryResult<RpcPingResult> {
  return useQuery({
    queryKey: [ 'RPC', 'custom-node-ping', { url } ],
    queryFn: () => pingRpcNode(url ?? ''),
    enabled: Boolean(url),
    refetchOnMount: 'always',
    retry: false,
  });
}
