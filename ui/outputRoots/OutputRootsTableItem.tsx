/* eslint-disable @typescript-eslint/naming-convention */
import { Box, Flex, Td, Tr, Text, Icon } from '@chakra-ui/react';
import React from 'react';

import type { OutputRootsItem } from 'types/api/outputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = OutputRootsItem;

const OutputRootsTableItem = ({
  l2_output_index,
  l1_timestamp,
  l2_block_number,
  l1_tx_hash,
  output_root,
}: Props) => {
  const url = link('tx', { id: l1_tx_hash }, {}, appConfig.l1BaseUrl);

  const timeAgo = useTimeAgoIncrement(l1_timestamp, false);

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Text>{ l2_output_index }</Text>
      </Td>
      <Td verticalAlign="middle">
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal fontWeight={ 600 } display="flex" alignItems="center" href={ link('block', { id: l2_block_number.toString() }) }>
          <Icon as={ txBatchIcon } boxSize={ 6 } mr={ 1 }/>
          { l2_block_number }
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Flex>
          <LinkExternal href={ url } w="100%">
            <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
            <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ l1_tx_hash }/></Box>
          </LinkExternal>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex overflow="hidden" whiteSpace="nowrap" w="100%" alignItems="center">
          <Box w="calc(100% - 36px)"><HashStringShortenDynamic hash={ output_root }/></Box>
          <CopyToClipboard text={ output_root } ml={ 2 }/>
        </Flex>
      </Td>
    </Tr>
  );
};

export default OutputRootsTableItem;
