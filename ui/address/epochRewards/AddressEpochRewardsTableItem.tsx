import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { AddressEpochRewardsItem } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

 type Props = {
   item: AddressEpochRewardsItem;
   isLoading?: boolean;
 };

const AddressEpochRewardsTableItem = ({ item, isLoading }: Props) => {
  const { valueStr } = getCurrencyValue({ value: item.amount, decimals: item.token.decimals });
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Flex alignItems="center" gap={ 3 }>
          <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon fontWeight={ 600 }/>
          <Skeleton loading={ isLoading }>
            <Text color="text.secondary" fontWeight={ 600 }>{ `Epoch # ${ item.epoch_number }` }</Text>
          </Skeleton>
          <TimeWithTooltip timestamp={ item.block_timestamp } isLoading={ isLoading } color="text.secondary" fontWeight={ 400 }/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <EpochRewardTypeTag type={ item.type } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity address={ item.associated_account } isLoading={ isLoading } truncation="constant"/>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="flex" alignItems="center" gap={ 2 } justifyContent="flex-end">
          { valueStr }
          <TokenEntity token={ item.token } isLoading={ isLoading } onlySymbol width="auto" noCopy/>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default AddressEpochRewardsTableItem;
