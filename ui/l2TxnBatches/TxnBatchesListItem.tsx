import { Skeleton, VStack } from '@chakra-ui/react';
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
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

const feature = config.features.rollup;

type Props = { item: L2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          size="sm"
          fontWeight={ 600 }
        />
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
        <BlockEntityL1
          isLoading={ isLoading }
          number={ item.epoch_number }
          size="sm"
          noIcon
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <VStack spacing={ 3 } w="100%" overflow="hidden" alignItems="flex-start">
          { item.l1_tx_hashes.map(hash => (
            <LinkExternal
              maxW="100%"
              display="inline-flex"
              href={ feature.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: hash } }) }
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
