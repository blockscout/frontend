import { Box, chakra, Link, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useWaitForTransaction } from 'wagmi';

import type { ContractMethodWriteResult } from './types';

import link from 'lib/link/link';

interface Props {
  result: ContractMethodWriteResult;
  onSettle: () => void;
}

const ContractWriteResult = ({ result, onSettle }: Props) => {
  const txHash = result && 'hash' in result ? result.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransaction({
    hash: txHash,
  });

  React.useEffect(() => {
    if (txInfo.status !== 'loading') {
      onSettle();
    }
  }, [ onSettle, txInfo.status ]);

  // eslint-disable-next-line no-console
  console.log('__>__ txInfo', txInfo);

  if (!result) {
    return null;
  }

  const isErrorResult = 'message' in result;

  const txLink = (
    <Link href={ link('tx', { id: txHash }) }>View transaction details</Link>
  );

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
      color={ txInfo.status === 'error' || isErrorResult ? 'red.600' : undefined }
    >
      { content }
    </Box>
  );
};

export default React.memo(ContractWriteResult);
