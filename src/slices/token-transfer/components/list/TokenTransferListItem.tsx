// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
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

interface Props {
  data: schemas['TokenTransfer'];
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
};

const TokenTransferListItem = ({
  data,
  baseAddress,
  showTxInfo,
  enableTimeIncrement,
  isLoading,
  chainData,
}: Props) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex w="100%" justifyContent="space-between">
        <Flex flexWrap="wrap" rowGap={ 1 } mr={ showTxInfo && data.transaction_hash ? 2 : 0 } columnGap={ 2 } overflow="hidden">
          { data.token && (
            <>
              <TokenEntity
                token={ data.token }
                isLoading={ isLoading }
                noSymbol
                noCopy
                w="auto"
              />
              { data.token.type && <Badge flexShrink={ 0 } loading={ isLoading }>{ getTokenTypeName(data.token.type, chainData?.app_config) }</Badge> }
            </>
          ) }
          <TokenTransferTypeBadge
            methodType={ data.type }
            tokenType={ data.token?.type ?? undefined }
            transferTokenType={ data.token_type }
            loading={ isLoading }
          />
        </Flex>
        { showTxInfo && data.transaction_hash && (
          <TxAdditionalInfo hash={ data.transaction_hash } isMobile isLoading={ isLoading }/>
        ) }
      </Flex>
      { data.total && 'token_id' in data.total && data.total.token_id !== null && data.token && (
        <NftEntity hash={ data.token.address_hash } id={ data.total.token_id } instance={ data.total.token_instance } isLoading={ isLoading }/>
      ) }
      { showTxInfo && (
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
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
            fontWeight="400"
            fontSize="sm"
          />
        </Flex>
      ) }
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        current={ baseAddress }
        isLoading={ isLoading }
        w="100%"
      />
      { data.total && 'value' in data.total && data.total.value !== null && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Value</Skeleton>
          <AssetValue
            amount={ data.total && 'value' in data.total && data.total.value !== null ? data.total.value : null }
            decimals={ data.total && 'decimals' in data.total ? data.total.decimals || '0' : '0' }
            exchangeRate={ data.token?.exchange_rate }
            loading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }

      { data.token && isConfidentialTokenType(data.token.type) && (!data.total || !('value' in data.total) || data.total.value === null) && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Value</Skeleton>
          <ConfidentialValue loading={ isLoading } color="text.secondary"/>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
