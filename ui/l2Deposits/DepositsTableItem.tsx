import { Box, Td, Tr, Text, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = { item: L2DepositsItem };

const WithdrawalsTableItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.l1_block_number.toString() } }) }
          fontWeight={ 600 }
          display="inline-flex"
        >
          <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
          { item.l1_block_number }
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
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ item.l2_tx_hash }/></Box>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ item.l1_tx_hash }/></Box>
        </LinkExternal>
      </Td>
      <Td verticalAlign="middle">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/address/[hash]', query: { hash: item.l1_tx_origin } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <AddressIcon address={{ hash: item.l1_tx_origin, is_contract: false, implementation_name: '' }} mr={ 2 }/>
          <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ item.l1_tx_origin }/></Box>
        </LinkExternal>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Text variant="secondary">{ BigNumber(item.l2_tx_gas_limit).toFormat() }</Text>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
