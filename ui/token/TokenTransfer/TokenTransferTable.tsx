import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/token/TokenTransfer/TokenTransferTableItem';

interface Props {
  data: Array<TokenTransfer>;
  top: number;
  token: TokenInfo;
  showSocketInfo: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
}

const TokenTransferTable = ({ data, top, token, showSocketInfo, socketInfoAlert, socketInfoNum }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width={ token.type === 'ERC-1155' ? '60%' : '80%' }>Txn hash</Th>
          <Th width="164px">Method</Th>
          <Th width="148px">From</Th>
          <Th width="36px" px={ 0 }/>
          <Th width="218px" >To</Th>
          { (token.type === 'ERC-721' || token.type === 'ERC-1155') && <Th width="20%" isNumeric={ token.type === 'ERC-721' }>Token ID</Th> }
          { (token.type === 'ERC-20' || token.type === 'ERC-1155') && <Th width="20%" isNumeric>Value { trimTokenSymbol(token.symbol) }</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { showSocketInfo && (
          <Tr>
            <Td colSpan={ 10 } p={ 0 }>
              <SocketNewItemsNotice
                borderRadius={ 0 }
                pl="10px"
                url={ window.location.href }
                alert={ socketInfoAlert }
                num={ socketInfoNum }
                type="token_transfer"
              />
            </Td>
          </Tr>
        ) }
        { data.map((item, index) => (
          <TokenTransferTableItem key={ index } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenTransferTable);
