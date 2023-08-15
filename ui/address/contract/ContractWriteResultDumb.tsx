import { Box, chakra, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { ContractMethodWriteResult } from './types';

import { route } from 'nextjs-routes';

import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  result: ContractMethodWriteResult;
  onSettle: () => void;
  txInfo: {
    status: 'loading' | 'success' | 'error' | 'idle';
    error: Error | null;
  };
}

const ContractWriteResultDumb = ({ result, onSettle, txInfo }: Props) => {
  const txHash = result && 'hash' in result ? result.hash : undefined;

  React.useEffect(() => {
    if (txInfo.status !== 'loading') {
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

      case 'loading': {
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
      pl={ 3 }
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

export default React.memo(ContractWriteResultDumb);
