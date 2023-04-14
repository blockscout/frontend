import { Tr, Td, Tag, Text, Icon, Grid, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean }

const TokenTransferTableItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  method,
  timestamp,
  tokenId,
  isLoading,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return '-';
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td>
        <Grid alignItems="center" gridTemplateColumns="auto 130px" width="fit-content">
          <Address display="inline-flex" fontWeight={ 600 }>
            <AddressLink type="transaction" hash={ txHash } isLoading={ isLoading }/>
          </Address>
          { timestamp && (
            <Text color="gray.500" fontWeight="400" ml="10px">
              <Skeleton isLoaded={ !isLoading } display="inline-block">
                { timeAgo }
              </Skeleton>
            </Text>
          ) }
        </Grid>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm">
          { method ? <Tag colorScheme="gray">{ method }</Tag> : '-' }
        </Skeleton>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink
            ml={ 2 }
            flexGrow={ 1 }
            fontWeight="500"
            type="address_token"
            hash={ from.hash }
            alias={ from.name }
            tokenHash={ token.address }
            truncation="constant"
            isLoading={ isLoading }
          />
        </Address>
      </Td>
      <Td px={ 0 }>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ to } isLoading={ isLoading }/>
          <AddressLink
            ml={ 2 }
            flexGrow={ 1 }
            fontWeight="500"
            type="address_token"
            hash={ to.hash }
            alias={ to.name }
            tokenHash={ token.address }
            truncation="constant"
            isLoading={ isLoading }
          />
        </Address>
      </Td>
      { (token.type === 'ERC-721' || token.type === 'ERC-1155') && (
        <Td>
          { 'token_id' in total ? (
            <TokenTransferNft
              hash={ token.address }
              id={ total.token_id }
              justifyContent={ token.type === 'ERC-721' ? 'end' : 'start' }
              isDisabled={ Boolean(tokenId && tokenId === total.token_id) }
              isLoading={ isLoading }
            />
          ) : '-'
          }
        </Td>
      ) }
      { (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Td isNumeric verticalAlign="top">
          <Skeleton isLoaded={ !isLoading }>
            { value || '-' }
          </Skeleton>
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
