// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { InternalTransaction } from 'src/slices/internal-tx/types/api';

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

type Props = InternalTransaction & { currentAddress?: string; isLoading?: boolean; showBlockInfo?: boolean; chainData?: ClusterChainConfig };

const InternalTxsListItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block_number: blockNumber,
  timestamp,
  currentAddress,
  isLoading,
  showBlockInfo = true,
  chainData,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <TxEntity
          hash={ txnHash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          truncation="constant_long"
          chain={ chainData }
        />
        <TimeWithTooltip
          timestamp={ timestamp }
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
            number={ blockNumber }
            noIcon
            textStyle="sm"
          />
        </HStack>
      ) }
      <AddressFromTo
        from={ from }
        to={ toData }
        current={ currentAddress }
        isLoading={ isLoading }
        w="100%"
      />
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Value { currencyUnits.ether }</Skeleton>
        <NativeCoinValue
          amount={ value }
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
