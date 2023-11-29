import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import getCurrencyValue from 'lib/getCurrencyValue';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TruncatedValue from 'ui/shared/TruncatedValue';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean };

const TokenTransferListItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  method,
  timestamp,
  tokenId,
  isLoading,
}: Props) => {
  const timeAgo = useTimeAgoIncrement(timestamp, true);
  const { usd, valueStr } = 'value' in total ? getCurrencyValue({
    value: total.value,
    exchangeRate: token.exchange_rate,
    accuracy: 8,
    accuracyUsd: 2,
    decimals: total.decimals || '0',
  }) : { usd: null, valueStr: null };

  return (
    <ListItemMobile rowGap={ 3 } isAnimated>
      <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
        <TxEntity
          isLoading={ isLoading }
          hash={ txHash }
          truncation="constant"
          fontWeight="700"
        />
        { timestamp && (
          <Skeleton isLoaded={ !isLoading } display="inline-block" fontWeight="400" fontSize="sm" color="text_secondary">
            <span>
              { timeAgo }
            </span>
          </Skeleton>
        ) }
      </Flex>
      { method && <Tag isLoading={ isLoading }>{ method }</Tag> }
      <Flex w="100%" columnGap={ 3 }>
        <AddressEntityWithTokenFilter
          address={ from }
          isLoading={ isLoading }
          tokenHash={ token.address }
          width="50%"
          fontWeight="500"
        />
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
        <AddressEntityWithTokenFilter
          address={ to }
          isLoading={ isLoading }
          tokenHash={ token.address }
          width="50%"
          fontWeight="500"
        />
      </Flex>
      { valueStr && (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton isLoaded={ !isLoading } flexShrink={ 0 } fontWeight={ 500 }>
            Value
          </Skeleton>
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            <span>{ valueStr }</span>
          </Skeleton>
          { token.symbol && <TruncatedValue isLoading={ isLoading } value={ token.symbol }/> }
          { usd && <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>(${ usd })</span></Skeleton> }
        </Flex>
      ) }
      { 'token_id' in total && (token.type === 'ERC-721' || token.type === 'ERC-1155') && (
        <NftEntity
          hash={ token.address }
          id={ total.token_id }
          noLink={ Boolean(tokenId && tokenId === total.token_id) }
          isLoading={ isLoading }
        />
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
