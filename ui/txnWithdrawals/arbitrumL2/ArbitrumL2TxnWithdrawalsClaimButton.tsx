import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSendTransaction } from 'wagmi';

import type { ArbitrumL2MessageClaimResponse } from 'types/api/arbitrumL2';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorProp from 'lib/errors/getErrorProp';
import useToast from 'lib/hooks/useToast';
import useWallet from 'lib/web3/useWallet';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

interface Props {
  messageId: number;
}

const ArbitrumL2TxnWithdrawalsClaimButton = ({ messageId }: Props) => {
  const [ isPending, setIsPending ] = React.useState(false);
  const [ txHash, setTxHash ] = React.useState<`0x${ string }` | undefined>(undefined);
  const apiFetch = useApiFetch();
  const toast = useToast();

  const { sendTransactionAsync } = useSendTransaction();

  const sendClaimTx = React.useCallback(async() => {
    try {
      setIsPending(true);

      const response = await apiFetch<'arbitrum_l2_message_claim', ArbitrumL2MessageClaimResponse, ResourceError<unknown>>(
        'arbitrum_l2_message_claim',
        { pathParams: { id: messageId.toString() },
        });

      if ('calldata' in response) {
        const hash = await sendTransactionAsync({
          data: response.calldata as `0x${ string }`,
          to: response.outbox_address as `0x${ string }`,
        });

        setTxHash(hash);
      }
    } catch (error) {
      const apiError = getErrorObjPayload<{ message: string }>(error);
      toast({
        status: 'error',
        title: 'Error',
        description: apiError?.message || getErrorProp(error, 'shortMessage') || getErrorMessage(error) || 'Something went wrong',
      });
    } finally {
      setIsPending(false);
    }
  }, [ apiFetch, messageId, sendTransactionAsync, toast ]);

  const web3Wallet = useWallet({ source: 'Smart contracts', onConnect: sendClaimTx });

  const handleClaimClick = React.useCallback(async() => {
    if (!web3Wallet.address) {
      web3Wallet.connect();
    } else {
      sendClaimTx();
    }
  }, [ sendClaimTx, web3Wallet ]);

  if (txHash) {
    return <TxEntityL1 hash={ txHash } noIcon maxW="160px"/>;
  }

  const isLoading = isPending || web3Wallet.isOpen;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={ handleClaimClick }
      isLoading={ isLoading }
      loadingText="Claim"
    >
      Claim
    </Button>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsClaimButton);
