// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2OutputRootsItem } from 'client/features/rollup/optimism/types/api';

import BlockEntityL2 from 'client/features/rollup/common/components/BlockEntityL2';
import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2OutputRootsItem; isLoading?: boolean };

const OptimisticL2OutputRootsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.l1_timestamp }
          isLoading={ isLoading }
          display="inline-block"
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          noIcon
          truncation="constant_long"
          noCopy
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex overflow="hidden" w="100%" alignItems="center">
          <Skeleton loading={ isLoading }>
            <HashStringShorten hash={ item.output_root } type="long"/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default OptimisticL2OutputRootsTableItem;
