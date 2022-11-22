import { Alert, Spinner, Text, Link, useColorModeValue, useTheme } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
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
        <Link href={ txsUrl }>View in list</Link>
      </>
    );
  }

  const theme = useTheme();
  return (
    <Alert
      className={ className }
      status="warning"
      p={ 4 }
      fontWeight={ 400 }
      bgColor={ useColorModeValue('orange.50', transparentize('orange.200', 0.16)(theme)) }
      borderBottomRadius={ 0 }
    >
      { content }
    </Alert>
  );

};

export default LatestTxsNotice;
