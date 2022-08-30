import { Alert, AlertDescription } from '@chakra-ui/react';
import React from 'react';

const DataFetchAlert = () => {
  return (
    <Alert status="warning" as="span">
      <AlertDescription>
        Something went wrong. Try refreshing the page or come back later.
      </AlertDescription>
    </Alert>
  );
};

export default DataFetchAlert;
