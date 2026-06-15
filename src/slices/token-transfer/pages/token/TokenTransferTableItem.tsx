// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import { hasTokenTransferValue, isConfidentialTokenType, NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['TokenTransfer'];
  tokenId?: string;
  isLoading?: boolean;
  instance?: schemas['TokenInstance'];
  chainData?: ClusterChainConfig;
}

const TokenTransferTableItem = ({
  data,
  tokenId,
  isLoading,
  instance,
  chainData,
}: Props) => {

  return (
    <TableRow alignItems="top">
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="5px"/>
        </TableCell>
      ) }
      <TableCell>
        <Flex flexDirection="column" alignItems="flex-start" mt="5px" rowGap={ 3 }>
          { data.transaction_hash ? (
            <TxEntity
              hash={ data.transaction_hash }
              isLoading={ isLoading }
              fontWeight={ 600 }
              noIcon
              truncation="constant_long"
            />
          ) : <Skeleton loading={ isLoading }>-</Skeleton> }
          <TimeWithTooltip
            timestamp={ data.timestamp }
            enableIncrement
            isLoading={ isLoading }
            display="inline-block"
            color="text.secondary"
            fontWeight="400"
          />
        </Flex>
      </TableCell>
      <TableCell>
        { data.method ? (
          <Box my="3px">
            <Badge loading={ isLoading } truncated>{ data.method }</Badge>
          </Box>
        ) : null }
      </TableCell>
      <TableCell>
        <AddressFromTo
          from={ data.from }
          to={ data.to }
          isLoading={ isLoading }
          mt="5px"
          mode={{ lg: 'compact', xl: 'long' }}
          tokenHash={ data.token?.address_hash }
          tokenSymbol={ data.token?.symbol ?? undefined }
        />
      </TableCell>
      { (data.token?.type && NFT_TOKEN_TYPE_IDS.includes(data.token.type)) && (
        <TableCell>
          { data.total && 'token_id' in data.total && data.token && data.total.token_id !== null ? (
            <NftEntity
              hash={ data.token.address_hash }
              id={ data.total.token_id }
              instance={ instance || data.total.token_instance }
              noLink={ Boolean(tokenId && tokenId === data.total.token_id) }
              isLoading={ isLoading }
            />
          ) : ''
          }
        </TableCell>
      ) }
      { data.token && (hasTokenTransferValue(data.token.type, chainData?.app_config)) && (
        <TableCell isNumeric verticalAlign="top">
          { isConfidentialTokenType(data.token.type) ? (
            <ConfidentialValue loading={ isLoading } mt="7px" wordBreak="break-all"/>
          ) : (
            <AssetValue
              amount={ data.total && 'value' in data.total ? data.total.value : null }
              decimals={ data.total && 'decimals' in data.total ? data.total.decimals || '0' : '0' }
              exchangeRate={ data.token?.exchange_rate }
              loading={ isLoading }
              layout="vertical"
              mt="7px"
              rowGap="10px"
            />
          ) }
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
