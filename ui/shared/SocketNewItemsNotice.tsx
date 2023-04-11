import { Alert, Link, Text, chakra, useTheme, useColorModeValue } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import React from 'react';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit';
  children?: (props: InjectedProps) => JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
}

const SocketNewItemsNotice = ({ children, className, url, num, alert, type = 'transaction' }: Props) => {
  const theme = useTheme();

  const alertContent = (() => {
    if (alert) {
      return alert;
    }

    let name;

    switch (type) {
      case 'token_transfer':
        name = 'token transfer';
        break;
      case 'deposit':
        name = 'deposit';
        break;
      default:
        name = 'transaction';
        break;
    }

    if (!num) {
      return `scanning new ${ name }s...`;
    }

    return (
      <>
        <Link href={ url }>{ num } more { name }{ num > 1 ? 's' : '' }</Link>
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
      color={ useColorModeValue('blackAlpha.800', 'whiteAlpha.800') }
    >
      { alertContent }
    </Alert>
  );

  return children ? children({ content }) : content;
};

export default chakra(SocketNewItemsNotice);
