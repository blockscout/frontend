import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import OptimisticL2TxnBatchDA from 'ui/shared/batch/OptimisticL2TxnBatchDA';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2TxnBatchesItem; isLoading?: boolean };

const OptimisticL2TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BatchEntityL2 number={ item.internal_id } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        { item.batch_data_container ? <OptimisticL2TxnBatchDA container={ item.batch_data_container } isLoading={ isLoading }/> : '-' }
      </Td>
      <Td verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.l1_timestamp }
          isLoading={ isLoading }
          display="inline-block"
          color="text_secondary"
          my={ 1 }
        />
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } minW="40px" display="inline-block">
          { item.l1_transaction_hashes.length }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.internal_id.toString(), tab: 'blocks' } }) }
          isLoading={ isLoading }
          justifyContent="flex-end"
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" display="inline-block">
            { item.l2_block_end - item.l2_block_start + 1 }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.internal_id.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
          justifyContent="flex-end"
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" display="inline-block">
            { item.transaction_count }
          </Skeleton>
        </LinkInternal>
      </Td>
    </Tr>
  );
};

export default OptimisticL2TxnBatchesTableItem;
