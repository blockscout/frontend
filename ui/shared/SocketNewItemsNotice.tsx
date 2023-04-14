import { Alert, Link, Text, chakra, useTheme, useColorModeValue, Skeleton } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import React from 'react';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer';
  children?: (props: InjectedProps) => JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
  isLoading?: boolean;
}

const SocketNewItemsNotice = ({ children, className, url, num, alert, type = 'transaction', isLoading }: Props) => {
  const theme = useTheme();

  const alertContent = (() => {
    if (alert) {
      return alert;
    }

    const name = type === 'token_transfer' ? 'token transfer' : 'transaction';

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

  const color = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const bgColor = useColorModeValue('orange.50', transparentize('orange.200', 0.16)(theme));

  const content = !isLoading ? (
    <Alert
      className={ className }
      status="warning"
      px={ 4 }
      py="6px"
      fontWeight={ 400 }
      fontSize="sm"
      bgColor={ bgColor }
      color={ color }
    >
      { alertContent }
    </Alert>
  ) : <Skeleton className={ className } h="33px"/>;

  return children ? children({ content }) : content;
};

export default chakra(SocketNewItemsNotice);
