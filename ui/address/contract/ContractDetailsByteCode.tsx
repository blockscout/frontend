import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';

interface Props {
  data: SmartContract;
  isLoading: boolean;
  addressData: Address;
}

const ContractDetailsByteCode = ({ data, isLoading, addressData }: Props) => {
  const canBeVerified = ![ 'selfdestructed', 'failed' ].includes(data.creation_status || '') && !data?.is_verified && addressData.proxy_type !== 'eip7702';

  const verificationButton = (
    <ContractDetailsVerificationButton
      isLoading={ isLoading }
      addressHash={ addressData.hash }
      isPartiallyVerified={ Boolean(data?.is_partially_verified) }
    />
  );

  const creationStatusText = (() => {
    switch (data.creation_status) {
      case 'selfdestructed':
        return 'This contract self-destructed after deployment and there is no runtime bytecode. Below is the raw creation bytecode.';
      case 'failed':
        return 'Contract creation failed and there is no runtime bytecode. Below is the raw creation bytecode.';
      default:
        return null;
    }
  })();

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      { data?.creation_bytecode && (
        <RawDataSnippet
          data={ data.creation_bytecode }
          title="Contract creation code"
          rightSlot={ canBeVerified ? verificationButton : null }
          beforeSlot={ creationStatusText ? (
            <Alert status="info" whiteSpace="pre-wrap" showIcon mb={ 3 }>
              { creationStatusText }
            </Alert>
          ) : null }
          textareaMaxHeight="300px"
          isLoading={ isLoading }
        />
      ) }
      { data?.deployed_bytecode && (
        <RawDataSnippet
          data={ data.deployed_bytecode }
          title="Deployed bytecode"
          rightSlot={ !data?.creation_bytecode && canBeVerified ? verificationButton : null }
          textareaMaxHeight="300px"
          isLoading={ isLoading }
        />
      ) }
    </Flex>
  );
};

export default React.memo(ContractDetailsByteCode);
