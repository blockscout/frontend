// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'client/slices/internal-tx/types/api';
import type { ClusterChainConfig } from 'types/multichain';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import { TX_INTERNALS_ITEMS } from 'client/slices/internal-tx/utils/utils';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';
import TxStatus from 'client/slices/tx/components/TxStatus';

import { Badge } from 'toolkit/chakra/badge';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

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
