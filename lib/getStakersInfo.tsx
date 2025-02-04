import { useState, useEffect } from 'react';
import { formatUnits, hexToBigInt, hexToNumber } from 'viem';

import type {
  GetEpochResponse,
  GetStakerReponse,
  SingleStakerReponse,
  Validator,
} from 'types/api/validators';

import { getEnvValue } from 'configs/app/utils';

export function useFetchStakersInfo() {
  const [ data, setData ] = useState<Array<Validator>>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  useEffect(() => {
    async function fetchStakers() {
      try {
        setLoading(true);
        const query = JSON.stringify({
          operationName: 'Stakers',
          query: `
            query Stakers {
              stakers {
                id
                stakerAddress
                isOffline
                isCheater
                isActive
                createdTime
                stake
                totalStake
                delegatedMe
                downtime
                stakerInfo {
                  name
                  website
                  contact
                  logoUrl
                }
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

        const fetchEpochQuery = JSON.stringify({
          operationName: 'EpochById',
          variables: {
            id: '0x336',
          },
          query: `query EpochById($id: Long) {
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
          }`,
        });

        const fetchEpochResponse = await fetch(GRAPHQL_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: fetchEpochQuery,
        });

        if (!response.ok || !fetchEpochResponse?.ok) {
          throw new Error('Fetching stakers failed');
        }

        const result = (await response.json()) as GetStakerReponse;
        const fetchEpochResult =
          (await fetchEpochResponse.json()) as GetEpochResponse;

        const stakers: Array<Validator> = [];

        result?.data?.stakers?.map((e: SingleStakerReponse) => {
          stakers.push({
            id: e?.id,
            address: {
              ens_domain_name: null,
              hash: e?.stakerAddress,
              implementations: null,
              is_contract: false,
              is_verified: null,
              private_tags: null,
              watchlist_names: null,
              public_tags: null,
              name: null,
            },
            staker_name:
              e?.stakerInfo?.name ?? formatUnits(hexToBigInt(e?.id), 0),
            total_rwa_staked: Number(
              formatUnits(hexToBigInt(e?.totalStake), 18),
            ).toFixed(2),
            total_rwa_delegated: Number(
              formatUnits(hexToBigInt(e?.delegatedMe), 18),
            ).toFixed(2),
            total_rwa_self_staked: Number(
              formatUnits(hexToBigInt(e?.stake), 18),
            ).toFixed(2),
            state: e?.isActive ? 'active' : 'inactive',
            blocks_validated_count: 0,
            total_fee_reward: '0',
          });
        });

        // Add fee rewards to validators
        stakers.forEach((staker) => {
          const totalFeeReward =
            fetchEpochResult?.data?.epoch?.actualValidatorRewards.find(
              (reward) =>
                Number(reward.id) ===
                hexToNumber(staker.id as unknown as `0x${ string }`),
            )?.totalReward ?? '0';
          staker.total_fee_reward = Number(
            formatUnits(BigInt(totalFeeReward), 18),
          ).toFixed(2);
        });

        setData(stakers);
      } catch (error: unknown) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStakers();
  }, [ GRAPHQL_SERVER_URL ]);

  return { data, loading, error };
}
