import { Tr, Td, Skeleton, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';

import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';

import ArbitrumL2TxnWithdrawalsClaimButton from './ArbitrumL2TxnWithdrawalsClaimButton';

interface Props {
  data: ArbitrumL2TxnWithdrawalsItem;
  isLoading?: boolean;
}

const ArbitrumL2TxnWithdrawalsTableItem = ({ data, isLoading }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading }>{ data.id }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntityL1 address={{ hash: data.destination }} isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        333
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" justifyContent="space-between" columnGap={ 8 }>
          <ArbitrumL2MessageStatus status={ data.status } isLoading={ isLoading }/>
          <ArbitrumL2TxnWithdrawalsClaimButton messageId={ data.id }/>
        </Flex>
      </Td>
    </Tr>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsTableItem);
