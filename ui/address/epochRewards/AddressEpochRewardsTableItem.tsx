import { Flex, Td, Tr, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressEpochRewardsItem } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

 type Props = {
   item: AddressEpochRewardsItem;
   isLoading?: boolean;
 };

const AddressEpochRewardsTableItem = ({ item, isLoading }: Props) => {
  const { valueStr } = getCurrencyValue({ value: item.amount, decimals: item.token.decimals });
  return (
    <Tr>
      <Td verticalAlign="middle">
        <Flex alignItems="center" gap={ 3 }>
          <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon fontWeight={ 600 }/>
          <Skeleton isLoaded={ !isLoading }>
            <Text color="text_secondary" fontWeight={ 600 }>{ `Epoch # ${ item.epoch_number }` }</Text>
          </Skeleton>
          <TimeAgoWithTooltip timestamp={ item.block_timestamp } isLoading={ isLoading } textColor="text_secondary" fontWeight={ 400 }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <EpochRewardTypeTag type={ item.type } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity address={ item.associated_account } isLoading={ isLoading } truncation="constant"/>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="flex" alignItems="center" gap={ 2 } justifyContent="flex-end">
          { valueStr }
          <TokenEntity token={ item.token } isLoading={ isLoading } onlySymbol width="auto" noCopy/>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default AddressEpochRewardsTableItem;
