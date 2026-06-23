// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import { currencyUnits } from 'src/slices/chain/units';
import { TX_INTERNALS_ITEMS } from 'src/slices/internal-tx/utils/utils';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxStatus from 'src/slices/tx/components/TxStatus';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: schemas['InternalTransaction'];
  currentAddress?: string;
  isLoading?: boolean;
  showBlockInfo?: boolean;
  chainData?: ClusterChainConfig;
}

const InternalTxsListItem = ({
  data,
  currentAddress,
  isLoading,
  showBlockInfo = true,
  chainData,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === data.type)?.title;
  const toData = data.to ? data.to : data.created_contract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !data.success && <TxStatus status="error" errorText={ data.error } isLoading={ isLoading }/> }
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <TxEntity
          hash={ data.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          truncation="constant_long"
          chain={ chainData }
        />
        <TimeWithTooltip
          timestamp={ data.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
        />
      </Flex>
      { showBlockInfo && (
        <HStack gap={ 1 }>
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Block</Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ data.block_number }
            noIcon
            textStyle="sm"
          />
        </HStack>
      ) }
      <AddressFromTo
        from={ data.from }
        to={ toData }
        current={ currentAddress }
        isLoading={ isLoading }
        w="100%"
      />
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value { currencyUnits.ether }</Skeleton>
        <NativeCoinValue
          amount={ data.value }
          noSymbol
          accuracy={ 0 }
          loading={ isLoading }
          minW={ 6 }
          fontSize="sm"
          color="text.secondary"
        />
      </HStack>
    </ListItemMobile>
  );
};

export default InternalTxsListItem;
