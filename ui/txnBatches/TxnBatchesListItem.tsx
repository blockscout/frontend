import { Box, Flex, Text, HStack, Icon, VStack } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { TxnBatchesItem } from 'types/api/txnBatches';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';

type Props = { item: TxnBatchesItem };

const TxnBatchesListItem = ({ item }: Props) => {
  const timeAgo = useTimeAgoIncrement(item.l1_tx_timestamp, false);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
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
        <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text>
      </Flex>
      <HStack spacing={ 3 } width="100%">
        <Text fontSize="sm" fontWeight={ 500 } whiteSpace="nowrap">L2 block txn count</Text>
        <LinkInternal href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString(), tab: 'txs' } }) }>
          { item.tx_count }
        </LinkInternal>
      </HStack>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Epoch number</Text>
        <LinkExternal href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.epoch_number.toString() } }) }>
          { item.epoch_number }
        </LinkExternal>
      </HStack>
      <VStack spacing={ 3 } w="100%">
        { item.l1_tx_hashes.map(hash => (
          <LinkExternal
            w="100%"
            href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
            key={ hash }
          >
            <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
            <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ hash }/></Box>
          </LinkExternal>
        )) }
      </VStack>
    </ListItemMobile>
  );
};

export default TxnBatchesListItem;
