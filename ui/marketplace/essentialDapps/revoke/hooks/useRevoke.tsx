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

import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
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

// async function registerActivity(chainId: string, from: string, to: string) {
//   const response = await fetch(
//     `${config.rewardsService.apiUrl}/api/v1/activity/track/transaction`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         chain_id: chainId,
//         from_address: from,
//         to_address: to,
//       }),
//     },
//   );
//   if (response.ok) {
//     const { token } = (await response.json()) as { token: string };
//     return token;
//   }
// }

// function confirmActivity(token: string, txHash: string) {
//   return fetch(
//     `${config.rewardsService.apiUrl}/api/v1/activity/track/transaction/confirm`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         tx_hash: txHash,
//         token,
//       }),
//     },
//   );
// }

export default function useRevoke(approval: AllowanceType, selectedNetwork: number) {
  const connectedNetwork = useChainId();
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  const [ txHash, setTxHash ] = useState<`0x${ string }` | undefined>();
  // const [ activityToken, setActivityToken ] = useState<string | undefined>();
  const [ gtagEventParams, setGtagEventParams ] = useState<GtagEventParams>();

  const isErc20 = approval.type === 'ERC-20';

  const { data: simulationResult, error } = useSimulateContract({
    account: userAddress,
    address: approval.address,
    abi: isErc20 ? ERC20Artifact.abi : NftArtifact.abi,
    functionName: isErc20 ? 'approve' : 'setApprovalForAll',
    args: [ approval.spender, isErc20 ? 0 : false ],
    chainId: selectedNetwork,
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: selectedNetwork,
  });

  useEffect(() => {
    if (!txHash) return;

    if (isConfirmed) {
      // if (activityToken) {
      //   confirmActivity(activityToken, txHash);
      // }

      if (typeof window !== 'undefined' && window.gtag && gtagEventParams) {
        window.gtag('event', 'revoke', gtagEventParams);
      }

      queryClient.refetchQueries({ queryKey: [ 'revoke:approvals' ] });

      toaster.success({
        title: 'Success',
        description: 'Approval revoked successfully.',
      });

      setTxHash(undefined);
      // setActivityToken(undefined);
    } else if (isFailed) {
      toaster.error({
        title: 'Error',
        description: 'Failed to revoke approval.',
      });
    }

    setTxHash(undefined);
    // setActivityToken(undefined);
  }, [
    isConfirmed,
    isFailed,
    queryClient,
    txHash,
    // activityToken,
    gtagEventParams,
  ]);

  const revoke = useCallback(async() => {
    try {
      if (!selectedNetwork) return;

      if (connectedNetwork !== selectedNetwork) {
        await switchChainAsync({ chainId: selectedNetwork });
      }

      if (simulationResult?.request) {
        const chainId = simulationResult.request.chainId.toString();
        const userAddress = simulationResult.request.account?.address || '';

        // const activityToken = await registerActivity(
        //   chainId,
        //   userAddress,
        //   simulationResult.request.address,
        // );
        // setActivityToken(activityToken);

        const hash = await writeContractAsync(simulationResult.request);
        setTxHash(hash);
        setGtagEventParams({
          walletAddress: `address_${ userAddress }`,
          chainId,
        });
      }
    } catch (_error) {
      const apiError = getErrorObjPayload<{ message: string }>(_error);
      toaster.error({
        title: 'Error',
        description:
          apiError?.message ||
          getErrorMessage(_error) ||
          'Something went wrong. Try again later.',
      });
      throw _error;
    }
  }, [
    simulationResult,
    writeContractAsync,
    switchChainAsync,
    connectedNetwork,
    selectedNetwork,
  ]);

  return {
    revoke,
    isLoading: !simulationResult?.request || isConfirming,
    isError: Boolean(error),
  };
}
