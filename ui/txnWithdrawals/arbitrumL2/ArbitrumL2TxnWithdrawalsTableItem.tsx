import { Tr, Td, Skeleton, Flex, Button } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';

import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';

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
        <Flex alignItems="center" justifyContent="space-between">
          <ArbitrumL2MessageStatus status={ data.status } isLoading={ isLoading }/>
          <Button size="sm" variant="outline">
            Claim
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsTableItem);
