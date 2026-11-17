// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import { route } from 'src/shared/router/routes';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import ArbitrumL2TxnBatchDA from '../../components/ArbitrumL2TxnBatchDA';
import ArbitrumL2TxnBatchStatus from '../../components/ArbitrumL2TxnBatchStatus';

const rollupFeature = config.features.rollup;

type Props = { item: schemas['ArbitrumBatchForList']; isLoading?: boolean };

const ArbitrumL2TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
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
        <HStack gap={ 1 }>
          <ArbitrumL2TxnBatchStatus status={ item.commitment_transaction.status } isLoading={ isLoading }/>
          <ArbitrumL2TxnBatchDA dataContainer={ item.batch_data_container } isLoading={ isLoading }/>
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.commitment_transaction.block_number ? (
          <BlockEntity
            number={ item.commitment_transaction.block_number }
            isLoading={ isLoading }
            chain={ parentChain }
          />
        ) : 'N/A' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.blocks_count ? item.blocks_count.toLocaleString() : 'N/A' }</Skeleton>
      </TableCell>
      <TableCell pr={ 12 } verticalAlign="middle">
        { item.commitment_transaction.hash ? (
          <TxEntity
            hash={ item.commitment_transaction.hash }
            isLoading={ isLoading }
            truncation="constant_long"
            noCopy
            chain={ parentChain }
          />
        ) : 'N/A' }
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
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          minW="40px"
        >
          { item.transactions_count.toLocaleString() }
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default ArbitrumL2TxnBatchesTableItem;
