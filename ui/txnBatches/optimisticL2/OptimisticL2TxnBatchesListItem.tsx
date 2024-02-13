import { Skeleton, VStack } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2TxnBatchesItem; isLoading?: boolean };

const OptimisticL2TxnBatchesListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <VStack spacing={ 3 } w="100%" overflow="hidden" alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <TxEntityL1
              key={ hash }
              isLoading={ isLoading }
              hash={ hash }
              fontSize="sm"
              lineHeight={ 5 }
              truncation="constant_long"
            />
          )) }
        </VStack>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ timeAgo }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2TxnBatchesListItem;
