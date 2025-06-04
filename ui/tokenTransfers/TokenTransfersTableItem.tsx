import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  item: TokenTransfer;
  isLoading?: boolean;
};

const TokenTransferTableItem = ({ item, isLoading }: Props) => {
  const { valueStr } = item.total && 'value' in item.total && item.total.value !== null ? getCurrencyValue({
    value: item.total.value,
    exchangeRate: item.token?.exchange_rate,
    accuracy: 8,
    accuracyUsd: 2,
    decimals: item.total.decimals || '0',
  }) : { valueStr: null };

  return (
    <TableRow>
      <TableCell>
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
          truncation="constant_long"
        />
        <TimeWithTooltip
          timestamp={ item.timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          display="inline-block"
        />
      </TableCell>
      <TableCell maxW="120px">
        { item.method && <Badge loading={ isLoading }>{ item.method }</Badge> }
      </TableCell>
      <TableCell>
        <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon/>
      </TableCell>
      <TableCell>
        <AddressFromTo
          maxW={{ lg: '220px', xl: '320px' }}
          from={ item.from }
          to={ item.to }
          isLoading={ isLoading }
          mode={{ lg: 'compact', xl: 'long' }}
        />
      </TableCell>
      <TableCell>
        { item.total && 'token_id' in item.total && item.token && (NFT_TOKEN_TYPE_IDS.includes(item.token.type)) && item.total.token_id !== null ? (
          <NftEntity
            hash={ item.token.address_hash }
            id={ item.total.token_id }
            instance={ item.total.token_instance }
            isLoading={ isLoading }
            maxW="140px"
          />
        ) : '-' }
      </TableCell>
      <TableCell isNumeric verticalAlign="top">
        { (item.token && valueStr) ? (
          <Flex gap={ 2 } overflow="hidden" justifyContent="flex-end">
            <Skeleton loading={ isLoading } wordBreak="break-all">
              { valueStr }
            </Skeleton>
            <TokenEntity
              token={ item.token }
              isLoading={ isLoading }
              onlySymbol
              noCopy
              width="auto"
              minW="auto"
              maxW="100px"
            />
          </Flex>
        ) : '-'
        }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
