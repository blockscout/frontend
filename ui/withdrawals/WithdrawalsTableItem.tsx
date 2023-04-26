import { Td, Tr, Text, Icon } from '@chakra-ui/react';
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

 type Props = {
   item: WithdrawalsItem;
   view: 'list';
 } | {
   item: AddressWithdrawalsItem;
   view: 'address';
 } | {
   item: BlockWithdrawalsItem;
   view: 'block';
 };

const WithdrawalsTableItem = ({ item, view }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <Text>{ item.index }</Text>
      </Td>
      <Td verticalAlign="middle">
        <Text>{ item.validator_index }</Text>
      </Td>
      { view !== 'block' && (
        <Td verticalAlign="middle">
          <LinkInternal
            href={ route({ pathname: '/block/[height]', query: { height: item.block_number.toString() } }) }
            display="flex"
            width="fit-content"
            alignItems="center"
          >
            <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
            { item.block_number }
          </LinkInternal>
        </Td>
      ) }
      { view !== 'address' && (
        <Td verticalAlign="middle">
          <Address>
            <AddressIcon address={ item.receiver }/>
            <AddressLink type="address" hash={ item.receiver.hash } truncation="constant" ml={ 2 }/>
          </Address>
        </Td>
      ) }
      { view !== 'block' && (
        <Td verticalAlign="middle" pr={ 12 }>
          <Text variant="secondary">{ dayjs(item.timestamp).fromNow() }</Text>
        </Td>
      ) }
      <Td verticalAlign="middle">
        <CurrencyValue value={ item.amount }/>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
