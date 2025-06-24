import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  item: TokenTransfer;
  isLoading: boolean;
};

const TokenTransfersListItem = ({ item, isLoading }: Props) => {

  const { valueStr } = item.total && 'value' in item.total && item.total.value !== null ? getCurrencyValue({
    value: item.total.value,
    exchangeRate: item.token?.exchange_rate,
    accuracy: 8,
    accuracyUsd: 2,
    decimals: item.total.decimals || '0',
  }) : { valueStr: null };

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity hash={ item.transaction_hash } isLoading={ isLoading } truncation="constant_long" noIcon/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          enableIncrement
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      { item.method && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Method</ListItemMobileGrid.Label><ListItemMobileGrid.Value>
            <Badge loading={ isLoading }>{ item.method }</Badge>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity address={ item.from } isLoading={ isLoading } truncation="constant"/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity address={ item.to } isLoading={ isLoading } truncation="constant"/>
      </ListItemMobileGrid.Value>

      { item.total && 'token_id' in item.total && item.token && (NFT_TOKEN_TYPE_IDS.includes(item.token.type)) && item.total.token_id !== null && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Token ID</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value overflow="hidden">
            <NftEntity
              hash={ item.token.address_hash }
              id={ item.total.token_id }
              instance={ item.total.token_instance }
              isLoading={ isLoading }
              noIcon
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { valueStr && item.token && (item.token.type === 'ERC-20' || item.token.type === 'ERC-1155') && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Amount</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Flex gap={ 2 } overflow="hidden">
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
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default TokenTransfersListItem;
