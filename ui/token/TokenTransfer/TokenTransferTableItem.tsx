import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean; instance?: TokenInstance };

const TokenTransferTableItem = ({
  token,
  total,
  transaction_hash: txHash,
  from,
  to,
  method,
  timestamp,
  tokenId,
  isLoading,
  instance,
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
      <TableCell>
        <Flex flexDirection="column" alignItems="flex-start" mt="5px" rowGap={ 3 }>
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
            truncation="constant_long"
          />
          <TimeWithTooltip
            timestamp={ timestamp }
            enableIncrement
            isLoading={ isLoading }
            display="inline-block"
            color="gray.500"
            fontWeight="400"
          />
        </Flex>
      </TableCell>
      <TableCell>
        { method ? (
          <Box my="3px">
            <Badge loading={ isLoading } truncated>{ method }</Badge>
          </Box>
        ) : null }
      </TableCell>
      <TableCell>
        <AddressFromTo
          from={ from }
          to={ to }
          isLoading={ isLoading }
          mt="5px"
          mode={{ lg: 'compact', xl: 'long' }}
          tokenHash={ token?.address_hash }
          tokenSymbol={ token?.symbol ?? undefined }
        />
      </TableCell>
      { (token && NFT_TOKEN_TYPE_IDS.includes(token.type)) && (
        <TableCell>
          { total && 'token_id' in total && token && total.token_id !== null ? (
            <NftEntity
              hash={ token.address_hash }
              id={ total.token_id }
              instance={ instance || total.token_instance }
              noLink={ Boolean(tokenId && tokenId === total.token_id) }
              isLoading={ isLoading }
            />
          ) : ''
          }
        </TableCell>
      ) }
      { token && (token.type === 'ERC-20' || token.type === 'ERC-1155' || token.type === 'ERC-404') && (
        <TableCell isNumeric verticalAlign="top">
          { valueStr && (
            <Skeleton loading={ isLoading } display="inline-block" mt="7px" wordBreak="break-all">
              { valueStr }
            </Skeleton>
          ) }
          { usd && (
            <Skeleton loading={ isLoading } color="text.secondary" mt="10px" wordBreak="break-all">
              <span>${ usd }</span>
            </Skeleton>
          ) }
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
