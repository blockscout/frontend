import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

const feature = config.features.beaconChain;

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

const WithdrawalsListItem = ({ item, isLoading, view }: Props) => {
  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Validator index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </ListItemMobileGrid.Value>

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Block</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BlockEntity
              number={ item.block_number }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'address' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <Address>
              <AddressIcon address={ item.receiver } isLoading={ isLoading }/>
              <AddressLink type="address" hash={ item.receiver.hash } truncation="dynamic" ml={ 2 } isLoading={ isLoading }/>
            </Address>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'block' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading } display="inline-block">{ dayjs(item.timestamp).fromNow() }</Skeleton>
          </ListItemMobileGrid.Value>

          <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <CurrencyValue value={ item.amount } currency={ feature.currency.symbol } isLoading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default WithdrawalsListItem;
