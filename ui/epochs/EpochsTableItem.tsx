import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import EpochEntity from 'ui/shared/entities/epoch/EpochEntity';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
};

const EpochsTableItem = ({ item, isLoading }: Props) => {

  const communityReward = getCurrencyValue({
    value: item.distribution?.community_transfer?.value ?? '0',
    decimals: item.distribution?.community_transfer?.decimals,
    accuracy: 8,
  });
  const carbonOffsettingReward = getCurrencyValue({
    value: item.distribution?.carbon_offsetting_transfer?.value ?? '0',
    decimals: item.distribution?.carbon_offsetting_transfer?.decimals,
    accuracy: 8,
  });
  const totalReward = getCurrencyValue({
    value: item.distribution?.transfers_total?.value ?? '0',
    decimals: item.distribution?.transfers_total?.decimals,
    accuracy: 8,
  });

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
        <Skeleton loading={ isLoading }>
          { item.distribution?.community_transfer ? communityReward.valueStr : '-' }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { item.distribution?.carbon_offsetting_transfer ? carbonOffsettingReward.valueStr : '-' }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { item.distribution?.transfers_total ? totalReward.valueStr : '-' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default EpochsTableItem;
