import { Alert, Skeleton } from '@chakra-ui/react';
import React from 'react';

interface Props {
  isLoading?: boolean;
}

const ContractCustomAbiAlert = ({ isLoading }: Props) => {
  return (
    <Skeleton isLoaded={ !isLoading }>
      <Alert status="warning" mb={ 6 }>
        Note: Contract with custom ABI is only meant for debugging purpose and it is the user’s responsibility to ensure that the provided ABI
        matches the contract, otherwise errors may occur or results returned may be incorrect.
        Blockscout is not responsible for any losses that arise from the use of Read & Write contract.
      </Alert>
    </Skeleton>
  );
};

export default React.memo(ContractCustomAbiAlert);
