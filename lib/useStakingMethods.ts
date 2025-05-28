import { useState, useCallback } from 'react';
import { parseEther, getContract } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';

import { getEnvValue } from 'configs/app/utils';

import StakingABI from './contracts/abi/SFC.json';

const SFC_ADDRESS = getEnvValue('NEXT_PUBLIC_SFC_ADDRESS') as string;
const ERR_MSG = 'Transaction failed';

type ActionType = 'claim' | 'unstake' | 'delegate' | 'withdraw';

interface LoadingStates {
  [ validatorId: number ]: {
    [ action in ActionType ]?: boolean;
  };
}

interface StakingMethodsResult {
  delegate: (validatorId: number, amount: string) => Promise<string | typeof ERR_MSG>;
  undelegate: (validatorId: number, amount: string) => Promise<string | typeof ERR_MSG>;
  claimRewards: (validatorId: number) => Promise<string | typeof ERR_MSG>;
  withdraw: (validatorId: number, wrId: number) => Promise<string | typeof ERR_MSG>;
  isLoading: (validatorId: number, action: ActionType) => boolean;
  error: string | null;
  success: string | null;
  clearMessages: () => void;
  isReady: boolean; // Add this to check if clients are ready
}

export function useStakingMethods(): StakingMethodsResult {
  const [ loadingStates, setLoadingStates ] = useState<LoadingStates>({});
  const [ error, setError ] = useState<string | null>(null);
  const [ success, setSuccess ] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Check if both clients are available
  const isReady = Boolean(walletClient && publicClient);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const setValidatorLoading = useCallback((validatorId: number, action: ActionType, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [ validatorId ]: {
        ...prev[ validatorId ],
        [ action ]: isLoading,
      },
    }));
  }, []);

  const isLoading = useCallback((validatorId: number, action: ActionType): boolean => {
    return loadingStates[ validatorId ]?.[ action ] || false;
  }, [ loadingStates ]);

  const setErrorMsg = useCallback((message?: string) => {
    setError(message || 'An error occurred');
    setSuccess(null);
  }, []);

  const setSuccessMsg = useCallback((txHash: string) => {
    setSuccess(txHash);
    setError(null);
  }, []);

  const safeWrite = useCallback(async(contractCall: Promise<string>) => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      if (!publicClient) {
        throw new Error('Public client not available');
      }

      const hash = await contractCall as `0x${ string }`;
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return [ { hash, receipt } ];
    } catch (error: unknown) {
      // return;
      // console.error('Error during safeWrite:', error);

      const err = error as { message?: string; code?: number };

      // Handle user rejection specifically
      if (err?.message?.includes('User rejected') ||
          err?.message?.includes('User denied') ||
          err?.message?.includes('rejected the request') ||
          err?.code === 4001) {
        throw new Error('Transaction cancelled by user');
      }

      // Handle other common errors
      if (err?.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction');
      }

      if (err?.message?.includes('gas')) {
        throw new Error('Transaction failed due to gas issues');
      }

      throw error;
    }
  }, [ walletClient, publicClient ]);

  const _getContract = useCallback(() => {
    if (!walletClient || !publicClient) {
      throw new Error('Wallet or public client not available');
    }

    return getContract({
      address: SFC_ADDRESS as `0x${ string }`,
      abi: StakingABI,
      client: {
        'public': publicClient,
        wallet: walletClient,
      },
    });
  }, [ walletClient, publicClient ]);

  const toBigNumberFloat = useCallback((value: string): bigint => {
    try {
      return parseEther(value);
    } catch (error) {
      // console.error('Error converting to BigNumber:', error);
      return BigInt(0);
    }
  }, []);

  const delegate = useCallback(async(validatorId: number, amount: string): Promise<string | typeof ERR_MSG> => {
    // Early return if clients not ready
    if (!isReady) {
      setErrorMsg('Wallet or network not connected');
      return ERR_MSG;
    }

    setValidatorLoading(validatorId, 'delegate', true);
    clearMessages();

    const delegateAmount = toBigNumberFloat(amount);

    try {
      const contract = _getContract();

      const [ tx ] = await safeWrite(
        contract.write.delegate([ validatorId ], {
          value: delegateAmount,
        }),
      );

      setValidatorLoading(validatorId, 'delegate', false);
      setSuccessMsg(tx.hash);
      return tx.hash;
    } catch (err: unknown) {
      // console.error('Delegate error:', err);

      const error = err as { message?: string };

      // Handle specific error messages
      if (error?.message?.includes('Transaction cancelled by user')) {
        setErrorMsg('Transaction was cancelled');
      } else if (error?.message?.includes('Insufficient funds')) {
        setErrorMsg('Insufficient funds for this transaction');
      } else if (error?.message?.includes('gas')) {
        setErrorMsg('Transaction failed due to gas issues');
      } else {
        setErrorMsg('Failed to delegate tokens');
      }

      setValidatorLoading(validatorId, 'delegate', false);
      return ERR_MSG;
    }
  }, [ isReady, setValidatorLoading, clearMessages, toBigNumberFloat, _getContract, safeWrite, setSuccessMsg, setErrorMsg ]);

  const undelegate = useCallback(async(validatorId: number, amount: string): Promise<string | typeof ERR_MSG> => {
    // Early return if clients not ready
    if (!isReady) {
      setErrorMsg('Wallet or network not connected');
      return ERR_MSG;
    }

    setValidatorLoading(validatorId, 'unstake', true);
    clearMessages();

    try {
      const contract = _getContract();
      const undelegateAmount = toBigNumberFloat(amount);

      const [ tx ] = await safeWrite(
        contract.write.undelegate([ validatorId, undelegateAmount ]),
      );

      setSuccessMsg(tx.hash);
      setValidatorLoading(validatorId, 'unstake', false);
      return tx.hash;
    } catch (err: unknown) {
      // console.error('Undelegate error:', err);

      const error = err as { message?: string };

      // Handle specific error messages
      if (error?.message?.includes('Transaction cancelled by user')) {
        setErrorMsg('Transaction was cancelled');
      } else if (error?.message?.includes('Insufficient funds')) {
        setErrorMsg('Insufficient funds for this transaction');
      } else if (error?.message?.includes('gas')) {
        setErrorMsg('Transaction failed due to gas issues');
      } else {
        setErrorMsg('Failed to undelegate tokens');
      }

      setValidatorLoading(validatorId, 'unstake', false);
      return ERR_MSG;
    }
  }, [ isReady, setValidatorLoading, clearMessages, _getContract, toBigNumberFloat, safeWrite, setSuccessMsg, setErrorMsg ]);

  const claimRewards = useCallback(async(validatorId: number): Promise<string | typeof ERR_MSG> => {
    // Early return if clients not ready
    if (!isReady) {
      setErrorMsg('Wallet or network not connected');
      return ERR_MSG;
    }

    setValidatorLoading(validatorId, 'claim', true);
    clearMessages();

    try {
      const contract = _getContract();

      const [ tx ] = await safeWrite(
        contract.write.claimRewards([ validatorId ]),
      );

      setSuccessMsg(tx.hash);
      setValidatorLoading(validatorId, 'claim', false);
      return tx.hash;
    } catch (err: unknown) {
      // console.error('Claim rewards error:', err);

      const error = err as { message?: string };

      // Handle specific error messages
      if (error?.message?.includes('Transaction cancelled by user')) {
        setErrorMsg('Transaction was cancelled');
      } else if (error?.message?.includes('Insufficient funds')) {
        setErrorMsg('Insufficient funds for this transaction');
      } else if (error?.message?.includes('gas')) {
        setErrorMsg('Transaction failed due to gas issues');
      } else {
        setErrorMsg('Failed to claim rewards');
      }

      setValidatorLoading(validatorId, 'claim', false);
      return ERR_MSG;
    }
  }, [ isReady, setValidatorLoading, clearMessages, _getContract, safeWrite, setSuccessMsg, setErrorMsg ]);

  const withdraw = useCallback(async(validatorId: number, wrId: number): Promise<string | typeof ERR_MSG> => {
    // Early return if clients not ready
    if (!isReady) {
      setErrorMsg('Wallet or network not connected');
      return ERR_MSG;
    }

    setValidatorLoading(validatorId, 'withdraw', true);
    clearMessages();

    try {
      const contract = _getContract();

      const [ tx ] = await safeWrite(
        contract.write.withdraw([ validatorId, wrId ]),
      );

      setSuccessMsg(tx.hash);
      setValidatorLoading(validatorId, 'withdraw', false);
      return tx.hash;
    } catch (err: unknown) {
      // console.error('Withdraw error:', err);

      const error = err as { message?: string };

      // Handle specific error messages
      if (error?.message?.includes('Transaction cancelled by user')) {
        setErrorMsg('Transaction was cancelled');
      } else if (error?.message?.includes('Insufficient funds')) {
        setErrorMsg('Insufficient funds for this transaction');
      } else if (error?.message?.includes('gas')) {
        setErrorMsg('Transaction failed due to gas issues');
      } else {
        setErrorMsg('Failed to withdraw');
      }

      setValidatorLoading(validatorId, 'withdraw', false);
      return ERR_MSG;
    }
  }, [ isReady, setValidatorLoading, clearMessages, _getContract, safeWrite, setSuccessMsg, setErrorMsg ]);

  return {
    delegate,
    undelegate,
    claimRewards,
    withdraw,
    isLoading,
    error,
    success,
    clearMessages,
    isReady, // Expose this so components can check readiness
  };
}
