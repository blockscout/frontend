import { Tr, Td, Flex, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import InOutTag from 'ui/shared/InOutTag';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

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
  const timeAgo = useTimeAgoIncrement(timestamp, enableTimeIncrement);
  const { usd, valueStr } = 'value' in total ? getCurrencyValue({
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
        <Flex flexDir="column" alignItems="flex-start" my="3px" rowGap={ 2 }>
          <TokenEntity
            token={ token }
            isLoading={ isLoading }
            noSymbol
            noCopy
            my="2px"
          />
          <Tag isLoading={ isLoading }>{ token.type }</Tag>
          <Tag colorScheme="orange" isLoading={ isLoading }>{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
      </Td>
      <Td>
        { 'token_id' in total && <NftEntity hash={ token.address } id={ total.token_id } isLoading={ isLoading }/> }
      </Td>
      { showTxInfo && txHash && (
        <Td>
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
            mt="7px"
          />
          { timestamp && (
            <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" mt="10px" display="inline-block">
              <span>{ timeAgo }</span>
            </Skeleton>
          ) }
        </Td>
      ) }
      <Td>
        <AddressEntity
          address={ from }
          isLoading={ isLoading }
          my="5px"
          noLink={ baseAddress === from.hash }
          noCopy={ baseAddress === from.hash }
          flexGrow={ 1 }
        />
      </Td>
      { baseAddress && (
        <Td px={ 0 }>
          <Box mt="3px">
            <InOutTag
              isIn={ baseAddress === to.hash }
              isOut={ baseAddress === from.hash }
              w="50px"
              textAlign="center"
              isLoading={ isLoading }
            />
          </Box>
        </Td>
      ) }
      <Td>
        <AddressEntity
          address={ to }
          isLoading={ isLoading }
          my="5px"
          noLink={ baseAddress === to.hash }
          noCopy={ baseAddress === to.hash }
          flexGrow={ 1 }
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
