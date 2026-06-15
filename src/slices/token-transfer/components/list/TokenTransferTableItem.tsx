// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box } from '@chakra-ui/react';
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
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import TokenTransferTypeBadge from '../TokenTransferTypeBadge';

interface Props {
  data: schemas['TokenTransfer'];
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
};

const TokenTransferTableItem = ({
  data,
  baseAddress,
  showTxInfo,
  enableTimeIncrement,
  isLoading,
  chainData,
}: Props) => {

  return (
    <TableRow alignItems="top">
      { showTxInfo && (
        <TableCell>
          {
            data.transaction_hash ? (
              <Box my="3px" textAlign="center">
                <TxAdditionalInfo hash={ data.transaction_hash } isLoading={ isLoading }/>
              </Box>
            ) : (
              <div/>
            )
          }
        </TableCell>
      ) }
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my={ 1 }/>
        </TableCell>
      ) }
      <TableCell>
        { data.token ? (
          <>
            <TokenEntity
              token={ data.token }
              isLoading={ isLoading }
              noSymbol
              noCopy
              mt={ 1 }
            />
            <Flex columnGap={ 2 } rowGap={ 2 } mt={ 2 } flexWrap="wrap">
              { data.token.type && <Badge loading={ isLoading }>{ getTokenTypeName(data.token.type, chainData?.app_config) }</Badge> }
              <TokenTransferTypeBadge
                methodType={ data.type }
                tokenType={ data.token.type ?? undefined }
                transferTokenType={ data.token_type }
                loading={ isLoading }
              />
            </Flex>
          </>
        ) : 'N/A' }
      </TableCell>
      <TableCell>
        { data.total && 'token_id' in data.total && data.total.token_id !== null && data.token && (
          <NftEntity
            hash={ data.token.address_hash }
            id={ data.total.token_id }
            instance={ data.total.token_instance }
            isLoading={ isLoading }
          />
        ) }
      </TableCell>
      { showTxInfo && (
        <TableCell>
          { data.transaction_hash ? (
            <TxEntity
              hash={ data.transaction_hash }
              isLoading={ isLoading }
              fontWeight={ 600 }
              noIcon
              mt={ 1 }
              truncation="constant_long"
            />
          ) : (
            <Skeleton loading={ isLoading } mt={ 1 }>-</Skeleton>
          ) }
          <TimeWithTooltip
            timestamp={ data.timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
            fontWeight="400"
            mt="10px"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ data.from }
          to={ data.to }
          current={ baseAddress }
          isLoading={ isLoading }
          mt={ 1 }
          mode={{ base: 'compact', lg: 'compact', xl: 'long' }}
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="top">
        { data.token && isConfidentialTokenType(data.token.type) && (!data.total || !('value' in data.total) || data.total.value === null) ? (
          <ConfidentialValue loading={ isLoading } mt="4px"/>
        ) : (
          <AssetValue
            amount={ data.total && 'value' in data.total && data.total.value !== null ? data.total.value : null }
            decimals={ data.total && 'decimals' in data.total ? data.total.decimals || '0' : '0' }
            exchangeRate={ data.token?.exchange_rate }
            loading={ isLoading }
            layout="vertical"
            mt="4px"
            rowGap="10px"
          />
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
