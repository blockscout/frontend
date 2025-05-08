import { Grid, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TruncatedValue from 'ui/shared/TruncatedValue';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean; instance?: TokenInstance };

const TokenTransferListItem = ({
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
    <ListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
        <TxEntity
          isLoading={ isLoading }
          hash={ txHash }
          truncation="constant_long"
          fontWeight="700"
        />
        <TimeWithTooltip
          timestamp={ timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
          display="inline-block"
        />
      </Flex>
      { method && <Badge loading={ isLoading }>{ method }</Badge> }
      <AddressFromTo
        from={ from }
        to={ to }
        isLoading={ isLoading }
        tokenHash={ token?.address_hash }
        tokenSymbol={ token?.symbol ?? undefined }
        w="100%"
        fontWeight="500"
      />
      { valueStr && token && (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Grid gap={ 2 } templateColumns={ `1fr auto auto${ usd ? ' auto' : '' }` }>
          <Skeleton loading={ isLoading } flexShrink={ 0 } fontWeight={ 500 }>
            Value
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            wordBreak="break-all"
            overflow="hidden"
            flexGrow={ 1 }
          >
            <span>{ valueStr }</span>
          </Skeleton>
          { token.symbol && <TruncatedValue isLoading={ isLoading } value={ token.symbol }/> }
          { usd && (
            <Skeleton
              loading={ isLoading }
              color="text.secondary"
              wordBreak="break-all"
              overflow="hidden"
            >
              <span>(${ usd })</span>
            </Skeleton>
          ) }
        </Grid>
      ) }
      { total && 'token_id' in total && token && (NFT_TOKEN_TYPE_IDS.includes(token.type)) && total.token_id !== null && (
        <NftEntity
          hash={ token.address_hash }
          id={ total.token_id }
          instance={ instance || total.token_instance }
          noLink={ Boolean(tokenId && tokenId === total.token_id) }
          isLoading={ isLoading }
        />
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
