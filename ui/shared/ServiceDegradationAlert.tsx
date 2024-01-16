import { Alert } from '@chakra-ui/react';
import React from 'react';

const ServiceDegradationAlert = () => {
  return (
    <Alert status="warning">Blockscout is busy, retrying...</Alert>
  );
};

export default React.memo(ServiceDegradationAlert);
