import { chakra, Spinner, Box } from '@chakra-ui/react';
import React from 'react';
import type { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';

import type { FormSubmitResultWalletClient } from '../types';

import { route } from 'nextjs-routes';

import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  result: FormSubmitResultWalletClient['result'];
  onSettle: () => void;
}

const ContractMethodResultWalletClient = ({ result, onSettle }: Props) => {
  const txHash = result && 'hash' in result ? result.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return <ContractMethodResultWalletClientDumb result={ result } onSettle={ onSettle } txInfo={ txInfo }/>;
};

export interface PropsDumb {
  result: FormSubmitResultWalletClient['result'];
  onSettle: () => void;
  txInfo: UseWaitForTransactionReceiptReturnType;
}

export const ContractMethodResultWalletClientDumb = ({ result, onSettle, txInfo }: PropsDumb) => {
  const txHash = result && 'hash' in result ? result.hash : undefined;

  React.useEffect(() => {
    if (txInfo.status !== 'pending') {
      onSettle();
    }
  }, [ onSettle, txInfo.status ]);

  if (!result) {
    return null;
  }

  const isErrorResult = 'message' in result;

  const txLink = txHash ? (
    <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: txHash } }) }>View transaction details</LinkInternal>
  ) : null;

  const content = (() => {
    if (isErrorResult) {
      return (
        <>
          <span>Error: </span>
          <span>{ result.message }</span>
        </>
      );
    }

    switch (txInfo.status) {
      case 'success': {
        return (
          <>
            <span>Transaction has been confirmed. </span>
            { txLink }
          </>
        );
      }

      case 'pending': {
        return (
          <>
            <Spinner size="sm" mr={ 3 }/>
            <chakra.span verticalAlign="text-bottom">
              { 'Waiting for transaction\'s confirmation. ' }
              { txLink }
            </chakra.span>
          </>
        );
      }

      case 'error': {
        return (
          <>
            <span>Error: </span>
            <span>{ txInfo.error ? txInfo.error.message : 'Something went wrong' } </span>
            { txLink }
          </>
        );
      }
    }
  })();

  return (
    <Box
      fontSize="sm"
      mt={ 3 }
      alignItems="center"
      whiteSpace="pre-wrap"
      wordBreak="break-all"
      color={ txInfo.status === 'error' || isErrorResult ? 'error' : undefined }
    >
      { content }
    </Box>
  );
};

export default React.memo(ContractMethodResultWalletClient);
