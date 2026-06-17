// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';
import type { ResourceError } from 'src/api/resources';

import { ADDRESS_COUNTERS } from 'src/slices/address/stubs/address';
import { GET_TRANSACTIONS_COUNT } from 'src/slices/address/stubs/rpc';

import { publicClient } from 'src/features/connect-wallet/utils/public-client';

type RpcResponseType = [
  number | null,
];

export type AddressCountersQuery = UseQueryResult<schemas['AddressCounters'], ResourceError<{ status: number }>> & {
  isDegradedData: boolean;
};

interface Params {
  hash: string;
  isEnabled?: boolean;
  isLoading?: boolean;
  isDegradedData?: boolean;
  chain?: ClusterChainConfig;
}

export default function useAddressCountersQuery({ hash, isLoading, isDegradedData, isEnabled = true, chain }: Params): AddressCountersQuery {
  const enabled = isEnabled && Boolean(hash) && !isLoading;

  const apiQuery = useApiQuery<'core:address_counters', { status: number }>('core:address_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: enabled && !isDegradedData,
      placeholderData: ADDRESS_COUNTERS,
      refetchOnMount: false,
    },
    chain,
  });

  const rpcQuery = useQuery<RpcResponseType, unknown, schemas['AddressCounters'] | null>({
    queryKey: [ 'RPC', 'address_counters', { hash } ],
    queryFn: async() => {
      if (!publicClient) {
        throw new Error('No public RPC client');
      }

      const txCount = publicClient.getTransactionCount({ address: hash as `0x${ string }` }).catch(() => null);

      return Promise.all([
        txCount,
      ]);
    },
    select: (response) => {
      const [ txCount ] = response;
      return {
        transactions_count: txCount?.toString() ?? '0',
        token_transfers_count: '0',
        gas_usage_count: '0',
        validations_count: '0',
      };
    },
    placeholderData: [ GET_TRANSACTIONS_COUNT ],
    enabled: enabled && (isDegradedData || apiQuery.isError),
    retry: false,
    refetchOnMount: false,
  });

  const isRpcQuery = Boolean((isDegradedData || apiQuery.isError) && rpcQuery.data && publicClient);
  const query = isRpcQuery ? rpcQuery as UseQueryResult<schemas['AddressCounters'], ResourceError<{ status: number }>> : apiQuery;

  return {
    ...query,
    isDegradedData: isRpcQuery,
  };
}
