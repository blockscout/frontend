import { Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

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

const WithdrawalsListItem = ({ item, view }: Props) => {
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.index }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Validator index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.validator_index }
      </ListItemMobileGrid.Value>

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label>Block</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <LinkInternal
              href={ route({ pathname: '/block/[height]', query: { height: item.block_number.toString() } }) }
              display="flex"
              width="fit-content"
              alignItems="center"
            >
              <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
              { item.block_number }
            </LinkInternal>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'address' && (
        <>
          <ListItemMobileGrid.Label>To</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <Address>
              <AddressIcon address={ item.receiver }/>
              <AddressLink type="address" hash={ item.receiver.hash } truncation="dynamic" ml={ 2 }/>
            </Address>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { dayjs(item.timestamp).fromNow() }
          </ListItemMobileGrid.Value>

          <ListItemMobileGrid.Label>Value</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <CurrencyValue value={ item.amount } currency={ appConfig.network.currency.symbol }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default WithdrawalsListItem;
