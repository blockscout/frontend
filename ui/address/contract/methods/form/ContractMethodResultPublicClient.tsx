import React from 'react';

import { Alert } from 'toolkit/chakra/alert';

export interface Props {
  data: Error;
}

const ContractMethodResultPublicClient = ({ data }: Props) => {

  return (
    <Alert status="error" mt={ 3 } textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
      { 'shortMessage' in data && typeof data.shortMessage === 'string' ? data.shortMessage : data.message }
    </Alert>
  );
};

export default React.memo(ContractMethodResultPublicClient);
