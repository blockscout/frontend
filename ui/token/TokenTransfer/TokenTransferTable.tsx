import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
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
  token: TokenInfo;
}

const TokenTransferTable = ({ data, top, showSocketInfo, socketInfoAlert, socketInfoNum, tokenId, isLoading, token }: Props) => {

  const tokenType = token.type;

  return (
    <AddressHighlightProvider>
      <Table minW="950px">
        <Thead top={ top }>
          <Tr>
            <Th width="280px">Txn hash</Th>
            <Th width="200px">Method</Th>
            <Th width={{ lg: '224px', xl: '380px' }}>From/To</Th>
            { (NFT_TOKEN_TYPE_IDS.includes(tokenType)) &&
              <Th width={ tokenType === 'ERC-1155' || tokenType === 'ERC-404' ? '50%' : '100%' }>Token ID</Th>
            }
            { (tokenType === 'ERC-20' || tokenType === 'ERC-1155' || tokenType === 'ERC-404') && (
              <Th width={ tokenType === 'ERC-20' ? '100%' : '50%' } isNumeric>
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
              key={ item.transaction_hash + item.block_hash + item.log_index + '_' + index }
              { ...item }
              tokenId={ tokenId }
              isLoading={ isLoading }
            />
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransferTable);
