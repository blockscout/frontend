import { Alert, Link, Text, chakra, useTheme, useColorModeValue } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import React from 'react';

import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  children?: (props: InjectedProps) => JSX.Element;
  className?: string;
  url: string;
}

const TxsNewItemNotice = ({ children, className, url }: Props) => {
  const { num, socketAlert } = useNewTxsSocket();
  const theme = useTheme();

  const alertContent = (() => {
    if (socketAlert) {
      return socketAlert;
    }

    if (!num) {
      return 'scanning new transactions...';
    }

    return (
      <>
        <Link href={ url }>{ num } more transaction{ num > 1 ? 's' : '' }</Link>
        <Text whiteSpace="pre"> ha{ num > 1 ? 've' : 's' } come in</Text>
      </>
    );
  })();

  const content = (
    <Alert
      className={ className }
      status="warning"
      px={ 4 }
      py="6px"
      fontWeight={ 400 }
      fontSize="sm"
      bgColor={ useColorModeValue('orange.50', transparentize('orange.200', 0.16)(theme)) }
    >
      { alertContent }
    </Alert>
  );

  return children ? children({ content }) : content;
};

export default chakra(TxsNewItemNotice);
