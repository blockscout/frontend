import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';
import {
  useAccount,
  useSimulateContract,
  useWriteContract,
  useSwitchChain,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi';

import type { AllowanceType } from '../lib/types';

import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import { toaster } from 'toolkit/chakra/toaster';

export default function useRevoke(approval: AllowanceType, chainId: number) {
  const connectedChainId = useChainId();
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  const [ txHash, setTxHash ] = useState<`0x${ string }` | undefined>();

  const isErc20 = approval.type === 'ERC-20';

  const { data: simulationResult, error } = useSimulateContract({
    account: userAddress,
    address: approval.address,
    abi: isErc20 ? ERC20Artifact.abi : NftArtifact.abi,
    functionName: isErc20 ? 'approve' : 'setApprovalForAll',
    args: [ approval.spender, isErc20 ? 0 : false ],
    chainId,
  });

  const receipt = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
  });

  useEffect(() => {
    switch (receipt.status) {
      case 'pending':
        break;

      case 'success': {
        queryClient.refetchQueries({ queryKey: [ 'revoke:approvals' ] });
        toaster.success({
          title: 'Success',
          description: 'Approval revoked successfully.',
        });
        setTxHash(undefined);
        break;
      }

      case 'error': {
        toaster.error({
          title: 'Error',
          description: 'Failed to revoke approval.',
        });
        setTxHash(undefined);
        break;
      }
    }
  }, [
    receipt,
    queryClient,
  ]);

  const revoke = useCallback(async() => {
    try {
      if (!chainId) return;

      if (connectedChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      if (simulationResult?.request) {
        const chainId = simulationResult.request.chainId.toString();
        const userAddress = simulationResult.request.account?.address || '';
        const activityResponse = await trackTransaction(userAddress, simulationResult.request.address, chainId);
        const hash = await writeContractAsync(simulationResult.request);
        setTxHash(hash);
        if (activityResponse?.token) {
          await trackTransactionConfirm(hash, activityResponse.token);
        }
      }
    } catch (_error) {
      toaster.error({
        title: 'Error',
        description: (_error as Error)?.message || 'Something went wrong. Try again later.',
      });
    }
  }, [
    simulationResult,
    writeContractAsync,
    switchChainAsync,
    connectedChainId,
    chainId,
    trackTransaction,
    trackTransactionConfirm,
  ]);

  return {
    revoke,
    isLoading: !simulationResult?.request || (Boolean(txHash) && receipt.status === 'pending'),
    isError: Boolean(error),
  };
}
