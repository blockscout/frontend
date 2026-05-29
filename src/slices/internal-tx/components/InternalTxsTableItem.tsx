// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { InternalTransaction } from 'src/slices/internal-tx/types/api';

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

type Props = InternalTransaction & { currentAddress?: string; isLoading?: boolean; showBlockInfo?: boolean; chainData?: ClusterChainConfig };

const InternalTxsTableItem = ({
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
    <TableRow alignItems="top">
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="2px"/>
        </TableCell>
      ) }
      <TableCell>
        <Flex rowGap={ 3 } flexDir="column" my="2px">
          <TxEntity
            hash={ txnHash }
            isLoading={ isLoading }
            fontWeight={ 700 }
            noIcon
            truncation="constant_long"
          />
          <TimeWithTooltip
            timestamp={ timestamp }
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
          { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
        </Flex>
      </TableCell>
      { showBlockInfo && (
        <TableCell>
          <BlockEntity
            isLoading={ isLoading }
            number={ blockNumber }
            noIcon
            textStyle="sm"
            fontWeight={ 500 }
            my="2px"
          />
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ from }
          to={ toData }
          current={ currentAddress }
          isLoading={ isLoading }
          my="2px"
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ value }
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
