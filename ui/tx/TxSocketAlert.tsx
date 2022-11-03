import { Alert } from '@chakra-ui/react';
import React from 'react';

interface Props {
  status: 'error' | 'close';
}

const TxSocketAlert = ({ status }: Props) => {
  const text = status === 'close' ?
    'Connection is lost. Please click here to update transaction info.' :
    'An error has occurred while fetching transaction info. Please click here to update.';

  return <Alert status="warning" as="a" href={ window.document.location.href }>{ text }</Alert>;
};

export default React.memo(TxSocketAlert);
