import { Td, Tr, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/address/AddressIcon';
import Icon from 'ui/shared/chakra/Icon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = { item: L2DepositsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l1_block_number.toString() } }) }
          fontWeight={ 600 }
          display="inline-flex"
          isLoading={ isLoading }
        >
          <Icon as={ blockIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } ml={ 1 }>
            { item.l1_block_number }
          </Skeleton>
        </LinkExternal>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
          display="flex"
          width="fit-content"
          alignItems="center"
          overflow="hidden"
          w="100%"
          isLoading={ isLoading }
        >
          <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" ml={ 1 } overflow="hidden" whiteSpace="nowrap">
            <HashStringShorten hash={ item.l2_tx_hash }/>
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
          isLoading={ isLoading }
        >
          <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
            <HashStringShorten hash={ item.l1_tx_hash }/>
          </Skeleton>
        </LinkExternal>
      </Td>
      <Td verticalAlign="middle">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/address/[hash]', query: { hash: item.l1_tx_origin } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
          isLoading={ isLoading }
        >
          <AddressIcon address={{ hash: item.l1_tx_origin, is_contract: false, implementation_name: '' }} isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap" ml={ 2 }>
            <HashStringShorten hash={ item.l1_tx_origin }/>
          </Skeleton>
        </LinkExternal>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span>{ BigNumber(item.l2_tx_gas_limit).toFormat() }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
