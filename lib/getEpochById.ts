import { useState, useEffect } from 'react';

import { getEnvValue } from 'configs/app/utils';

export interface ValidatorReward {
  validatorId: string;
  reward: string;
  __typename: string;
}

export interface ActualValidatorReward {
  id: string;
  totalReward: string;
  __typename: string;
}

export interface Epoch {
  id: string;
  endTime: string;
  epochFee: string;
  totalTxRewardWeight: string;
  totalBaseRewardWeight: `0x${ string }`;
  validatorRewards: Array<ValidatorReward>;
  actualValidatorRewards: Array<ActualValidatorReward>;
  __typename: string;
}

export interface GetEpochByIdResponse {
  data: {
    epoch: Epoch;
  };
}

export function useFetchEpochById(epochId: string) {
  const [ data, setData ] = useState<Epoch | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  useEffect(() => {
    async function fetchEpochById() {
      try {
        setLoading(true);
        const query = JSON.stringify({
          operationName: 'EpochById',
          query: `
            query EpochById($id: Long) {
              epoch(id: $id) {
                id
                endTime
                epochFee
                totalTxRewardWeight
                totalBaseRewardWeight
                validatorRewards {
                  validatorId
                  reward
                  __typename
                }
                actualValidatorRewards {
                  id
                  totalReward
                  __typename
                }
                __typename
              }
            }
          `,
          variables: { id: `0x${ parseInt(epochId, 10).toString(16) }` },
        });

        const response = await fetch(GRAPHQL_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: query,
        });

        if (!response.ok) {
          throw new Error('Fetching epoch data failed');
        }

        const result = (await response.json()) as GetEpochByIdResponse;
        setData(result.data.epoch);
      } catch (error: unknown) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    }

    if (epochId) {
      fetchEpochById();
    }
  }, [ GRAPHQL_SERVER_URL, epochId ]);

  return { data, loading, error };
}
