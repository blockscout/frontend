import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';

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

const WithdrawalsTableItem = ({ item, view, isLoading }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.index }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </Td>
      { view !== 'block' && (
        <Td verticalAlign="middle">
          <BlockEntity
            number={ item.block_number }
            isLoading={ isLoading }
            fontSize="sm"
            lineHeight={ 5 }
          />
        </Td>
      ) }
      { view !== 'address' && (
        <Td verticalAlign="middle">
          <Address>
            <AddressIcon address={ item.receiver } isLoading={ isLoading }/>
            <AddressLink type="address" hash={ item.receiver.hash } truncation="constant" ml={ 2 } isLoading={ isLoading }/>
          </Address>
        </Td>
      ) }
      { view !== 'block' && (
        <Td verticalAlign="middle" pr={ 12 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
            <span>{ dayjs(item.timestamp).fromNow() }</span>
          </Skeleton>
        </Td>
      ) }
      <Td verticalAlign="middle">
        <CurrencyValue value={ item.amount } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
