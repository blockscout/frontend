import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import { Badge } from 'toolkit/chakra/badge';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TruncatedValue from 'ui/shared/TruncatedValue';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress?: string; isLoading?: boolean; showBlockInfo?: boolean };

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
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <TableRow alignItems="top">
      <TableCell verticalAlign="middle">
        <Flex rowGap={ 3 } flexDir="column">
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
      <TableCell verticalAlign="middle">
        <Flex rowGap={ 3 } flexDir="column">
          { typeTitle && (
            <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
        </Flex>
      </TableCell>
      { showBlockInfo && (
        <TableCell verticalAlign="middle">
          <BlockEntity
            isLoading={ isLoading }
            number={ blockNumber }
            noIcon
            textStyle="sm"
            fontWeight={ 500 }
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <AddressFromTo
          from={ from }
          to={ toData }
          current={ currentAddress }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <TruncatedValue
          value={ BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
          isLoading={ isLoading }
          minW={ 6 }
          maxW="100%"
          verticalAlign="middle"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(InternalTxsTableItem);
