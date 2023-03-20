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
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : '';
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  const items = [
    {
      name: 'Msg nonce',
      value: item.msg_nonce_version + '-' + item.msg_nonce,
    },
    {
      name: 'From',
      value: item.from ? (
        <Address>
          <AddressIcon address={ item.from }/>
          <AddressLink hash={ item.from?.hash } type="address" truncation="dynamic" ml={ 2 }/>
        </Address>
      ) : null,
    },
    {
      name: 'L2 txn hash',
      value: (
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
      ),
    },
    {
      name: 'Age',
      value: timeAgo,
    },
    {
      name: 'Status',
      value: item.status === 'Ready for relay' ?
        <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ item.status }</LinkExternal> :
        item.status,
    },
    {
      name: 'L1 txn hash',
      value: item.l1_tx_hash ? (
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          w="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <Box w="calc(100% - 16px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
        </LinkExternal>
      ) : null,
    },
    {
      name: 'Time left',
      value: timeToEnd,
    },
  ];

  return <ListItemMobileGrid items={ items } gridTemplateColumns="92px auto"/>;
};

export default WithdrawalsListItem;
