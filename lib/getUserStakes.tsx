import BigNumber from 'bignumber.js';
import { useState, useEffect, useCallback } from 'react';
import { formatUnits, createPublicClient, http, getContract } from 'viem';

import { getEnvValue } from 'configs/app/utils';

import StakingABI from './contracts/abi/SFC.json';

interface UserStake {
  id: number;
  stakingName: string;
  validator: number;
  amount: string;
  rewards: string;
  action: string;
  claim: string;
}

interface FetchUserStakesResult {
  data: Array<UserStake>;
  totalStaked: string;
  totalRewards: string;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

interface Validator {
  status: string;
  deactivatedTime: string;
  deactivatedEpoch: string;
  receivedStake: string;
  createdEpoch: string;
  createdTime: string;
}

// Define the validator array type based on the contract structure
type ValidatorArray = [
  number, // status
  bigint, // deactivatedTime
  bigint, // deactivatedEpoch
  bigint, // receivedStake
  bigint, // createdEpoch
  bigint, // createdTime
];

const SFC_ADDRESS = getEnvValue('NEXT_PUBLIC_SFC_ADDRESS') as string;
const RPC_URL = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') as string;

function convertValidatorData(validatorArray: ValidatorArray): Validator {
  return {
    status: validatorArray[0] === 0 ? 'inactive' : 'active',
    deactivatedTime: validatorArray[1].toString(),
    deactivatedEpoch: validatorArray[2].toString(),
    receivedStake: validatorArray[3].toString(),
    createdEpoch: validatorArray[4].toString(),
    createdTime: validatorArray[5].toString(),
  };
}

export function useUserStakes(
  userAddress: string | null,
): FetchUserStakesResult {
  const [ data, setData ] = useState<Array<UserStake>>([]);
  const [ totalStaked, setTotalStaked ] = useState<string>('0');
  const [ totalRewards, setTotalRewards ] = useState<string>('0');
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>(null);

  const formatStakeAmount = (amount: bigint): string => {
    try {
      return parseFloat(formatUnits(amount, 18)).toFixed(2);
    } catch {
      return '0';
    }
  };

  const formatRewardsAmount = (amount: bigint): string => {
    try {
      return parseFloat(formatUnits(amount, 18)).toFixed(2);
    } catch {
      return '0';
    }
  };

  const fetchUserStakes = useCallback(async() => {
    // Check conditions but don't return early
    if (!userAddress || !SFC_ADDRESS || !RPC_URL) {
      setData([]);
      setTotalStaked('0');
      setTotalRewards('0');
      setLoading(false);
      setError(new Error('Missing userAddress, SFC_ADDRESS, or RPC_URL'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const publicClient = createPublicClient({
        transport: http(RPC_URL),
      });

      const contract = getContract({
        address: SFC_ADDRESS as `0x${ string }`,
        abi: StakingABI,
        client: publicClient,
      });

      const lastValidatorID = await contract.read.lastValidatorID();
      const lastValidatorNumber = Number(lastValidatorID);

      const stakes: Array<UserStake> = [];
      let totalStakeAmount = 0;
      let totalRewardAmount = 0;

      for (let i = 1; i <= lastValidatorNumber; i++) {
        try {
          const rawValidator = (await contract.read.getValidator([ i ])) as ValidatorArray;
          const validator: Validator = convertValidatorData(rawValidator);

          if (
            validator.status === 'active'
          ) {
            const stakeAmount = await contract.read.getStake([
              userAddress as `0x${ string }`,
              i,
            ]);

            const rewardAmount = await contract.read.pendingRewards([
              userAddress as `0x${ string }`,
              i,
            ]);

            const formattedStakeAmount = formatStakeAmount(stakeAmount as bigint);
            const formattedRewardAmount = formatRewardsAmount(rewardAmount as bigint);

            if (
              parseFloat(formattedStakeAmount) > 0 ||
              parseFloat(formattedRewardAmount) > 0
            ) {
              stakes.push({
                id: i,
                stakingName: 'RWA',
                validator: i,
                amount: formattedStakeAmount,
                rewards: formattedRewardAmount,
                action: 'unstake',
                claim: 'Claim rewards',
              });

              totalStakeAmount += parseFloat(formattedStakeAmount);
              totalRewardAmount += parseFloat(formattedRewardAmount);
            }
          }
        } catch (validatorError) {
          // eslint-disable-next-line no-console
          console.warn(`Error fetching data for validator ${ i }:`, validatorError);
        }
      }

      setData(stakes);
      setTotalStaked(BigNumber(totalStakeAmount).toFixed(2));
      setTotalRewards(BigNumber(totalRewardAmount).toFixed(2));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching user stakes:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [ userAddress ]);

  const refetch = useCallback(async() => {
    await fetchUserStakes();
  }, [ fetchUserStakes ]);

  // Initial fetch
  useEffect(() => {
    fetchUserStakes();
  }, [ fetchUserStakes ]);

  return {
    data,
    totalStaked,
    totalRewards,
    loading,
    error,
    refetch,
  };
}
