// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TokenTransferTableItem from './TokenTransfersTableItem';

interface Props {
  items?: Array<schemas['TokenTransfer']>;
  top: number;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
}

const TokenTransferTable = ({ items, top, isLoading, chainData }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot minW="950px" tableLayout="auto">
        <TableHeaderSticky top={ top }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"/> }
            <TableColumnHeader>
              Txn hash
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>Method</TableColumnHeader>
            <TableColumnHeader>Block</TableColumnHeader>
            <TableColumnHeader>From/To</TableColumnHeader>
            <TableColumnHeader>Token ID</TableColumnHeader>
            <TableColumnHeader isNumeric>Amount</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items?.map((item, index) => (
            <TokenTransferTableItem
              key={ (item.transaction_hash ?? '') + item.log_index + (isLoading ? index : '') + (chainData ? chainData.id : '') }
              item={ item }
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
