import { Tr, Td, Flex, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import Tag from 'ui/shared/chakra/Tag';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TimeAgoWithTooltip from '../TimeAgoWithTooltip';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TokenTransferTableItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  timestamp,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const { usd, valueStr } = 'value' in total && total.value !== null ? getCurrencyValue({
    value: total.value,
    exchangeRate: token.exchange_rate,
    accuracy: 8,
    accuracyUsd: 2,
    decimals: total.decimals || '0',
  }) : { usd: null, valueStr: null };

  return (
    <Tr alignItems="top">
      { showTxInfo && txHash && (
        <Td>
          <Box my="3px">
            <TxAdditionalInfo hash={ txHash } isLoading={ isLoading }/>
          </Box>
        </Td>
      ) }
      <Td>
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noSymbol
          noCopy
          mt={ 1 }
        />
        <Flex columnGap={ 2 } rowGap={ 2 } mt={ 2 } flexWrap="wrap">
          <Tag isLoading={ isLoading }>{ getTokenTypeName(token.type) }</Tag>
          <Tag colorScheme="orange" isLoading={ isLoading }>{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
      </Td>
      <Td>
        { 'token_id' in total && total.token_id !== null && <NftEntity hash={ token.address } id={ total.token_id } isLoading={ isLoading }/> }
      </Td>
      { showTxInfo && txHash && (
        <Td>
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
            mt="7px"
            truncation="constant_long"
          />
          <TimeAgoWithTooltip
            timestamp={ timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text_secondary"
            fontWeight="400"
            mt="10px"
            display="inline-block"
          />
        </Td>
      ) }
      <Td>
        <AddressFromTo
          from={ from }
          to={ to }
          current={ baseAddress }
          isLoading={ isLoading }
          mt={ 1 }
          mode={{ lg: 'compact', xl: 'long' }}
        />
      </Td>
      <Td isNumeric verticalAlign="top">
        { valueStr && (
          <Skeleton isLoaded={ !isLoading } display="inline-block" mt="7px" wordBreak="break-all">
            { valueStr }
          </Skeleton>
        ) }
        { usd && (
          <Skeleton isLoaded={ !isLoading } color="text_secondary" mt="10px" ml="auto" w="min-content">
            <span>${ usd }</span>
          </Skeleton>
        ) }
      </Td>
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
