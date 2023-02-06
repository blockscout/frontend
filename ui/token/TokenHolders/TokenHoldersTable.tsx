import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/tokenInfo';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenHoldersTableItem from 'ui/token/TokenHolders/TokenHoldersTableItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
}

const TokenHoldersTable = ({ data, token, top }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th>Holder</Th>
          <Th isNumeric width="300px">Quantity</Th>
          { token.total_supply && <Th isNumeric width="175px">Percentage</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <TokenHoldersTableItem key={ item.address.hash } holder={ item } token={ token }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenHoldersTable);
