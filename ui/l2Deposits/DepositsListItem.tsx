import { Skeleton } from '@chakra-ui/react';
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
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: L2DepositsItem; isLoading?: boolean };

const DepositsListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block No</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l1_block_number.toString() } }) }
          fontWeight={ 600 }
          display="flex"
          isLoading={ isLoading }
        >
          <Icon as={ blockIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } ml={ 1 }>{ item.l1_block_number }</Skeleton>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
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
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
            <HashStringShortenDynamic hash={ item.l2_tx_hash }/>
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ timeAgo }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          maxW="100%"
          display="flex"
          overflow="hidden"
          isLoading={ isLoading }
        >
          <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
            <HashStringShortenDynamic hash={ item.l1_tx_hash }/>
          </Skeleton>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn origin</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/address/[hash]', query: { hash: item.l1_tx_origin } }) }
          maxW="100%"
          display="flex"
          overflow="hidden"
          isLoading={ isLoading }
        >
          <AddressIcon address={{ hash: item.l1_tx_origin, is_contract: false, implementation_name: '' }} isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 44px)" overflow="hidden" whiteSpace="nowrap" ml={ 2 }>
            <HashStringShortenDynamic hash={ item.l1_tx_origin }/>
          </Skeleton>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Gas limit</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ BigNumber(item.l2_tx_gas_limit).toFormat() }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default DepositsListItem;
