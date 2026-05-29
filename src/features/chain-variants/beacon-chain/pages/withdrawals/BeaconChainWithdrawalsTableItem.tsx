// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { WithdrawalsItem } from 'src/features/chain-variants/beacon-chain/types/api';
import type { AddressWithdrawalsItem } from 'src/slices/address/types/api';
import type { BlockWithdrawalsItem } from 'src/slices/block/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

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

const BeaconChainWithdrawalsTableItem = ({ item, view, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </TableCell>
      { view !== 'block' && (
        <TableCell verticalAlign="middle">
          <BlockEntity
            number={ item.block_number }
            isLoading={ isLoading }
            textStyle="sm"
            noIcon
          />
        </TableCell>
      ) }
      { view !== 'address' && (
        <TableCell verticalAlign="middle">
          <AddressEntity
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
      ) }
      { view !== 'block' && (
        <TableCell verticalAlign="middle" pr={ 12 }>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <NativeCoinValue amount={ item.amount } loading={ isLoading } noSymbol/>
      </TableCell>
    </TableRow>
  );
};

export default BeaconChainWithdrawalsTableItem;
