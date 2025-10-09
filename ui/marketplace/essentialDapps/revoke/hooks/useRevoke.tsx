import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';
import { useAccount, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

import type { AllowanceType } from '../lib/types';

import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import * as mixpanel from 'lib/mixpanel/index';
import { toaster } from 'toolkit/chakra/toaster';

export default function useRevoke(approval: AllowanceType, chainId: number) {
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  const [ txHash, setTxHash ] = useState<`0x${ string }` | undefined>();
  const receipt = useWaitForTransactionReceipt({ hash: txHash, chainId });

  useEffect(() => {
    switch (receipt.status) {
      case 'pending':
        break;

      case 'success': {
        queryClient.refetchQueries({ queryKey: [ 'revoke:approvals' ] });
        Promise.resolve().then(() => {
          toaster.success({
            title: 'Success',
            description: 'Approval revoked successfully.',
          });
        });
        setTxHash(undefined);
        break;
      }

      case 'error': {
        Promise.resolve().then(() => {
          toaster.error({
            title: 'Error',
            description: 'Failed to revoke approval.',
          });
        });
        setTxHash(undefined);
        break;
      }
    }
  }, [
    receipt.status,
    queryClient,
  ]);

  const revoke = useCallback(async() => {
    try {
      if (!userAddress) return;

      await switchChainAsync({ chainId });

      const activityResponse = await trackTransaction(userAddress, approval.address, String(chainId));

      const isErc20 = approval.type === 'ERC-20';

      const hash = await writeContractAsync({
        account: userAddress,
        address: approval.address,
        abi: isErc20 ? ERC20Artifact.abi : NftArtifact.abi,
        functionName: isErc20 ? 'approve' : 'setApprovalForAll',
        args: [ approval.spender, isErc20 ? 0 : false ],
        chainId,
      });
      setTxHash(hash);

      mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, {
        Action: 'Send Transaction',
        Address: userAddress,
        AppId: 'revoke',
        Source: 'Essential dapps',
        ChainId: String(chainId),
      });

      if (activityResponse?.token) {
        await trackTransactionConfirm(hash, activityResponse.token);
      }
    } catch (_error) {
      toaster.error({
        title: 'Error',
        description: (_error as Error)?.message || 'Something went wrong. Try again later.',
      });
    }
  }, [
    approval,
    userAddress,
    writeContractAsync,
    switchChainAsync,
    chainId,
    trackTransaction,
    trackTransactionConfirm,
  ]);

  return {
    revoke,
    isLoading: Boolean(txHash) && receipt.status === 'pending',
  };
}
