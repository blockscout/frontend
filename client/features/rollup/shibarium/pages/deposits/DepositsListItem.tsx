// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShibariumDepositsItem } from 'client/features/rollup/shibarium/types/api';

import AddressStringOrParam from 'client/slices/address/components/entity/AddressStringOrParam';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import BlockEntityL1 from 'client/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'client/features/rollup/common/utils/layer';

import config from 'configs/app';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const feature = config.features.rollup;

type Props = { item: ShibariumDepositsItem; isLoading?: boolean };

const DepositsListItem = ({ item, isLoading }: Props) => {
  if (!(feature.isEnabled && feature.type === 'shibarium')) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } block No</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.l1_block_number }
          isLoading={ isLoading }
          textStyle="sm"
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          textStyle="sm"
          truncation="constant_long"
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.current } txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          textStyle="sm"
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>User</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressStringOrParam
          address={ item.user }
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default DepositsListItem;
