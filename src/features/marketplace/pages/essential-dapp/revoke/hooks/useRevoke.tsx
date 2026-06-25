// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import type { PublicClient } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useWriteContract, useSwitchChain, usePublicClient } from 'wagmi';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import useRewardsActivity from 'src/features/rewards/hooks/useRewardsActivity';

import * as mixpanel from 'src/services/mixpanel';

import { toaster } from 'src/toolkit/chakra/toaster';

import { getRevokeContractCall } from '../lib/revokeContractCall';

export default function useRevoke(chain?: EssentialDappsChainConfig) {
  const { address: userAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();
  const publicClient = usePublicClient({ chainId: chain?.id ? Number(chain.id) : undefined }) as PublicClient | undefined;

  return useCallback(async(approval: AllowanceType) => {
    try {
      if (!userAddress) return;
      if (!chain?.id) throw new Error('Chain not found');

      await switchChainAsync({ chainId: Number(chain?.id) });

      const activityResponse = await trackTransaction(userAddress, approval.address, chain?.id);

      const contractCall = getRevokeContractCall(approval);

      const hash = await writeContractAsync({
        account: userAddress,
        address: approval.address,
        ...contractCall,
        chainId: Number(chain?.id),
      });

      mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, {
        Action: 'Send Transaction',
        Address: userAddress,
        AppId: 'revoke',
        Source: 'Essential dapps',
        ChainId: chain?.id,
      });

      if (activityResponse?.token) {
        await trackTransactionConfirm(hash, activityResponse.token);
      }

      if (!publicClient) {
        throw new Error('Public client not found');
      }

      const receipt = await waitForTransactionReceipt(publicClient, { hash });

      if (receipt.status === 'reverted') {
        throw new Error('Failed to revoke approval.');
      }

      toaster.success({
        title: 'Success',
        meta: {
          renderDescription: () => (
            <Flex direction="column">
              <Text>Approval revoked successfully.</Text>
              <TxEntity
                hash={ hash }
                text="View transaction"
                link={{ external: true }}
                noCopy
                noIcon
                chain={ chain }
              />
            </Flex>
          ),
        },
      });

      return true;

    } catch (error) {
      toaster.error({
        title: 'Error',
        description:
          (error as { shortMessage?: string })?.shortMessage ||
          (error as Error)?.message ||
          'Something went wrong. Try again later.',
      });

      return false;
    }
  }, [
    userAddress,
    writeContractAsync,
    switchChainAsync,
    trackTransaction,
    trackTransactionConfirm,
    publicClient,
    chain,
  ]);
}
