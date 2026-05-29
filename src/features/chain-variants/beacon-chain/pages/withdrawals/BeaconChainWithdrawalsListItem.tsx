// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { WithdrawalsItem } from 'src/features/chain-variants/beacon-chain/types/api';
import type { AddressWithdrawalsItem } from 'src/slices/address/types/api';
import type { BlockWithdrawalsItem } from 'src/slices/block/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const feature = config.features.beaconChain;

type Props = ({
  item: WithdrawalsItem;
  view: 'list';
} | {
  item: AddressWithdrawalsItem;
  view: 'address';
} | {
  item: BlockWithdrawalsItem;
  view: 'block';
}) & { isLoading?: boolean };

const BeaconChainWithdrawalsListItem = ({ item, isLoading, view }: Props) => {
  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Validator index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </ListItemMobileGrid.Value>

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Block</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BlockEntity
              number={ item.block_number }
              isLoading={ isLoading }
              textStyle="sm"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'address' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              truncation="constant"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ item.timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>

          <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <NativeCoinValue amount={ item.amount } loading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default BeaconChainWithdrawalsListItem;
