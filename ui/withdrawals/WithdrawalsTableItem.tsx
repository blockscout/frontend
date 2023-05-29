import { Td, Tr, Icon, Skeleton, Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import blockIcon from 'icons/block.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import LinkInternal from 'ui/shared/LinkInternal';

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
          { isLoading ? (
            <Flex columnGap={ 1 } alignItems="center">
              <Skeleton boxSize={ 6 }/>
              <Skeleton display="inline-block">{ item.block_number }</Skeleton>
            </Flex>
          ) : (
            <LinkInternal
              href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.block_number.toString() } }) }
              display="flex"
              width="fit-content"
              alignItems="center"
            >
              <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
              { item.block_number }
            </LinkInternal>
          ) }
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
