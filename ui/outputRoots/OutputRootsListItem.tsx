import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { OutputRootsItem } from 'types/api/outputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: OutputRootsItem };

const OutputRootsListItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  const items = [
    {
      name: 'L2 output index',
      value: item.l2_output_index,
    },
    {
      name: 'Age',
      value: timeAgo,
    },
    {
      name: 'L2 block #',
      value: (
        <LinkInternal
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString() } }) }
        >
          { item.l2_block_number }
        </LinkInternal>
      ),
    },
    {
      name: 'L1 txn hash',
      value: (
        <LinkExternal
          maxW="100%"
          display="inline-flex"
          overflow="hidden"
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
        >
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
        </LinkExternal>
      ),
    },
    {
      name: 'Output root',
      value: (
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%" justifyContent="space-between">
          <Text variant="secondary" w="calc(100% - 24px)"><HashStringShortenDynamic hash={ item.output_root }/></Text>
          <CopyToClipboard text={ item.output_root }/>
        </Flex>
      ),
    },
  ];

  return <ListItemMobileGrid items={ items } gridTemplateColumns="100px auto"/>;
};

export default OutputRootsListItem;
