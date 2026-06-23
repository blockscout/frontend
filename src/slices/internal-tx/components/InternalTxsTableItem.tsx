// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import { TX_INTERNALS_ITEMS } from 'src/slices/internal-tx/utils/utils';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxStatus from 'src/slices/tx/components/TxStatus';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['InternalTransaction'];
  currentAddress?: string;
  isLoading?: boolean;
  showBlockInfo?: boolean;
  chainData?: ClusterChainConfig;
}

const InternalTxsTableItem = ({
  data,
  currentAddress,
  isLoading,
  showBlockInfo = true,
  chainData,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === data.type)?.title;
  const toData = data.to ? data.to : data.created_contract;

  return (
    <TableRow alignItems="top">
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="2px"/>
        </TableCell>
      ) }
      <TableCell>
        <Flex rowGap={ 3 } flexDir="column" my="2px">
          <TxEntity
            hash={ data.transaction_hash }
            isLoading={ isLoading }
            fontWeight={ 700 }
            noIcon
            truncation="constant_long"
          />
          <TimeWithTooltip
            timestamp={ data.timestamp }
            enableIncrement
            isLoading={ isLoading }
            color="text.secondary"
            fontWeight="400"
            fontSize="sm"
            w="fit-content"
          />
        </Flex>
      </TableCell>
      <TableCell>
        <Flex rowGap={ 2 } flexDir="column">
          { typeTitle && (
            <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge>
          ) }
          { !data.success && <TxStatus status="error" errorText={ data.error } isLoading={ isLoading }/> }
        </Flex>
      </TableCell>
      { showBlockInfo && (
        <TableCell>
          <BlockEntity
            isLoading={ isLoading }
            number={ data.block_number }
            noIcon
            textStyle="sm"
            fontWeight={ 500 }
            my="2px"
          />
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ data.from }
          to={ toData }
          current={ currentAddress }
          isLoading={ isLoading }
          my="2px"
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ data.value }
          noSymbol
          accuracy={ 0 }
          loading={ isLoading }
          minW={ 6 }
          my="2px"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(InternalTxsTableItem);
