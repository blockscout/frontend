import { Alert, Spinner } from '@chakra-ui/react';
import React from 'react';

const TxPendingAlert = () => {
  return (
    <Alert>
      <Spinner size="sm" mr={ 2 }/>
      This transaction is pending confirmation.
    </Alert>
  );
};

export default TxPendingAlert;
