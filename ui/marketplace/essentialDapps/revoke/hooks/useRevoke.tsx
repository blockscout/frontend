import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useCallback } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';

import type { AllowanceType } from 'types/client/revoke';

import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import * as mixpanel from 'lib/mixpanel/index';
import { toaster } from 'toolkit/chakra/toaster';

import createPublicClient from '../lib/createPublicClient';

export default function useRevoke() {
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  return useCallback(async(approval: AllowanceType, chainId: number) => {
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

      const publicClient = createPublicClient(String(chainId));
      if (!publicClient) {
        throw new Error('Public client not found');
      }

      const receipt = await waitForTransactionReceipt(publicClient, { hash });

      if (receipt.status === 'reverted') {
        throw new Error('Failed to revoke approval.');
      }

      toaster.success({
        title: 'Success',
        description: 'Approval revoked successfully.',
      });

      return true;

    } catch (error) {
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
      });

      return false;
    }
  }, [
    userAddress,
    writeContractAsync,
    switchChainAsync,
    trackTransaction,
    trackTransactionConfirm,
  ]);
}
