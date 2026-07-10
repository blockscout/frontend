// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { hasTokenIds, hasTokenTransferValue, isConfidentialTokenType, isFungibleTokenType, NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import TokenTransferTableItem from 'src/slices/token-transfer/pages/token/TokenTransferTableItem';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props {
  data: Array<schemas['TokenTransfer']>;
  top?: number;
  showSocketInfo: boolean;
  showSocketErrorAlert?: boolean;
  socketInfoNum?: number;
  tokenId?: string;
  isLoading?: boolean;
  token: schemas['Token'];
  instance?: schemas['TokenInstance'];
}

const TokenTransferTable = ({ data, top, showSocketInfo, showSocketErrorAlert, socketInfoNum, tokenId, isLoading, token, instance }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const tokenType = token.type;

  return (
    <AddressHighlightProvider>
      <TableRoot minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"/> }
            <TableColumnHeader width="280px">
              Txn hash
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="200px">Method</TableColumnHeader>
            <TableColumnHeader width={{ lg: '224px', xl: '380px' }}>From/To</TableColumnHeader>
            { (tokenType && NFT_TOKEN_TYPE_IDS.includes(tokenType)) &&
              <TableColumnHeader width={ hasTokenIds(tokenType) ? '50%' : '100%' }>Token ID</TableColumnHeader>
            }
            { hasTokenTransferValue(tokenType, chainData?.app_config) && (
              <TableColumnHeader
                width={ (isFungibleTokenType(tokenType, chainData?.app_config) || isConfidentialTokenType(tokenType)) ? '100%' : '50%' }
                isNumeric
              >
                <TruncatedText text={ `Value ${ token?.symbol || '' }` } w="100%" verticalAlign="middle"/>
              </TableColumnHeader>
            ) }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              showErrorAlert={ showSocketErrorAlert }
              num={ socketInfoNum }
              type="token_transfer"
              isLoading={ isLoading }
            />
          ) }
          { data.map((item, index) => (
            <TokenTransferTableItem
              key={ item.transaction_hash + item.block_hash + item.log_index + '_' + index }
              data={ item }
              tokenId={ tokenId }
              instance={ instance }
              isLoading={ isLoading }
              chainData={ chainData }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransferTable);
