import { Tr, Td, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import Tag from 'ui/shared/chakra/Tag';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

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
    <Tr>
      <Td>
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
          truncation="constant_long"
        />
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text_secondary"
          fontWeight="400"
          display="inline-block"
        />
      </Td>
      <Td maxW="120px">
        { item.method && <Tag isLoading={ isLoading }>{ item.method }</Tag> }
      </Td>
      <Td>
        <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon/>
      </Td>
      <Td>
        <AddressFromTo
          maxW={{ lg: '220px', xl: '320px' }}
          from={ item.from }
          to={ item.to }
          isLoading={ isLoading }
          mode={{ lg: 'compact', xl: 'long' }}
        />
      </Td>
      <Td>
        { item.total && 'token_id' in item.total && item.token && (NFT_TOKEN_TYPE_IDS.includes(item.token.type)) && item.total.token_id !== null ? (
          <NftEntity
            hash={ item.token.address }
            id={ item.total.token_id }
            isLoading={ isLoading }
            maxW="140px"
          />
        ) : '-' }
      </Td>
      <Td isNumeric verticalAlign="top">
        { (item.token && valueStr) ? (
          <Flex gap={ 2 } overflow="hidden" justifyContent="flex-end">
            <Skeleton isLoaded={ !isLoading } wordBreak="break-all">
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
      </Td>
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
