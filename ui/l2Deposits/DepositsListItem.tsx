import { Box, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: L2DepositsItem };

const DepositsListItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label>L1 block No</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l1_block_number.toString() } }) }
          fontWeight={ 600 }
          display="inline-flex"
        >
          <Icon as={ blockIcon } boxSize={ 6 } mr={ 1 }/>
          { item.l1_block_number }
        </LinkExternal>
      </ListItemMobileGrid.Value>

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

      <ListItemMobileGrid.Label>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>{ timeAgo }</ListItemMobileGrid.Value>

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

      <ListItemMobileGrid.Label>L1 txn origin</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/address/[hash]', query: { hash: item.l1_tx_origin } }) }
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
        >
          <AddressIcon address={{ hash: item.l1_tx_origin, is_contract: false, implementation_name: '' }} mr={ 2 }/>
          <Box w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_origin }/></Box>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Gas limit</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>{ BigNumber(item.l2_tx_gas_limit).toFormat() }</ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default DepositsListItem;
