import { Skeleton, VStack } from '@chakra-ui/react';
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
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = { item: L2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
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
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l2_block_number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.tx_count }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Epoch number</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkExternal
          fontWeight={ 600 }
          display="inline-flex"
          href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.epoch_number.toString() } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading }>
            { item.epoch_number }
          </Skeleton>
        </LinkExternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <VStack spacing={ 3 } w="100%" overflow="hidden" alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              maxW="100%"
              display="inline-flex"
              href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
              key={ hash }
              isLoading={ isLoading }
            >
              <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
              <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
                <HashStringShortenDynamic hash={ hash }/>
              </Skeleton>
            </LinkExternal>
          )) }
        </VStack>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ timeAgo }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default TxnBatchesListItem;
