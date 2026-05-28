// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { OptimisticL2DisputeGamesItem } from 'client/features/rollup/optimism/types/api';

import BlockEntityL2 from 'client/features/rollup/common/components/BlockEntityL2';
import { layerLabels } from 'client/features/rollup/common/utils/layer';

import config from 'client/config';
import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'client/shared/lists/ListItemMobileGrid';
import CopyToClipboard from 'client/shared/texts/CopyToClipboard';
import HashStringShorten from 'client/shared/texts/HashStringShorten';

import { Skeleton } from 'toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2DisputeGamesItem; isLoading?: boolean };

const OptimisticL2DisputeGamesListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text.primary">
        <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Game type</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.game_type }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="text.primary">
        <Skeleton loading={ isLoading } display="flex" overflow="hidden" w="100%" alignItems="center">
          <HashStringShorten hash={ item.contract_address_hash } type="long"/>
          <CopyToClipboard text={ item.contract_address_hash } ml={ 2 } isLoading={ isLoading }/>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.current } block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value color="text.primary">
        <Skeleton loading={ isLoading } display="inline-block">{ item.status }</Skeleton>
      </ListItemMobileGrid.Value>

      { item.resolved_at && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Resolution age</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.resolved_at }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2DisputeGamesListItem;
