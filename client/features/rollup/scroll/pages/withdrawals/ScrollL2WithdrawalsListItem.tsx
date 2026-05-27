// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import type { ScrollL2MessageItem } from 'client/features/rollup/scroll/types/api';

import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'client/features/rollup/common/utils/layer';

import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'client/shared/lists/ListItemMobileGrid';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;

type Props = { item: ScrollL2MessageItem; isLoading?: boolean };

const ScrollL2WithdrawalsListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.current } block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntity
          number={ item.origination_transaction_block_number }
          isLoading={ isLoading }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { item.id }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.current } txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.origination_transaction_hash }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.completion_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.completion_transaction_hash }
            truncation="constant_long"
            noCopy
          />
        ) : (
          <chakra.span>
            Pending Claim
          </chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ item.value }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ScrollL2WithdrawalsListItem;
