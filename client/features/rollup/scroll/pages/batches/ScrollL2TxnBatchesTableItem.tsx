// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ScrollL2TxnBatch } from 'client/features/rollup/scroll/types/api';

import { route } from 'nextjs-routes';

import BatchEntityL2 from 'client/features/rollup/common/components/BatchEntityL2';
import BlockEntityL1 from 'client/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';
import ScrollL2TxnBatchDA from 'client/features/rollup/scroll/components/ScrollL2TxnBatchDA';
import ScrollL2TxnBatchStatus from 'client/features/rollup/scroll/components/ScrollL2TxnBatchStatus';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2TxnBatch; isLoading?: boolean };

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
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noCopy
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
          <BlockEntityL1
            number={ item.confirmation_transaction.block_number }
            isLoading={ isLoading }
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">Pending</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.confirmation_transaction.hash ? (
          <TxEntityL1
            hash={ item.confirmation_transaction.hash }
            isLoading={ isLoading }
            truncation="constant_long"
            noCopy
          />
        ) : <Skeleton loading={ isLoading } display="inline-block">Pending</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'blocks' } }) }
          loading={ isLoading }
        >
          { (item.end_block_number - item.start_block_number + 1).toLocaleString() }
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
