// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TokenTransfer } from 'src/slices/token-transfer/types/api';
import type { TokenInstance } from 'src/slices/token/types/api';
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

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean; instance?: TokenInstance; chainData?: ClusterChainConfig };

const TokenTransferTableItem = ({
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
    <TableRow alignItems="top">
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="5px"/>
        </TableCell>
      ) }
      <TableCell>
        <Flex flexDirection="column" alignItems="flex-start" mt="5px" rowGap={ 3 }>
          { txHash ? (
            <TxEntity
              hash={ txHash }
              isLoading={ isLoading }
              fontWeight={ 600 }
              noIcon
              truncation="constant_long"
            />
          ) : <Skeleton loading={ isLoading }>-</Skeleton> }
          <TimeWithTooltip
            timestamp={ timestamp }
            enableIncrement
            isLoading={ isLoading }
            display="inline-block"
            color="text.secondary"
            fontWeight="400"
          />
        </Flex>
      </TableCell>
      <TableCell>
        { method ? (
          <Box my="3px">
            <Badge loading={ isLoading } truncated>{ method }</Badge>
          </Box>
        ) : null }
      </TableCell>
      <TableCell>
        <AddressFromTo
          from={ from }
          to={ to }
          isLoading={ isLoading }
          mt="5px"
          mode={{ lg: 'compact', xl: 'long' }}
          tokenHash={ token?.address_hash }
          tokenSymbol={ token?.symbol ?? undefined }
        />
      </TableCell>
      { (token && NFT_TOKEN_TYPE_IDS.includes(token.type)) && (
        <TableCell>
          { total && 'token_id' in total && token && total.token_id !== null ? (
            <NftEntity
              hash={ token.address_hash }
              id={ total.token_id }
              instance={ instance || total.token_instance }
              noLink={ Boolean(tokenId && tokenId === total.token_id) }
              isLoading={ isLoading }
            />
          ) : ''
          }
        </TableCell>
      ) }
      { token && (hasTokenTransferValue(token.type, chainData?.app_config)) && (
        <TableCell isNumeric verticalAlign="top">
          { isConfidentialTokenType(token.type) ? (
            <ConfidentialValue loading={ isLoading } mt="7px" wordBreak="break-all"/>
          ) : (
            <AssetValue
              amount={ total && 'value' in total ? total.value : null }
              decimals={ total && 'decimals' in total ? total.decimals || '0' : '0' }
              exchangeRate={ token?.exchange_rate }
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
