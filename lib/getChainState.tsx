import { useState, useEffect } from 'react';
import type { Hex } from 'viem';

import { getEnvValue } from 'configs/app/utils';

export interface ChainState {
  blocks: Hex;
  transactions: Hex;
  accounts: Hex;
  validators: Hex;
  sfcLockingEnabled: boolean;
  sealedEpoch: {
    id: Hex;
    totalSupply: Hex;
    baseRewardPerSecond: Hex;
    __typename: string;
  };
  __typename: string;
}

export interface GetChainStateResponse {
  data: {
    state: ChainState;
  };
}

export function useFetchChainState() {
  const [ data, setData ] = useState<ChainState | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  useEffect(() => {
    async function fetchChainState() {
      try {
        setLoading(true);
        const query = JSON.stringify({
          operationName: 'State',
          query: `
            query State {
              state {
                blocks
                transactions
                accounts
                validators
                sfcLockingEnabled
                sealedEpoch {
                  id
                  totalSupply
                  baseRewardPerSecond
                  __typename
                }
                __typename
              }
            }
          `,
          variables: {},
        });

        const response = await fetch(GRAPHQL_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: query,
        });

        if (!response.ok) {
          throw new Error('Fetching chain state failed');
        }

        const result = (await response.json()) as GetChainStateResponse;

        setData(result.data.state);
      } catch (error: unknown) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchChainState();
  }, [ GRAPHQL_SERVER_URL ]);

  return { data, loading, error };
}
