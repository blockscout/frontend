import type { BoxProps } from '@chakra-ui/react';
import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractCreationStatus } from 'types/api/contract';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ContractCreationStatus from 'ui/shared/statusTag/ContractCreationStatus';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  addressHash: string;
  txHash: string;
  creationStatus: SmartContractCreationStatus | null;
  isLoading: boolean;
  labelProps?: BoxProps;
}

const ContractDetailsInfoCreator = ({ addressHash, txHash, creationStatus, isLoading, labelProps }: Props) => {
  return (
    <ContractDetailsInfoItem
      label="Creator"
      isLoading={ isLoading }
      labelProps={ labelProps }
    >
      <Flex alignItems="center" flexWrap="wrap">
        <AddressEntity
          address={{ hash: addressHash }}
          truncation="constant"
          noIcon
        />
        <Text whiteSpace="pre" color="text.secondary"> at txn </Text>
        <TxEntity hash={ txHash } truncation="constant" noIcon/>
        { creationStatus && <ContractCreationStatus status={ creationStatus } ml={{ base: 0, lg: 2 }}/> }
      </Flex>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoCreator);
