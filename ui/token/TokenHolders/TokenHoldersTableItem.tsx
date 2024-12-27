import { Tr, Td, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
};

const TokenTransferTableItem = ({ holder, token, isLoading }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).toFormat();

  return (
    <Tr>
      <Td verticalAlign="middle">
        <AddressEntity
          address={ holder.address }
          isLoading={ isLoading }
          flexGrow={ 1 }
          fontWeight="700"
        />
      </Td>
      { (token.type === 'ERC-1155' || token.type === 'ERC-404') && 'token_id' in holder && (
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading } display="inline-block">
            { 'token_id' in holder && holder.token_id }
          </Skeleton>
        </Td>
      ) }
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" wordBreak="break-word">
          { quantity }
        </Skeleton>
      </Td>
      { token.total_supply && token.type !== 'ERC-404' && (
        <Td verticalAlign="middle" isNumeric>
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            display="inline-flex"
            isLoading={ isLoading }
          />
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
