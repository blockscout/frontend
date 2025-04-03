import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

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
          <TimeAgoWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <CurrencyValue value={ item.amount } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default BeaconChainWithdrawalsTableItem;
