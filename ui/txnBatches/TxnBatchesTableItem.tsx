import { Box, Td, Tr, Text, Icon, VStack } from '@chakra-ui/react';
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

type Props = { item: TxnBatchesItem };

const TxnBatchesTableItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <Tr>
      <Td>
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
      <Td>
        <LinkInternal
          href={ route({ pathname: '/block/[height]', query: { height: item.l2_block_number.toString(), tab: 'txs' } }) }
          lineHeight="24px"
        >
          { item.tx_count }
        </LinkInternal>
      </Td>
      <Td>
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.epoch_number.toString() } }) }
          fontWeight={ 600 }
          lineHeight="24px"
          display="inline-flex"
        >
          { item.epoch_number }
        </LinkExternal>
      </Td>
      <Td pr={ 12 }>
        <VStack spacing={ 3 }>
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              w="100%"
              display="inline-flex"
              key={ hash }
              href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
            >
              <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
              <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ hash }/></Box>
            </LinkExternal>
          )) }
        </VStack>
      </Td>
      <Td>
        <Text variant="secondary" lineHeight="24px">{ timeAgo }</Text>
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
