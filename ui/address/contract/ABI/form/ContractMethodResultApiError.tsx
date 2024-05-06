import { Alert } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ContractMethodResultApiError = ({ children }: Props) => {
  return (
    <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word" whiteSpace="pre-wrap">
      { children }
    </Alert>
  );
};

export default React.memo(ContractMethodResultApiError);
