// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import { retry } from 'src/api/hooks/useQueryClientConfig';
import type { ResourceError } from 'src/api/resources';

import { ADDRESS_INFO } from 'src/slices/address/stubs/address';
import { GET_BALANCE } from 'src/slices/address/stubs/rpc';

import { publicClient } from 'src/features/connect-wallet/utils/public-client';

import { SECOND } from 'src/toolkit/utils/consts';

type RpcResponseType = [
    bigint | null,
];

export type AddressQuery = UseQueryResult<schemas['AddressResponse'], ResourceError<{ status: number }>> & {
  isDegradedData: boolean;
};

interface Params {
  hash: string;
  isEnabled?: boolean;
}

const NO_RPC_FALLBACK_ERROR_CODES = [ 403 ];

export default function useAddressQuery({ hash, isEnabled = true }: Params): AddressQuery {
  const [ isRefetchEnabled, setRefetchEnabled ] = React.useState(false);

  const apiQuery = useApiQuery<'core:address', { status: number }>('core:address', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled && Boolean(hash),
      placeholderData: ADDRESS_INFO,
      refetchOnMount: false,
      retry: (failureCount, error) => {
        if (isRefetchEnabled) {
          return false;
        }

        return retry(failureCount, error);
      },
      refetchInterval: (): number | false => {
        return isRefetchEnabled ? 15 * SECOND : false;
      },
    },
  });

  const rpcQuery = useQuery<RpcResponseType, unknown, schemas['AddressResponse'] | null>({
    queryKey: [ 'RPC', 'address', { hash } ],
    queryFn: async() => {
      if (!publicClient) {
        throw new Error('No public RPC client');
      }

      const balance = publicClient.getBalance({ address: hash as `0x${ string }` }).catch(() => null);

      return Promise.all([
        balance,
      ]);
    },
    select: (response) => {
      const [ balance ] = response;

      if (!balance) {
        return null;
      }

      return {
        hash,
        block_number_balance_updated_at: null,
        coin_balance: balance.toString(),
        creator_address_hash: null,
        creation_transaction_hash: null,
        creation_status: null,
        exchange_rate: null,
        ens_domain_name: null,
        has_logs: false,
        has_token_transfers: false,
        has_tokens: false,
        has_validated_blocks: false,
        implementations: [],
        is_contract: false,
        is_verified: false,
        name: null,
        token: null,
        watchlist_address_id: null,
        is_scam: false,
        metadata: null,
        proxy_type: null,
        reputation: 'ok',
        has_beacon_chain_withdrawals: false,
      } as schemas['AddressResponse'];
    },
    placeholderData: [ GET_BALANCE ],
    enabled: (apiQuery.isError || apiQuery.errorUpdateCount > 0) && !(apiQuery.error?.status && NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status)),
    retry: false,
    refetchOnMount: false,
  });

  React.useEffect(() => {
    if (apiQuery.isPlaceholderData || !publicClient) {
      return;
    }

    if (apiQuery.isError && apiQuery.errorUpdateCount === 1) {
      setRefetchEnabled(true);
    } else if (!apiQuery.isError) {
      setRefetchEnabled(false);
    }
  }, [ apiQuery.errorUpdateCount, apiQuery.isError, apiQuery.isPlaceholderData, apiQuery.error?.status ]);

  React.useEffect(() => {
    if (!rpcQuery.isPlaceholderData && !rpcQuery.data) {
      setRefetchEnabled(false);
    }
  }, [ rpcQuery.data, rpcQuery.isPlaceholderData ]);

  const isRpcQuery = Boolean(

    (apiQuery.isError || apiQuery.isPlaceholderData) &&
    !(apiQuery.error?.status && NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status)) &&
    !NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status ?? 999) &&
    apiQuery.errorUpdateCount > 0 &&
    rpcQuery.data &&
    publicClient,
  );

  const query = isRpcQuery ? rpcQuery as UseQueryResult<schemas['AddressResponse'], ResourceError<{ status: number }>> : apiQuery;

  return {
    ...query,
    isDegradedData: isRpcQuery,
  };
}
