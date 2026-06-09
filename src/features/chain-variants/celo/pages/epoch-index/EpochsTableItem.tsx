// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'src/features/chain-variants/celo/types/api';

import CeloEpochStatus from 'src/features/chain-variants/celo/components/CeloEpochStatus';
import EpochEntity from 'src/features/chain-variants/celo/components/entity/EpochEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
};

const EpochsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <HStack gap={ 2 }>
          <EpochEntity number={ String(item.number) } noIcon fontWeight={ 700 } isLoading={ isLoading }/>
          <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 500 }><span>{ item.type }</span></Skeleton>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
            fontWeight={ 400 }
          />
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        <CeloEpochStatus
          isFinalized={ item.is_finalized }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.start_block_number } - { item.end_block_number || '' }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ item.distribution?.community_transfer?.value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ item.distribution?.carbon_offsetting_transfer?.value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ item.distribution?.transfers_total?.value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default EpochsTableItem;
