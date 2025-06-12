import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
}

const EpochsListItem = ({ item, isLoading }: Props) => {
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
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Epoch</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <HStack gap={ 2 }>
          <Link
            href={ route({ pathname: '/epochs/[number]', query: { number: String(item.number) } }) }
            fontWeight={ 700 }
            loading={ isLoading }
          >
            { item.number }
          </Link>
          <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 500 }><span>{ item.type }</span></Skeleton>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
            fontWeight={ 400 }
            timeFormat="relative"
          />
        </HStack>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <CeloEpochStatus
          isFinalized={ item.is_finalized }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block range</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>{ item.start_block_number } - { item.end_block_number || '' }</Skeleton>
      </ListItemMobileGrid.Value>

      { item.distribution?.community_transfer ? (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Community fund</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton loading={ isLoading }>{ communityReward.valueStr } { config.chain.currency.symbol }</Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) : null }

      { item.distribution?.carbon_offsetting_transfer ? (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Carbon offset fund</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton loading={ isLoading }>{ carbonOffsettingReward.valueStr } { config.chain.currency.symbol }</Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) : null }

      { item.distribution?.transfers_total ? (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Total fund</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton loading={ isLoading }>{ totalReward.valueStr } { config.chain.currency.symbol }</Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) : null }

    </ListItemMobileGrid.Container>
  );
};

export default EpochsListItem;
