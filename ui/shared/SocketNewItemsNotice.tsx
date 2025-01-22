import { Link, Text, chakra, Table } from '@chakra-ui/react';
import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit' | 'block';
  children?: (props: InjectedProps) => React.JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
  isLoading?: boolean;
}

const SocketNewItemsNotice = chakra(({ children, className, url, num, alert, type = 'transaction', isLoading }: Props) => {
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

  const content = !isLoading ? (
    <Alert
      className={ className }
      visual="warning_table"
      px={ 4 }
      py="6px"
      fontSize="sm"
      startElement={ null }
    >
      { alertContent }
    </Alert>
  ) : <Skeleton className={ className } h="36px" loading/>;

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
      { ({ content }) => <Table.Row><Table.Cell colSpan={ 100 } p={ 0 } _first={{ p: 0 }} _last={{ p: 0 }}>{ content }</Table.Cell></Table.Row> }
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
