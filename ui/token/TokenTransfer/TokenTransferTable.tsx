import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/tokenInfo';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/token/TokenTransfer/TokenTransferTableItem';

interface Props {
  data: Array<TokenTransfer>;
  top: number;
  token: TokenInfo;
}

const TokenTransferTable = ({ data, top, token }: Props) => {

  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="40%">Txn hash</Th>
          { /* replace with method??? */ }
          <Th width="164px">Type</Th>
          <Th width="148px">From</Th>
          <Th width="36px" px={ 0 }/>
          <Th width="218px" >To</Th>
          { (token.type === 'ERC-721' || token.type === 'ERC-1155') && <Th width="20%" isNumeric={ token.type === 'ERC-721' }>Token ID</Th> }
          { (token.type === 'ERC-20' || token.type === 'ERC-1155') && <Th width="20%" isNumeric>Value { token.symbol }</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TokenTransferTableItem key={ index } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenTransferTable);
