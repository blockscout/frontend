import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { default as Thead } from 'ui/shared/TheadSticky';
import TruncatedValue from 'ui/shared/TruncatedValue';
import TokenTransferTableItem from 'ui/token/TokenTransfer/TokenTransferTableItem';

interface Props {
  data: Array<TokenTransfer>;
  top: number;
  showSocketInfo: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  tokenId?: string;
  isLoading?: boolean;
  token?: TokenInfo;
}

const TokenTransferTable = ({ data, top, showSocketInfo, socketInfoAlert, socketInfoNum, tokenId, isLoading, token }: Props) => {
  const tokenType = data[0].token.type;

  return (
    <Table variant="simple" size="sm" minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th width={ tokenType === 'ERC-1155' ? '60%' : '80%' }>Txn hash</Th>
          <Th width="164px">Method</Th>
          <Th width="160px">From</Th>
          <Th width="36px" px={ 0 }/>
          <Th width="218px" >To</Th>
          { (tokenType === 'ERC-721' || tokenType === 'ERC-1155') && <Th width="20%" isNumeric={ tokenType === 'ERC-721' }>Token ID</Th> }
          { (tokenType === 'ERC-20' || tokenType === 'ERC-1155') && (
            <Th width="20%" isNumeric>
              <TruncatedValue value={ `Value ${ token?.symbol || '' }` } w="100%" verticalAlign="middle"/>
            </Th>
          ) }
        </Tr>
      </Thead>
      <Tbody>
        { showSocketInfo && (
          <SocketNewItemsNotice.Desktop
            url={ window.location.href }
            alert={ socketInfoAlert }
            num={ socketInfoNum }
            type="token_transfer"
            isLoading={ isLoading }
          />
        ) }
        { data.map((item, index) => (
          <TokenTransferTableItem
            key={ item.tx_hash + item.block_hash + item.log_index + '_' + index }
            { ...item }
            tokenId={ tokenId }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenTransferTable);
