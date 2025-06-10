import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import { route } from 'nextjs-routes';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { getCeloBlockLayer } from 'ui/shared/celo/migration';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  item: CeloEpochListItem;
  l2MigrationBlock: number | undefined;
  isLoading?: boolean;
};

const EpochsTableItem = ({ item, l2MigrationBlock, isLoading }: Props) => {

  const layer = getCeloBlockLayer(item.end_block_number, l2MigrationBlock);
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
          <Link
            href={ route({ pathname: '/epochs/[number]', query: { number: String(item.number) } }) }
            fontWeight={ 700 }
            loading={ isLoading }
          >
            { item.number }
          </Link>
          { layer && (
            <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 500 }><span>{ layer }</span></Skeleton>
          ) }
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
        <Skeleton loading={ isLoading }>
          { item.start_block_number } - { item.end_block_number }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { communityReward.valueStr }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { carbonOffsettingReward.valueStr }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { totalReward.valueStr }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default EpochsTableItem;
