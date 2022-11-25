import { Alert, Link, chakra } from '@chakra-ui/react';
import React from 'react';

import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  children: (props: InjectedProps) => JSX.Element;
  className?: string;
}

const TxsNewItemNotice = ({ children, className }: Props) => {
  const { num, socketAlert } = useNewTxsSocket();

  const handleClick = React.useCallback(() => {
    window.location.reload();
  }, []);

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
      return (
        <Alert className={ className } status="warning" p={ 4 } fontWeight={ 400 }>
          scanning new transactions...
        </Alert>
      );
    }

    return (
      <Alert className={ className } status="warning" p={ 4 } fontWeight={ 400 }>
        <Link onClick={ handleClick }>{ num } more transaction have come in</Link>
      </Alert>
    );
  })();

  return children({ content });
};

export default chakra(TxsNewItemNotice);
