import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
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
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={ holder.address }
          isLoading={ isLoading }
          flexGrow={ 1 }
          fontWeight="700"
        />
      </TableCell>
      { (token.type === 'ERC-1155' || token.type === 'ERC-404') && 'token_id' in holder && (
        <TableCell verticalAlign="middle">
          <Skeleton loading={ isLoading } display="inline-block">
            { 'token_id' in holder && holder.token_id }
          </Skeleton>
        </TableCell>
      ) }
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" wordBreak="break-word">
          { quantity }
        </Skeleton>
      </TableCell>
      { token.total_supply && token.type !== 'ERC-404' && (
        <TableCell verticalAlign="middle" isNumeric>
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            display="inline-flex"
            isLoading={ isLoading }
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TokenTransferTableItem);
