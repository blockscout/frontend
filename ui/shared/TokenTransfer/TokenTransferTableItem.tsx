import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
};

const TokenTransferTableItem = ({
  token,
  total,
  transaction_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  timestamp,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const { usd, valueStr } = total && 'value' in total && total.value !== null ? getCurrencyValue({
    value: total.value,
    exchangeRate: token?.exchange_rate,
    accuracy: 8,
    accuracyUsd: 2,
    decimals: total.decimals || '0',
  }) : { usd: null, valueStr: null };

  return (
    <TableRow alignItems="top">
      { showTxInfo && txHash && (
        <TableCell>
          <Box my="3px">
            <TxAdditionalInfo hash={ txHash } isLoading={ isLoading }/>
          </Box>
        </TableCell>
      ) }
      <TableCell>
        { token ? (
          <>
            <TokenEntity
              token={ token }
              isLoading={ isLoading }
              noSymbol
              noCopy
              mt={ 1 }
            />
            <Flex columnGap={ 2 } rowGap={ 2 } mt={ 2 } flexWrap="wrap">
              <Badge loading={ isLoading }>{ getTokenTypeName(token.type) }</Badge>
              <Badge colorPalette="orange" loading={ isLoading }>{ getTokenTransferTypeText(type) }</Badge>
            </Flex>
          </>
        ) : 'N/A' }
      </TableCell>
      <TableCell>
        { total && 'token_id' in total && total.token_id !== null && token && (
          <NftEntity
            hash={ token.address_hash }
            id={ total.token_id }
            instance={ total.token_instance }
            isLoading={ isLoading }
          />
        ) }
      </TableCell>
      { showTxInfo && txHash && (
        <TableCell>
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
            mt="7px"
            truncation="constant_long"
          />
          <TimeWithTooltip
            timestamp={ timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
            fontWeight="400"
            mt="10px"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ from }
          to={ to }
          current={ baseAddress }
          isLoading={ isLoading }
          mt={ 1 }
          mode={{ lg: 'compact', xl: 'long' }}
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="top">
        { valueStr && (
          <Skeleton loading={ isLoading } display="inline-block" mt="7px" wordBreak="break-all">
            { valueStr }
          </Skeleton>
        ) }
        { usd && (
          <Skeleton loading={ isLoading } color="text.secondary" mt="10px" ml="auto" w="min-content">
            <span>${ usd }</span>
          </Skeleton>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
