import { Alert, Box, Link } from '@chakra-ui/react';
import React from 'react';
import { useWaitForTransaction } from 'wagmi';

import link from 'lib/link/link';

interface Props {
  hash: `0x${ string }`;
}

const ContractWriteResult = ({ hash }: Props) => {
  const txInfo = useWaitForTransaction({
    hash,
  });

  // eslint-disable-next-line no-console
  console.log('__>__ txInfo', txInfo);

  return (
    <>
      <Alert status="info" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" flexDir="column" alignItems="flex-start">
        <Box>Tx hash: <Link href={ link('tx', { id: hash }) }>{ hash }</Link></Box>
        <Box>Status: { txInfo.status }</Box>
      </Alert>
      { txInfo.error && <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-all">{ txInfo.error.message }</Alert> }
    </>
  );
};

export default React.memo(ContractWriteResult);
