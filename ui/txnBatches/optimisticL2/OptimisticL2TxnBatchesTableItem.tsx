import { Td, Tr, VStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2TxnBatchesItem; isLoading?: boolean };

const OptimisticL2TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <Tr>
      <Td>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td>
        <LinkInternal
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" my={ 1 }>
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td pr={ 12 }>
        <VStack spacing={ 3 } alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <TxEntityL1
              key={ hash }
              isLoading={ isLoading }
              hash={ hash }
              fontSize="sm"
              lineHeight={ 5 }
              truncation="constant_long"
              noIcon
            />
          )) }
        </VStack>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" my={ 1 } display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default OptimisticL2TxnBatchesTableItem;
