/* eslint-disable @typescript-eslint/naming-convention */
import { Box, Td, Tr, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = WithdrawalsItem;

const WithdrawalsTableItem = ({
  msg_nonce,
  msg_nonce_version,
  l1_tx_hash,
  l2_timestamp,
  l2_tx_hash,
  from,
  status,
  challenge_period_end,
}: Props) => {
  const timeAgo = useTimeAgoIncrement(l2_timestamp, false) || 'N/A';
  const timeToEnd = useTimeAgoIncrement(challenge_period_end, false) || '-';
  // const timeToEnd = challenge_period_end ? dayjs(challenge_period_end).fromNow() : '-';

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <Text>{ msg_nonce_version + '-' + msg_nonce }</Text>
      </Td>
      <Td verticalAlign="middle">
        { from ? (
          <Address>
            <AddressIcon address={ from }/>
            <AddressLink hash={ from.hash } type="address" truncation="constant" ml={ 2 }/>
          </Address>
        ) : 'N/A' }
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: l2_tx_hash } }) } display="flex" alignItems="center">
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ l2_tx_hash }/></Box>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        { status === 'Ready for Relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ status }</LinkExternal> :
          <Text>{ status }</Text>
        }
      </Td>
      <Td verticalAlign="middle">
        { l1_tx_hash ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }><HashStringShorten hash={ l1_tx_hash }/></LinkExternal> :
          'N/A'
        }
      </Td>
      <Td verticalAlign="middle">
        { timeToEnd }
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
