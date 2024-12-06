import { Td, Tr, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import type { MessagesDirection } from './ArbitrumL2Messages';

const rollupFeature = config.features.rollup;

 type Props = { item: ArbitrumL2MessagesItem; isLoading?: boolean; direction: MessagesDirection };

const ArbitrumL2MessagesTableItem = ({ item, direction, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  const l1TxHash = direction === 'from-rollup' ? item.completion_transaction_hash : item.origination_transaction_hash;
  const l2TxHash = direction === 'from-rollup' ? item.origination_transaction_hash : item.completion_transaction_hash;

  return (
    <Tr>
      { direction === 'to-rollup' && (
        <Td verticalAlign="middle">
          { item.origination_transaction_block_number ? (
            <BlockEntityL1
              number={ item.origination_transaction_block_number }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
              noIcon
            />
          ) : <chakra.span color="text_secondary">N/A</chakra.span> }
        </Td>
      ) }
      { direction === 'from-rollup' && (
        <Td verticalAlign="middle">
          <AddressEntity
            address={{ hash: item.origination_address }}
            truncation="constant"
            isLoading={ isLoading }
            fontSize="sm"
            lineHeight={ 5 }
            fontWeight={ 600 }
          />
        </Td>
      ) }
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading }>
          <span>{ item.id }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { l2TxHash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ l2TxHash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : (
          <chakra.span color="text_secondary">
            N/A
          </chakra.span>
        ) }
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        <ArbitrumL2MessageStatus status={ item.status } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        { l1TxHash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ l1TxHash }
            truncation="constant_long"
            noIcon
            fontSize="sm"
            lineHeight={ 5 }
          />
        ) : (
          <chakra.span color="text_secondary">
            N/A
          </chakra.span>
        ) }
      </Td>
    </Tr>
  );
};

export default ArbitrumL2MessagesTableItem;
