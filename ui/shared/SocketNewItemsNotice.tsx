import { Alert, Link, Text, chakra, useTheme, useColorModeValue, Skeleton, Tr, Td } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import React from 'react';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit' | 'block';
  children?: (props: InjectedProps) => JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
  isLoading?: boolean;
}

const SocketNewItemsNotice = chakra(({ children, className, url, num, alert, type = 'transaction', isLoading }: Props) => {
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
      case 'block':
        name = 'block';
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
        <Link href={ url }>{ num.toLocaleString() } more { name }{ num > 1 ? 's' : '' }</Link>
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
      lineHeight={ 5 }
      bgColor={ bgColor }
      color={ color }
    >
      { alertContent }
    </Alert>
  ) : <Skeleton className={ className } h="33px"/>;

  return children ? children({ content }) : content;
});

export default SocketNewItemsNotice;

export const Desktop = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderRadius={ props.isLoading ? 'sm' : 0 }
      h={ props.isLoading ? 5 : 'auto' }
      maxW={ props.isLoading ? '215px' : undefined }
      w="100%"
      mx={ props.isLoading ? 4 : 0 }
      my={ props.isLoading ? '6px' : 0 }
      { ...props }
    >
      { ({ content }) => <Tr><Td colSpan={ 100 } p={ 0 }>{ content }</Td></Tr> }
    </SocketNewItemsNotice>
  );
};

export const Mobile = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderBottomRadius={ 0 }
      { ...props }
    />
  );
};
