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
  const { address } = useWallet({ source: 'Smart contracts' });

  const { sendTransactionAsync } = useSendTransaction();

  const handleClaim = React.useCallback(async() => {
    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

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
  }, [ address, apiFetch, messageId, sendTransactionAsync, toast ]);

  if (txHash) {
    return <TxEntityL1 hash={ txHash } noIcon maxW="160px"/>;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={ handleClaim }
      isLoading={ isPending }
      loadingText="Claim"
    >
      Claim
    </Button>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsClaimButton);
