import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import OptimisticL2TxnBatchDA from 'ui/shared/batch/OptimisticL2TxnBatchDA';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2TxnBatchesItem; isLoading?: boolean };

const OptimisticL2TxnBatchesListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch ID</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2 number={ item.internal_id } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { item.batch_data_container && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>
            Storage
          </ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <OptimisticL2TxnBatchDA container={ item.batch_data_container } isLoading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.l1_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } minW="40px">
          { item.l1_transaction_hashes.length }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 blocks</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.internal_id.toString(), tab: 'blocks' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.l2_block_end - item.l2_block_start + 1 }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.internal_id.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.transaction_count }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2TxnBatchesListItem;
