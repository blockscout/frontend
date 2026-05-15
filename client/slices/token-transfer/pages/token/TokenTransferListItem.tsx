// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'client/slices/token-transfer/types/api';
import type { TokenInstance } from 'client/slices/token/types/api';
import { hasTokenTransferValue, isConfidentialTokenType, NFT_TOKEN_TYPE_IDS } from 'client/slices/token/utils/token-types';
import type { ClusterChainConfig } from 'types/multichain';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import AssetValue from 'ui/shared/value/AssetValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean; instance?: TokenInstance; chainData?: ClusterChainConfig };

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
  chainData,
}: Props) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
        { txHash && (
          <TxEntity
            isLoading={ isLoading }
            hash={ txHash }
            truncation="constant_long"
            fontWeight="700"
            chain={ chainData }
          />
        ) }
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
      { total && 'value' in total && token && (hasTokenTransferValue(token.type, chainData?.app_config)) && !isConfidentialTokenType(token.type) && (
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
            { token.symbol && <TruncatedText text={ token.symbol } loading={ isLoading }/> }
          </Skeleton>
          <AssetValue
            amount={ total.value }
            decimals={ total.decimals || '0' }
            exchangeRate={ token?.exchange_rate }
            loading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }
      { token && isConfidentialTokenType(token.type) && (
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
            { token.symbol && <TruncatedText text={ token.symbol } loading={ isLoading }/> }
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
