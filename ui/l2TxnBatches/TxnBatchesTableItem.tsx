import { Td, Tr, VStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { L2TxnBatchesItem } from 'types/api/l2TxnBatches';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

const feature = config.features.rollup;

type Props = { item: L2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          size="sm"
          fontWeight={ 600 }
        />
      </Td>
      <Td>
        <LinkInternal
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" my={ 1 }>
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td>
        <BlockEntityL1
          isLoading={ isLoading }
          number={ item.epoch_number }
          size="sm"
          py="2px"
          noIcon
          fontWeight={ 600 }
        />
      </Td>
      <Td pr={ 12 }>
        <VStack spacing={ 3 } alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              maxW="100%"
              display="inline-flex"
              key={ hash }
              href={ feature.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
              isLoading={ isLoading }
            >
              <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
              <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
                <HashStringShortenDynamic hash={ hash }/>
              </Skeleton>
            </LinkExternal>
          )) }
        </VStack>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" my={ 1 } display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
