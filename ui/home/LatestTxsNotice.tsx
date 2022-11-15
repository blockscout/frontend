import { Alert, Spinner, Text, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import link from 'lib/link/link';

interface Props {
  className?: string;
}

const LatestTxsNotice = ({ className }: Props) => {
  const { num, socketAlert } = useNewTxsSocket();

  let content;

  if (socketAlert) {
    content = 'Connection is lost. Please reload page';
  } else if (!num) {
    content = (
      <>
        <Spinner size="sm" mr={ 3 }/>
        <Text>scanning new transactions ...</Text>
      </>
    );
  } else {
    const txsUrl = link('txs');
    content = (
      <>
        <Spinner size="sm" mr={ 3 }/>
        <Text as="span" whiteSpace="pre">+ { num } new transaction{ num > 1 ? 's' : '' }. </Text>
        <Link href={ txsUrl }>Show in list</Link>
      </>
    );
  }

  return (
    <Alert
      className={ className }
      status="warning"
      p={ 4 }
      fontWeight={ 400 }
      bgColor={ useColorModeValue('orange.50', 'rgba(251, 211, 141, 0.16)') }
      borderBottomRadius={ 0 }
    >
      { content }
    </Alert>
  );

};

export default LatestTxsNotice;
