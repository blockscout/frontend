// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TokenTransfer } from 'src/slices/token-transfer/types/api';
import { getTokenTypeName, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'src/slices/tx/components/TxAdditionalInfo';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenTransferTypeBadge from '../TokenTransferTypeBadge';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
};

const TokenTransferListItem = ({
  token,
  total,
  transaction_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  token_type: transferTokenType,
  timestamp,
  enableTimeIncrement,
  isLoading,
  chainData,
}: Props) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex w="100%" justifyContent="space-between">
        <Flex flexWrap="wrap" rowGap={ 1 } mr={ showTxInfo && txHash ? 2 : 0 } columnGap={ 2 } overflow="hidden">
          { token && (
            <>
              <TokenEntity
                token={ token }
                isLoading={ isLoading }
                noSymbol
                noCopy
                w="auto"
              />
              <Badge flexShrink={ 0 } loading={ isLoading }>{ getTokenTypeName(token.type, chainData?.app_config) }</Badge>
            </>
          ) }
          <TokenTransferTypeBadge methodType={ type } tokenType={ token?.type } transferTokenType={ transferTokenType } loading={ isLoading }/>
        </Flex>
        { showTxInfo && txHash && (
          <TxAdditionalInfo hash={ txHash } isMobile isLoading={ isLoading }/>
        ) }
      </Flex>
      { total && 'token_id' in total && total.token_id !== null && token && (
        <NftEntity hash={ token.address_hash } id={ total.token_id } instance={ total.token_instance } isLoading={ isLoading }/>
      ) }
      { showTxInfo && (
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
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
            fontWeight="400"
            fontSize="sm"
          />
        </Flex>
      ) }
      <AddressFromTo
        from={ from }
        to={ to }
        current={ baseAddress }
        isLoading={ isLoading }
        w="100%"
      />
      { total && 'value' in total && total.value !== null && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Value</Skeleton>
          <AssetValue
            amount={ total && 'value' in total && total.value !== null ? total.value : null }
            decimals={ total && 'decimals' in total ? total.decimals || '0' : '0' }
            exchangeRate={ token?.exchange_rate }
            loading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }

      { token && isConfidentialTokenType(token.type) && (!total || !('value' in total) || total.value === null) && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Value</Skeleton>
          <ConfidentialValue loading={ isLoading } color="text.secondary"/>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
