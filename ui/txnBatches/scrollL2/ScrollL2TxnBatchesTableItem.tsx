import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ScrollL2TxnBatch } from 'types/api/scrollL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import ScrollL2TxnBatchDA from 'ui/shared/batch/ScrollL2TxnBatchDA';
import Skeleton from 'ui/shared/chakra/Skeleton';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ScrollL2TxnBatchStatus from 'ui/shared/statusTag/ScrollL2TxnBatchStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2TxnBatch; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
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
        <ScrollL2TxnBatchDA container={ item.data_availability?.batch_data_container } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <ScrollL2TxnBatchStatus status={ item.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </Td>
      <Td verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.commitment_transaction.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        { item.confirmation_transaction.block_number ? (
          <BlockEntityL1
            number={ item.confirmation_transaction.block_number }
            isLoading={ isLoading }
            fontSize="sm"
            lineHeight={ 5 }
          />
        ) : <Skeleton isLoaded={ !isLoading } display="inline-block">Pending</Skeleton> }
      </Td>
      <Td verticalAlign="middle">
        { item.confirmation_transaction.hash ? (
          <TxEntityL1
            hash={ item.confirmation_transaction.hash }
            isLoading={ isLoading }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : <Skeleton isLoaded={ !isLoading } display="inline-block">Pending</Skeleton> }
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'blocks' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading }>
            { (item.end_block - item.start_block + 1).toLocaleString() }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading }>
            { item.transaction_count.toLocaleString() }
          </Skeleton>
        </LinkInternal>
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
