import { chakra, Spinner, Box, Alert } from '@chakra-ui/react';
import React from 'react';
import type { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';

import type { FormSubmitResultWalletClient } from '../types';

import { route } from 'nextjs-routes';

import LinkInternal from 'ui/shared/links/LinkInternal';

interface Props {
  data: FormSubmitResultWalletClient['data'];
  onSettle: () => void;
}

const ContractMethodResultWalletClient = ({ data, onSettle }: Props) => {
  const txHash = data && 'hash' in data ? data.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return <ContractMethodResultWalletClientDumb data={ data } onSettle={ onSettle } txInfo={ txInfo }/>;
};

export interface PropsDumb {
  data: FormSubmitResultWalletClient['data'];
  onSettle: () => void;
  txInfo: UseWaitForTransactionReceiptReturnType;
}

export const ContractMethodResultWalletClientDumb = ({ data, onSettle, txInfo }: PropsDumb) => {
  const txHash = data && 'hash' in data ? data.hash : undefined;

  React.useEffect(() => {
    if (txInfo.status !== 'pending') {
      onSettle();
    }
  }, [ onSettle, txInfo.status ]);

  if (!data) {
    return null;
  }

  const isErrorResult = 'message' in data;

  const txLink = txHash ? (
    <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: txHash } }) }>View transaction details</LinkInternal>
  ) : null;

  const content = (() => {
    if (isErrorResult) {
      return (
        <Alert status="error">
          { data.message }
        </Alert>
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
          <Alert status="error" flexDir="column" alignItems="flex-start" rowGap={ 1 }>
            Error: { txInfo.error ? txInfo.error.message : 'Something went wrong' } { txLink }
          </Alert>
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
