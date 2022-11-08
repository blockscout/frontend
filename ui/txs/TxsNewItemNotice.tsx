import { Alert, Spinner, Text, Link, chakra } from '@chakra-ui/react';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import { ROUTES } from 'lib/link/routes';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  children: (props: InjectedProps) => JSX.Element;
  className?: string;
}

function getSocketParams(router: NextRouter) {
  if (router.pathname === ROUTES.txs.pattern && router.query.tab === 'validated' && !router.query.block_number) {
    return { topic: 'transactions:new_transaction' as const, event: 'transaction' as const };
  }

  if (router.pathname === ROUTES.txs.pattern && router.query.tab === 'pending' && !router.query.block_number) {
    return { topic: 'transactions:new_pending_transaction' as const, event: 'pending_transaction' as const };
  }

  return {};
}

function assertIsNewTxResponse(response: unknown): response is { transaction: number } {
  return typeof response === 'object' && response !== null && 'transaction' in response;
}
function assertIsNewPendingTxResponse(response: unknown): response is { pending_transaction: number } {
  return typeof response === 'object' && response !== null && 'pending_transaction' in response;
}

const TxsNewItemNotice = ({ children, className }: Props) => {
  const router = useRouter();
  const [ num, setNum ] = React.useState(0);
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const { topic, event } = getSocketParams(router);

  const handleClick = React.useCallback(() => {
    window.location.reload();
  }, []);

  const handleNewTxMessage = React.useCallback((response: { transaction: number } | { pending_transaction: number } | unknown) => {
    if (assertIsNewTxResponse(response)) {
      setNum((prev) => prev + response.transaction);
    }
    if (assertIsNewPendingTxResponse(response)) {
      setNum((prev) => prev + response.pending_transaction);
    }
  }, []);

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please click here to load new transactions.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new transactions. Please click here to refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: !topic,
  });

  useSocketMessage({
    channel,
    event,
    handler: handleNewTxMessage,
  });

  if (!topic && !event) {
    return null;
  }

  const content = (() => {
    if (socketAlert) {
      return (
        <Alert
          className={ className }
          status="warning"
          p={ 4 }
          borderRadius={ 0 }
          onClick={ handleClick }
          cursor="pointer"
        >
          { socketAlert }
        </Alert>
      );
    }

    if (!num) {
      return null;
    }

    return (
      <Alert className={ className } status="warning" p={ 4 } borderRadius={ 0 } fontWeight={ 400 }>
        <Spinner size="sm" mr={ 3 }/>
        <Text as="span" whiteSpace="pre">+ { num } new transaction{ num > 1 ? 's' : '' }. </Text>
        <Link onClick={ handleClick }>Show in list</Link>
      </Alert>
    );
  })();

  return children({ content });
};

export default chakra(TxsNewItemNotice);
