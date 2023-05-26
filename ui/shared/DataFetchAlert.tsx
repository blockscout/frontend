import { Alert, AlertDescription, chakra } from '@chakra-ui/react';
import React from 'react';

const DataFetchAlert = ({ className }: { className?: string }) => {
  return (
    <Alert status="warning" width="fit-content" className={ className }>
      <AlertDescription>
        Something went wrong. Try refreshing the page or come back later.
      </AlertDescription>
    </Alert>
  );
};

export default chakra(DataFetchAlert);
