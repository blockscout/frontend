// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractCreationStatus } from 'client/slices/contract/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import ContractCreationStatus from 'client/slices/contract/components/ContractCreationStatus';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  addressHash: string;
  txHash: string;
  creationStatus: SmartContractCreationStatus | null;
  isLoading: boolean;
}

const ContractDetailsInfoCreator = ({ addressHash, txHash, creationStatus, isLoading }: Props) => {
  return (
    <ContractDetailsInfoItem
      label="Creator"
      isLoading={ isLoading }
      contentProps={{ gridColumn: { lg: '2 / span 3' } }}
    >
      <Flex alignItems="center" flexWrap="wrap" columnGap={ 2 } rowGap={ 2 }>
        <AddressEntity
          address={{ hash: addressHash }}
          truncation="constant"
          noIcon
        />
        <Text whiteSpace="pre" color="text.secondary">at txn</Text>
        <TxEntity hash={ txHash } truncation="constant" noIcon/>
        { creationStatus && <ContractCreationStatus status={ creationStatus }/> }
      </Flex>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoCreator);
