// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  item: schemas['Withdrawal'];
  view: 'address' | 'block' | 'list';
  isLoading?: boolean;
}

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
          { item.block_number ? (
            <BlockEntity
              number={ item.block_number }
              isLoading={ isLoading }
              textStyle="sm"
              noIcon
            />
          ) : '-' }
        </TableCell>
      ) }
      { view !== 'address' && (
        <TableCell verticalAlign="middle">
          { item.receiver ? (
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : '-' }
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
