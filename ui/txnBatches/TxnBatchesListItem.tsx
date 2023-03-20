import { Box, Icon, VStack } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { TxnBatchesItem } from 'types/api/txnBatches';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import dayjs from 'lib/date/dayjs';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: TxnBatchesItem };

const TxnBatchesListItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  const items = [
    {
      name: 'L2 block #',
      value: (
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
      ),
    },
    {
      name: 'L2 block txn count',
      value: (
        <LinkInternal href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString(), tab: 'txs' } }) }>
          { item.tx_count }
        </LinkInternal>
      ),
    },
    {
      name: 'Epoch number',
      value: (
        <LinkExternal
          fontWeight={ 600 }
          display="inline-flex"
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.epoch_number.toString() } }) }
        >
          { item.epoch_number }
        </LinkExternal>
      ),
    },
    {
      name: 'L1 txn hash',
      value: (
        <VStack spacing={ 3 } w="100%" overflow="hidden">
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              w="100%"
              display="inline-flex"
              href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
              key={ hash }
            >
              <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
              <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ hash }/></Box>
            </LinkExternal>
          )) }
        </VStack>
      ),
    },
    {
      name: 'Age',
      value: timeAgo,
    },
  ];

  return <ListItemMobileGrid items={ items } gridTemplateColumns="100px auto"/>;
};

export default TxnBatchesListItem;
