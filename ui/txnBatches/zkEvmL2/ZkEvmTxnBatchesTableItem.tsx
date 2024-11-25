import { Td, Tr, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <ZkEvmL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" my={ 1 }>
            { item.transaction_count }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td pr={ 12 } verticalAlign="middle">
        { item.verify_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.verify_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </Td>
      <Td pr={ 12 } verticalAlign="middle">
        { item.sequence_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.sequence_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
