import { Box, Td, Tr, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2WithdrawalsItem } from 'types/api/l2Withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = { item: L2WithdrawalsItem };

const WithdrawalsTableItem = ({ item }: Props) => {
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : 'N/A';
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <Text>{ item.msg_nonce_version + '-' + item.msg_nonce }</Text>
      </Td>
      <Td verticalAlign="middle">
        { item.from ? (
          <Address>
            <AddressIcon address={ item.from }/>
            <AddressLink hash={ item.from.hash } type="address" truncation="constant" ml={ 2 }/>
          </Address>
        ) : 'N/A' }
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
          display="flex"
          width="fit-content"
          alignItems="center"
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ item.l2_tx_hash }/></Box>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ item.status }</LinkExternal> :
          <Text>{ item.status }</Text>
        }
      </Td>
      <Td verticalAlign="middle">
        { item.l1_tx_hash ? (
          <LinkExternal
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          >
            <HashStringShorten hash={ item.l1_tx_hash }/>
          </LinkExternal>
        ) :
          'N/A'
        }
      </Td>
      <Td verticalAlign="middle">
        <Text variant="secondary">{ timeToEnd }</Text>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
