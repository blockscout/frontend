import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import EpochEntity from 'ui/shared/entities/epoch/EpochEntity';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import AssetValue from 'ui/shared/value/AssetValue';

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
        <AssetValue
          amount={ item.distribution?.community_transfer?.value }
          decimals={ item.distribution?.community_transfer?.decimals }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <AssetValue
          amount={ item.distribution?.carbon_offsetting_transfer?.value }
          decimals={ item.distribution?.carbon_offsetting_transfer?.decimals }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <AssetValue
          amount={ item.distribution?.transfers_total?.value }
          decimals={ item.distribution?.transfers_total?.decimals }
          loading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default EpochsTableItem;
