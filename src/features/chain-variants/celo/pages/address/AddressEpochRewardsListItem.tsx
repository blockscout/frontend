// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressEpochRewardsItem } from 'src/features/chain-variants/celo/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import EpochEntity from 'src/features/chain-variants/celo/components/entity/EpochEntity';
import EpochRewardTypeTag from 'src/features/chain-variants/celo/components/EpochRewardTypeTag';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import TokenValue from 'src/shared/values/entity/TokenValue';

type Props = {
  item: AddressEpochRewardsItem;
  isLoading?: boolean;
};

const AddressEpochRewardsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Epoch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <EpochEntity number={ String(item.epoch_number) } noIcon isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.block_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Reward type</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <EpochRewardTypeTag type={ item.type } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Associated address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={ item.associated_account }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TokenValue
          amount={ item.amount }
          token={ item.token }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default AddressEpochRewardsListItem;
