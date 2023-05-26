import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2OutputRootsItem } from 'types/api/l2OutputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: L2OutputRootsItem };

const OutputRootsListItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label>L2 output index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text">
        { item.l2_output_index }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>{ timeAgo }</ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString() } }) }
        >
          { item.l2_block_number }
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkExternal
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Output root</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%" justifyContent="space-between">
          <Text variant="secondary" w="calc(100% - 24px)"><HashStringShortenDynamic hash={ item.output_root }/></Text>
          <CopyToClipboard text={ item.output_root }/>
        </Flex>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OutputRootsListItem;
