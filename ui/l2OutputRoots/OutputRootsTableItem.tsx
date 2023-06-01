import { Flex, Td, Tr, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2OutputRootsItem } from 'types/api/l2OutputRoots';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = { item: L2OutputRootsItem; isLoading?: boolean };

const OutputRootsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          fontWeight={ 600 }
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString() } }) }
          isLoading={ isLoading }
        >
          <Icon as={ txBatchIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } display="inline-block" ml={ 1 }>
            { item.l2_block_number }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Flex>
          <LinkExternal
            maxW="100%"
            display="inline-flex"
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
            isLoading={ isLoading }
          >
            <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
            <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 } >
              <HashStringShortenDynamic hash={ item.l1_tx_hash }/>
            </Skeleton>
          </LinkExternal>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex overflow="hidden" whiteSpace="nowrap" w="100%" alignItems="center">
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)">
            <HashStringShortenDynamic hash={ item.output_root }/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      </Td>
    </Tr>
  );
};

export default OutputRootsTableItem;
