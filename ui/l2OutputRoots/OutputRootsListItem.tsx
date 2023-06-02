import { Flex, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2OutputRootsItem } from 'types/api/l2OutputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: L2OutputRootsItem; isLoading?: boolean };

const OutputRootsListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 output index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString() } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.l2_block_number }</Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <LinkExternal
          maxW="100%"
          display="flex"
          overflow="hidden"
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          isLoading={ isLoading }
        >
          <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
            <HashStringShortenDynamic hash={ item.l1_tx_hash }/>
          </Skeleton>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Output root</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%" justifyContent="space-between">
          <Skeleton isLoaded={ !isLoading } color="text_secondary" w="calc(100% - 24px)">
            <HashStringShortenDynamic hash={ item.output_root }/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } isLoading={ isLoading }/>
        </Flex>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OutputRootsListItem;
