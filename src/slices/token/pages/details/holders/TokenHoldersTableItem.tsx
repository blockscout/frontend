// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { hasTokenIds, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import Utilization from 'src/shared/values/utilization/Utilization';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props {
  holder: schemas['TokenHolderResponse'];
  token: schemas['Token'];
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
      { (hasTokenIds(token.type)) && 'token_id' in holder && holder.token_id !== null && (
        <TableCell verticalAlign="middle">
          <TruncatedText text={ holder.token_id } loading={ isLoading } w="100%"/>
        </TableCell>
      ) }
      <TableCell verticalAlign="middle" isNumeric>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading } wordBreak="break-word"/>
        ) : (
          <AssetValue
            amount={ holder.value }
            decimals={ token.decimals ?? '0' }
            loading={ isLoading }
          />
        ) }
      </TableCell>
      { token.total_supply && token.type !== 'ERC-404' && !isConfidentialTokenType(token.type) && (
        <TableCell verticalAlign="middle" isNumeric>
          <Utilization
            value={ BigNumber(holder.value ?? '0').div(BigNumber(token.total_supply)).dp(4).toNumber() }
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
