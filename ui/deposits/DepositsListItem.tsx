import { Box, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { DepositsItem } from 'types/api/deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: DepositsItem };

const DepositsListItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  const items = [
    {
      name: 'L1 block No',
      value: (
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.l1_block_number.toString() } }) }
          fontWeight={ 600 }
          display="inline-flex"
        >
          <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
          { item.l1_block_number }
        </LinkExternal>
      ),
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
      name: 'L1 txn hash',
      value: (
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
        </LinkExternal>
      ),
    },
    {
      name: 'L1 txn origin',
      value: (
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/address/[hash]', query: { hash: item.l1_tx_origin } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <AddressIcon address={{ hash: item.l1_tx_origin, is_contract: false, implementation_name: '' }} mr={ 2 }/>
          <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_origin }/></Box>
        </LinkExternal>
      ),
    },
    {
      name: 'Gas limit',
      value: BigNumber(item.l2_tx_gas_limit).toFormat(),
    },
  ];

  return <ListItemMobileGrid items={ items } gridTemplateColumns="92px auto"/>;
};

export default DepositsListItem;
