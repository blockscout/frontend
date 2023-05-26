import { Flex, Icon, Skeleton } from '@chakra-ui/react';
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
            <CurrencyValue value={ item.amount } currency={ appConfig.network.currency.symbol } isLoading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default WithdrawalsListItem;
