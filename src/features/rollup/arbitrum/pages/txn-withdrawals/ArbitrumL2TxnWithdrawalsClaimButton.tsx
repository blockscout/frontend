// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useSendTransaction, useSwitchChain } from 'wagmi';

import type { operations, schemas } from '@blockscout/api-types';

import useApiFetch from 'src/api/hooks/useApiFetch';
import { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { ResourceError } from 'src/api/resources';

import Web3Boundary from 'src/features/connect-wallet/components/Web3Boundary';
import useWallet from 'src/features/connect-wallet/hooks/useWallet';

import config from 'src/config';
import getErrorMessage from 'src/shared/errors/get-error-message';
import getErrorObjPayload from 'src/shared/errors/get-error-obj-payload';
import getErrorProp from 'src/shared/errors/get-error-prop';
import capitalizeFirstLetter from 'src/shared/texts/capitalize-first-letter';

import { Button } from 'src/toolkit/chakra/button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { toaster } from 'src/toolkit/chakra/toaster';

import ArbitrumL2TxnWithdrawalsClaimTx from './ArbitrumL2TxnWithdrawalsClaimTx';

const rollupFeature = config.features.rollup;

interface Props {
  messageId: number;
  txHash: string | undefined;
  completionTxHash?: string;
  isLoading?: boolean;
}

const ArbitrumL2TxnWithdrawalsClaimButtonContent = ({ messageId, txHash, completionTxHash, isLoading: isDataLoading }: Props) => {
  const [ isPending, setIsPending ] = React.useState(false);
  const [ claimTxHash, setClaimTxHash ] = React.useState<string | undefined>(completionTxHash);
  const apiFetch = useApiFetch();

  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const queryClient = useQueryClient();

  const sendClaimTx = React.useCallback(async() => {

    if (!rollupFeature.isEnabled) {
      return;
    }

    try {
      setIsPending(true);

      const response = await apiFetch<'core:arbitrum_l2_message_claim', schemas['ArbitrumClaimMessage'], ResourceError<unknown>>(
        'core:arbitrum_l2_message_claim',
        { pathParams: { id: messageId.toString() },
        });

      if ('calldata' in response) {
        await switchChainAsync({ chainId: Number(rollupFeature.parentChain.id) });

        const hash = await sendTransactionAsync({
          data: response.calldata as `0x${ string }`,
          to: response.outbox_address_hash as `0x${ string }`,
        });

        setClaimTxHash(hash);
      }
    } catch (error) {
      const apiError = getErrorObjPayload<{ message: string }>(error);
      const message = capitalizeFirstLetter(apiError?.message || getErrorProp(error, 'shortMessage') || getErrorMessage(error) || 'Something went wrong');
      toaster.error({
        title: 'Error',
        description: message,
      });
      setIsPending(false);
    }
  }, [ apiFetch, messageId, sendTransactionAsync, switchChainAsync ]);

  const web3Wallet = useWallet({ source: 'Smart contracts', onConnect: sendClaimTx });

  const handleClaimClick = React.useCallback(async() => {
    if (!web3Wallet.address) {
      web3Wallet.connect();
    } else {
      sendClaimTx();
    }
  }, [ sendClaimTx, web3Wallet ]);

  const handleSuccess = React.useCallback(() => {
    queryClient.setQueryData(
      getResourceKey('core:arbitrum_l2_txn_withdrawals', { pathParams: { hash: txHash } }),
      (prevData: operations['ArbitrumController.withdrawals']['json'] | undefined) => {
        if (!prevData) {
          return;
        }

        const newItems = prevData.items.map(item => item.id === messageId ? { ...item, status: 'relayed' } : item);

        return {
          ...prevData,
          items: newItems,
        };
      });
    setIsPending(false);
  }, [ messageId, queryClient, txHash ]);

  const handleError = React.useCallback((error: Error) => {
    toaster.error({
      title: 'Error',
      description: error.message,
    });
    setIsPending(false);
  }, [ ]);

  if (claimTxHash) {
    return (
      <ArbitrumL2TxnWithdrawalsClaimTx
        isPending={ isPending }
        hash={ claimTxHash }
        onSuccess={ handleSuccess }
        onError={ handleError }
      />
    );
  }

  const isLoading = isPending || web3Wallet.isOpen;

  return (
    <Skeleton loading={ isDataLoading }>
      <Button
        size="sm"
        variant="outline"
        onClick={ handleClaimClick }
        loading={ isLoading }
        loadingText="Claim"
      >
        Claim
      </Button>
    </Skeleton>
  );
};

// The claim flow drives wagmi hooks (send tx / switch chain) and the receipt child, so the button lives
// in a wallet island. It renders in the withdrawals list on page load, so the fallback keeps the claim
// button visible in a loading state (matching its data-loading skeleton) while the runtime loads.
const ArbitrumL2TxnWithdrawalsClaimButton = (props: Props) => (
  <Web3Boundary
    fallback={ <Button size="sm" variant="outline" loadingSkeleton>Claim</Button> }
  >
    <ArbitrumL2TxnWithdrawalsClaimButtonContent { ...props }/>
  </Web3Boundary>
);

export default React.memo(ArbitrumL2TxnWithdrawalsClaimButton);
