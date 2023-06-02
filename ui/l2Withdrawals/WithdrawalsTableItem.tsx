import { Td, Tr, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2WithdrawalsItem } from 'types/api/l2Withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = { item: L2WithdrawalsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : 'N/A';
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.msg_nonce_version + '-' + item.msg_nonce }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { item.from ? (
          <Address>
            <AddressIcon address={ item.from } isLoading={ isLoading }/>
            <AddressLink hash={ item.from.hash } type="address" truncation="constant" ml={ 2 } isLoading={ isLoading }/>
          </Address>
        ) : 'N/A' }
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
          display="flex"
          width="fit-content"
          alignItems="center"
          isLoading={ isLoading }
        >
          <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
            <HashStringShorten hash={ item.l2_tx_hash }/>
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span> { timeAgo }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ appConfig.L2.withdrawalUrl }>{ item.status }</LinkExternal> :
          <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.status }</Skeleton>
        }
      </Td>
      <Td verticalAlign="middle">
        { item.l1_tx_hash ? (
          <LinkExternal
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
            isLoading={ isLoading }
            display="inline-flex"
          >
            <Skeleton isLoaded={ !isLoading }>
              <HashStringShorten hash={ item.l1_tx_hash }/>
            </Skeleton>
          </LinkExternal>
        ) :
          'N/A'
        }
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" minW="50px" minH="20px" display="inline-block">{ timeToEnd }</Skeleton>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
