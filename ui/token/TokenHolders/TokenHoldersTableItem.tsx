import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { hasTokenIds } from 'lib/token/tokenTypes';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Utilization from 'ui/shared/Utilization/Utilization';
import AssetValue from 'ui/shared/value/AssetValue';

type Props = {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
};

const TokenTransferTableItem = ({ holder, token, isLoading }: Props) => {
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
      { (hasTokenIds(token.type)) && 'token_id' in holder && (
        <TableCell verticalAlign="middle">
          <TruncatedText text={ holder.token_id } loading={ isLoading } w="100%"/>
        </TableCell>
      ) }
      <TableCell verticalAlign="middle" isNumeric>
        <AssetValue
          amount={ holder.value }
          decimals={ token.decimals ?? '0' }
          loading={ isLoading }
        />
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
