// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import { hasTokenTransferValue, isConfidentialTokenType, NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props {
  data: schemas['TokenTransfer'];
  tokenId?: string;
  instance?: schemas['TokenInstance'];
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
}

const TokenTransferListItem = ({
  data,
  tokenId,
  isLoading,
  instance,
  chainData,
}: Props) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
        { data.transaction_hash && (
          <TxEntity
            isLoading={ isLoading }
            hash={ data.transaction_hash }
            truncation="constant_long"
            fontWeight="700"
            chain={ chainData }
          />
        ) }
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
          display="inline-block"
        />
      </Flex>
      { data.method && <Badge loading={ isLoading }>{ data.method }</Badge> }
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        isLoading={ isLoading }
        tokenHash={ data.token?.address_hash }
        tokenSymbol={ data.token?.symbol ?? undefined }
        w="100%"
        fontWeight="500"
      />
      { data.total && 'value' in data.total && data.token &&
        (hasTokenTransferValue(data.token.type, chainData?.app_config)) && !isConfidentialTokenType(data.token.type) && (
        <Flex alignItems="center" columnGap={ 2 } maxW="100%" w="full">
          <Skeleton
            display="inline-flex"
            alignItems="center"
            loading={ isLoading }
            flexShrink={ 0 }
            fontWeight={ 500 }
            maxW="50%"
            whiteSpace="pre"
            overflow="hidden"
          >
            <span>Value </span>
            { data.token.symbol && <TruncatedText text={ data.token.symbol } loading={ isLoading }/> }
          </Skeleton>
          <AssetValue
            amount={ data.total.value }
            decimals={ data.total.decimals || '0' }
            exchangeRate={ data.token?.exchange_rate }
            loading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }
      { data.token && isConfidentialTokenType(data.token.type) && (
        <Flex alignItems="center" columnGap={ 2 } maxW="100%" w="full">
          <Skeleton
            display="inline-flex"
            alignItems="center"
            loading={ isLoading }
            flexShrink={ 0 }
            fontWeight={ 500 }
            maxW="50%"
            whiteSpace="pre"
            overflow="hidden"
          >
            <span>Value </span>
            { data.token.symbol && <TruncatedText text={ data.token.symbol } loading={ isLoading }/> }
          </Skeleton>
          <ConfidentialValue
            loading={ isLoading }
            color="text.secondary"
            wordBreak="break-all"
            overflow="hidden"
            flexGrow={ 1 }
          />
        </Flex>
      ) }
      { data.total && 'token_id' in data.total && data.token?.type && (NFT_TOKEN_TYPE_IDS.includes(data.token.type)) && data.total.token_id !== null && (
        <NftEntity
          hash={ data.token.address_hash }
          id={ data.total.token_id }
          instance={ instance || data.total.token_instance }
          noLink={ Boolean(tokenId && tokenId === data.total.token_id) }
          isLoading={ isLoading }
        />
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
