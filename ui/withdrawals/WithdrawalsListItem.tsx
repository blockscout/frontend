/* eslint-disable @typescript-eslint/naming-convention */
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

type Props = WithdrawalsItem;

const WithdrawalsListItem = ({
  msg_nonce,
  msg_nonce_version,
  l1_tx_hash,
  l2_timestamp,
  l2_tx_hash,
  from,
  status,
  challenge_period_end,
}: Props) => {
  const timeAgo = useTimeAgoIncrement(l2_timestamp, false);
  const timeToEnd = dayjs(challenge_period_end).fromNow();

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: l2_tx_hash } }) } display="flex" alignItems="center">
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ l2_tx_hash }/></Box>
        </LinkInternal>
        <Text variant="secondary">{ timeAgo }</Text>
      </Flex>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Msg nonce</Text>
        <Text variant="secondary">{ msg_nonce_version + '-' + msg_nonce }</Text>
      </HStack>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Status</Text>
        { status === 'Ready for Relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ status }</LinkExternal> :
          <Text variant="secondary">{ status }</Text>
        }
      </HStack>
      { from && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">From</Text>
          <Address>
            <AddressIcon address={ from }/>
            <AddressLink hash={ from.hash } type="address" truncation="constant" ml={ 2 }/>
          </Address>
        </HStack>
      ) }
      { l1_tx_hash && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">L1 txn hash</Text>
          <LinkExternal href={ appConfig.L2.withdrawalUrl }><HashStringShorten hash={ l1_tx_hash }/></LinkExternal>
        </HStack>
      ) }
      { challenge_period_end && (
        <HStack spacing={ 3 } width="100%">
          <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Time left</Text>
          <Text variant="secondary">{ timeToEnd }</Text>
        </HStack>
      ) }
    </ListItemMobile>
  );
};

export default WithdrawalsListItem;
