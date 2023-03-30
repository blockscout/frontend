import { Box, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: WithdrawalsItem };

const WithdrawalsListItem = ({ item }: Props) => {
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : null;
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : null;

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label>Msg nonce</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.msg_nonce_version + '-' + item.msg_nonce }
      </ListItemMobileGrid.Value>

      { item.from && (
        <>
          <ListItemMobileGrid.Label>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Address>
              <AddressIcon address={ item.from }/>
              <AddressLink hash={ item.from.hash } type="address" truncation="dynamic" ml={ 2 }/>
            </Address>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label>L2 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
          display="flex"
          width="fit-content"
          alignItems="center"
          overflow="hidden"
          w="100%"
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l2_tx_hash }/></Box>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      { timeAgo && (
        <>
          <ListItemMobileGrid.Label>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ timeAgo }</ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ item.status }</LinkExternal> :
          item.status }
      </ListItemMobileGrid.Value>

      { item.l1_tx_hash && (
        <>
          <ListItemMobileGrid.Label>L1 txn hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <LinkExternal
              href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
              maxW="100%"
              display="inline-flex"
              overflow="hidden"
            >
              <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
              <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
            </LinkExternal>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { timeToEnd && (
        <>
          <ListItemMobileGrid.Label>Time left</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ timeToEnd }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default WithdrawalsListItem;
