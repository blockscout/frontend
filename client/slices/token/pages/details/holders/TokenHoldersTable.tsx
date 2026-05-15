// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenHolder, TokenInfo } from 'client/slices/token/types/api';
import { hasTokenIds, isConfidentialTokenType } from 'client/slices/token/utils/token-types';

import TokenHoldersTableItem from 'client/slices/token/pages/details/holders/TokenHoldersTableItem';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
  isLoading?: boolean;
}

const TokenHoldersTable = ({ data, token, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="70%">Holder</TableColumnHeader>
          { (hasTokenIds(token.type)) && <TableColumnHeader w="30%">ID#</TableColumnHeader> }
          <TableColumnHeader isNumeric width="220px">Quantity</TableColumnHeader>
          { token.total_supply && token.type !== 'ERC-404' && !isConfidentialTokenType(token.type) && (
            <TableColumnHeader isNumeric width="175px">Percentage</TableColumnHeader>
          ) }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => {
          const tokenId = 'token_id' in item ? item.token_id : null;
          return (
            <TokenHoldersTableItem key={ item.address.hash + tokenId + (isLoading ? index : '') } holder={ item } token={ token } isLoading={ isLoading }/>
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(TokenHoldersTable);
