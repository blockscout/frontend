import { Box, Flex, Text, HStack, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { OutputRootsItem } from 'types/api/outputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';

type Props = { item: OutputRootsItem };

const OutputRootsListItem = ({ item }: Props) => {
  const timeAgo = useTimeAgoIncrement(item.l1_timestamp, false);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        #{ item.l2_output_index }
        { item.l1_timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
      </Flex>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>L2 block</Text>
        <LinkInternal
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString() } }) }
        >
          { item.l2_block_number }
        </LinkInternal>
      </HStack>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">Output root</Text>
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%">
          <Text variant="secondary" w="calc(100% - 36px)"><HashStringShortenDynamic hash={ item.output_root }/></Text>
          <CopyToClipboard text={ item.output_root } ml={ 2 }/>
        </Flex>
      </HStack>
      <LinkExternal w="100%" href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }>
        <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
        <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
      </LinkExternal>
    </ListItemMobile>
  );
};

export default OutputRootsListItem;
