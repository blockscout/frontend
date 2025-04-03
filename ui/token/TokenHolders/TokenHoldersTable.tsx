import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TokenHoldersTableItem from 'ui/token/TokenHolders/TokenHoldersTableItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
  isLoading?: boolean;
}

const TokenHoldersTable = ({ data, token, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Holder</TableColumnHeader>
          { (token.type === 'ERC-1155' || token.type === 'ERC-404') && <TableColumnHeader>ID#</TableColumnHeader> }
          <TableColumnHeader isNumeric>Quantity</TableColumnHeader>
          { token.total_supply && token.type !== 'ERC-404' && <TableColumnHeader isNumeric width="175px">Percentage</TableColumnHeader> }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <TokenHoldersTableItem key={ item.address.hash + (isLoading ? index : '') } holder={ item } token={ token } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(TokenHoldersTable);
