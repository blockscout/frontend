import { Tr, Td, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';

import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';

import ArbitrumL2TxnWithdrawalsClaimButton from './ArbitrumL2TxnWithdrawalsClaimButton';
import ArbitrumL2TxnWithdrawalsValue from './ArbitrumL2TxnWithdrawalsValue';

interface Props {
  txHash: string | undefined;
  data: ArbitrumL2TxnWithdrawalsItem;
  isLoading?: boolean;
}

const ArbitrumL2TxnWithdrawalsTableItem = ({ data, isLoading, txHash }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading }>{ data.id }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntityL1 address={{ hash: data.token?.destination || data.destination }} isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading }>
          <ArbitrumL2TxnWithdrawalsValue data={ data }/>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" justifyContent="space-between" columnGap={ 8 }>
          <ArbitrumL2MessageStatus status={ data.status } isLoading={ isLoading }/>
          { (data.status === 'confirmed' || data.status === 'relayed') && (
            <ArbitrumL2TxnWithdrawalsClaimButton
              messageId={ data.id }
              txHash={ txHash }
              completionTxHash={ data.completion_transaction_hash || undefined }
              isLoading={ isLoading }
            />
          ) }
        </Flex>
      </Td>
    </Tr>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsTableItem);
