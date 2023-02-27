import { Box, Flex, Text, HStack, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';

type Props = { item: WithdrawalsItem };

const WithdrawalsListItem = ({ item }: Props) => {
  const timeAgo = useTimeAgoIncrement(item.l2_timestamp, false);
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <LinkInternal
          href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
          display="flex"
          width="fit-content"
          alignItems="center"
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ item.l2_tx_hash }/></Box>
        </LinkInternal>
        <Text variant="secondary">{ timeAgo }</Text>
      </Flex>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Msg nonce</Text>
        <Text variant="secondary">{ item.msg_nonce_version + '-' + item.msg_nonce }</Text>
      </HStack>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Status</Text>
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ item.status }</LinkExternal> :
          <Text variant="secondary">{ item.status }</Text>
        }
      </HStack>
      { item.from && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">From</Text>
          <Address>
            <AddressIcon address={ item.from }/>
            <AddressLink hash={ item.from.hash } type="address" truncation="constant" ml={ 2 }/>
          </Address>
        </HStack>
      ) }
      { item.l1_tx_hash && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">L1 txn hash</Text>
          <LinkExternal
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          >
            <HashStringShorten hash={ item.l1_tx_hash }/>
          </LinkExternal>
        </HStack>
      ) }
      { item.challenge_period_end && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Time left</Text>
          <Text variant="secondary">{ timeToEnd }</Text>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default WithdrawalsListItem;
