import { Td, Tr, VStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { L2TxnBatchesItem } from 'types/api/l2TxnBatches';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';

const feature = config.features.optimisticRollup;

type Props = { item: L2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!feature.isEnabled) {
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
      <Td>
        <BlockEntityL1
          isLoading={ isLoading }
          number={ item.epoch_number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          py="2px"
          noIcon
        />
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
              maxW="100%"
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

export default TxnBatchesTableItem;
