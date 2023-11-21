import { Td, Tr, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2TxnBatches';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import ZkEvmBatchEntityL2 from 'ui/shared/entities/block/ZkEvmBatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';

const feature = config.features.zkEvmRollup;

type Props = { item: ZkEvmL2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <ZkEvmBatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </Td>
      <Td verticalAlign="middle">
        <ZkEvmL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" my={ 1 }>
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td pr={ 12 } verticalAlign="middle">
        { item.verify_tx_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.verify_tx_hash }
            fontSize="sm"
            lineHeight={ 5 }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </Td>
      <Td pr={ 12 } verticalAlign="middle">
        { item.sequence_tx_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.sequence_tx_hash }
            fontSize="sm"
            lineHeight={ 5 }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
