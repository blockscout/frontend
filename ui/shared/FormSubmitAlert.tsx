import { Alert, AlertDescription } from '@chakra-ui/react';
import React from 'react';

const FormSubmitAlert = () => {
  return (
    <Alert status="error">
      <AlertDescription>
        There has been an error processing your request
      </AlertDescription>
    </Alert>
  );
};

export default FormSubmitAlert;
