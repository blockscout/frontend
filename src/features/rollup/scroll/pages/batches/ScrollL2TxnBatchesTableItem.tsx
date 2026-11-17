// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';
import ScrollL2TxnBatchDA from 'src/features/rollup/scroll/components/ScrollL2TxnBatchDA';
import ScrollL2TxnBatchStatus from 'src/features/rollup/scroll/components/ScrollL2TxnBatchStatus';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import { route } from 'src/shared/router/routes';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

const rollupFeature = config.features.rollup;

type Props = { item: schemas['ScrollBatch']; isLoading?: boolean };

const ScrollL2TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ScrollL2TxnBatchDA container={ item.data_availability?.batch_data_container } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ScrollL2TxnBatchStatus status={ item.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
          noIcon
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noCopy
          noIcon
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.commitment_transaction.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.confirmation_transaction.block_number ? (
          <BlockEntity
            number={ item.confirmation_transaction.block_number }
            isLoading={ isLoading }
            noIcon
            chain={ parentChain }
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">Pending</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.confirmation_transaction.hash ? (
          <TxEntity
            hash={ item.confirmation_transaction.hash }
            isLoading={ isLoading }
            truncation="constant_long"
            noCopy
            noIcon
            chain={ parentChain }
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">Pending</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'blocks' } }) }
          loading={ isLoading }
        >
          { (item.end_block_number && item.start_block_number ? item.end_block_number - item.start_block_number + 1 : 0).toLocaleString() }
        </Link>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        { typeof item.transactions_count === 'number' ? (
          <Link
            href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
            loading={ isLoading }
          >
            { item.transactions_count.toLocaleString() }
          </Link>
        ) : 'N/A' }
      </TableCell>
    </TableRow>
  );
};

export default ScrollL2TxnBatchesTableItem;
