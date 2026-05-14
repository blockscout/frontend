// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'client/slices/token-transfer/types/api';
import { getTokenTypeName, isConfidentialTokenType } from 'client/slices/token/utils/token-types';
import type { ClusterChainConfig } from 'types/multichain';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'client/slices/tx/components/TxAdditionalInfo';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import AssetValue from 'ui/shared/value/AssetValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';

import TokenTransferTypeBadge from '../TokenTransferTypeBadge';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
};

const TokenTransferTableItem = ({
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
    <TableRow alignItems="top">
      { showTxInfo && (
        <TableCell>
          {
            txHash ? (
              <Box my="3px" textAlign="center">
                <TxAdditionalInfo hash={ txHash } isLoading={ isLoading }/>
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
        { token ? (
          <>
            <TokenEntity
              token={ token }
              isLoading={ isLoading }
              noSymbol
              noCopy
              mt={ 1 }
            />
            <Flex columnGap={ 2 } rowGap={ 2 } mt={ 2 } flexWrap="wrap">
              <Badge loading={ isLoading }>{ getTokenTypeName(token.type, chainData?.app_config) }</Badge>
              <TokenTransferTypeBadge methodType={ type } tokenType={ token.type } transferTokenType={ transferTokenType } loading={ isLoading }/>
            </Flex>
          </>
        ) : 'N/A' }
      </TableCell>
      <TableCell>
        { total && 'token_id' in total && total.token_id !== null && token && (
          <NftEntity
            hash={ token.address_hash }
            id={ total.token_id }
            instance={ total.token_instance }
            isLoading={ isLoading }
          />
        ) }
      </TableCell>
      { showTxInfo && (
        <TableCell>
          { txHash ? (
            <TxEntity
              hash={ txHash }
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
            timestamp={ timestamp }
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
          from={ from }
          to={ to }
          current={ baseAddress }
          isLoading={ isLoading }
          mt={ 1 }
          mode={{ lg: 'compact', xl: 'long' }}
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="top">
        { token && isConfidentialTokenType(token.type) && (!total || !('value' in total) || total.value === null) ? (
          <ConfidentialValue loading={ isLoading } mt="4px"/>
        ) : (
          <AssetValue
            amount={ total && 'value' in total && total.value !== null ? total.value : null }
            decimals={ total && 'decimals' in total ? total.decimals || '0' : '0' }
            exchangeRate={ token?.exchange_rate }
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
