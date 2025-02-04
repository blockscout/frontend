import { useState, useEffect } from 'react';

import type { BurnInfo, GetRwaBurnResponse } from 'types/api/validators';

import { getEnvValue } from 'configs/app/utils';

export function useFetchRwaBurnInfo() {
  const [ data, setData ] = useState<BurnInfo | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  useEffect(() => {
    async function fetchRwaBurnAmount() {
      try {
        setLoading(true);
        const query = JSON.stringify({
          operationName: 'GetFtmBurnedTotalAmount',
          query: `
            query GetFtmBurnedTotalAmount {
              ftmBurnedTotalAmount
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
          throw new Error('Fetching burn info failed');
        }

        const result = (await response.json()) as GetRwaBurnResponse;

        // Transform result to match BurnInfo type
        const burnInfo: BurnInfo = {
          total_rwa_burned: result.data.ftmBurnedTotalAmount,
        };

        setData(burnInfo);
      } catch (error: unknown) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRwaBurnAmount();
  }, [ GRAPHQL_SERVER_URL ]);

  return { data, loading, error };
}
