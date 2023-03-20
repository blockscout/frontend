import { Box, Flex, Td, Tr, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { OutputRootsItem } from 'types/api/outputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = { item: OutputRootsItem };

const OutputRootsTableItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Text>{ item.l2_output_index }</Text>
      </Td>
      <Td verticalAlign="middle">
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          fontWeight={ 600 }
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString() } }) }
        >
          <Icon as={ txBatchIcon } boxSize={ 6 } mr={ 1 }/>
          { item.l2_block_number }
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Flex>
          <LinkExternal
            w="100%"
            display="inline-flex"
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
          >
            <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
            <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
          </LinkExternal>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex overflow="hidden" whiteSpace="nowrap" w="100%" alignItems="center">
          <Box w="calc(100% - 36px)"><HashStringShortenDynamic hash={ item.output_root }/></Box>
          <CopyToClipboard text={ item.output_root } ml={ 2 }/>
        </Flex>
      </Td>
    </Tr>
  );
};

export default OutputRootsTableItem;
