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

import getErrorCause from 'lib/errors/getErrorCause';
import { toaster } from 'toolkit/chakra/toaster';

interface GtagEventParams {
  walletAddress: string;
  chainId: string;
}

declare global {
  interface Window {
    gtag: (command: 'event', action: string, params?: GtagEventParams) => void;
  }
}

export default function useRevoke(approval: AllowanceType, chainId: number) {
  const connectedChainId = useChainId();
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  const [ txHash, setTxHash ] = useState<`0x${ string }` | undefined>();
  const [ gtagEventParams, setGtagEventParams ] = useState<GtagEventParams>();

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
        if (typeof window !== 'undefined' && window.gtag && gtagEventParams) {
          window.gtag('event', 'revoke', gtagEventParams);
        }
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
    gtagEventParams,
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
        const hash = await writeContractAsync(simulationResult.request);
        setTxHash(hash);
        setGtagEventParams({
          walletAddress: `address_${ userAddress }`,
          chainId,
        });
      }
    } catch (_error) {
      const cause = getErrorCause(_error as Error);
      toaster.error({
        title: 'Error',
        description: cause?.shortMessage || 'Something went wrong. Try again later.',
      });
    }
  }, [
    simulationResult,
    writeContractAsync,
    switchChainAsync,
    connectedChainId,
    chainId,
  ]);

  return {
    revoke,
    isLoading: !simulationResult?.request || (Boolean(txHash) && receipt.status === 'pending'),
    isError: Boolean(error),
  };
}
