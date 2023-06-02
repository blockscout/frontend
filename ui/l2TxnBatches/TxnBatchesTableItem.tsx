import { Td, Tr, VStack, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2TxnBatchesItem } from 'types/api/l2TxnBatches';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = { item: L2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <Tr>
      <Td>
        <LinkInternal
          fontWeight={ 600 }
          display="flex"
          width="fit-content"
          alignItems="center"
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString() } }) }
          isLoading={ isLoading }
        >
          <Icon as={ txBatchIcon } boxSize={ 6 } isLoading={ isLoading }/>
          <Skeleton isLoaded={ !isLoading } ml={ 1 }>
            { item.l2_block_number }
          </Skeleton>
        </LinkInternal>
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
        <LinkExternal
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.epoch_number.toString() } }) }
          fontWeight={ 600 }
          display="inline-flex"
          isLoading={ isLoading }
          py="2px"
        >
          <Skeleton isLoaded={ !isLoading } display="inline-block">
            { item.epoch_number }
          </Skeleton>
        </LinkExternal>
      </Td>
      <Td pr={ 12 }>
        <VStack spacing={ 3 } alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              maxW="100%"
              display="inline-flex"
              key={ hash }
              href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
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
