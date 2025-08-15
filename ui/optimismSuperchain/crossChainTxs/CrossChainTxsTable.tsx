import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TxsSocketType } from 'ui/txs/socket/types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import getCurrencySymbol from 'lib/multichain/getCurrencySymbol';
import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';
import TxsSocketNotice from 'ui/txs/socket/TxsSocketNotice';

import CrossChainTxsTableItem from './CrossChainTxsTableItem';

interface Props {
  items: Array<multichain.InteropMessage>;
  isLoading: boolean;
  socketType?: TxsSocketType;
  stickyHeader?: boolean;
  top?: number;
  currentAddress?: string;
}

const CrossChainTxsTable = ({ items, isLoading, socketType, stickyHeader = true, top, currentAddress }: Props) => {
  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;

  const currencySymbol = getCurrencySymbol();

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1150px" tableLayout="auto">
        <TableHeaderComponent top={ stickyHeader ? top : undefined }>
          <TableRow>
            <TableColumnHeader minW="180px">
              Message
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>Type</TableColumnHeader>
            <TableColumnHeader>Method</TableColumnHeader>
            <TableColumnHeader>Source tx</TableColumnHeader>
            <TableColumnHeader whiteSpace="nowrap">Destination tx</TableColumnHeader>
            <TableColumnHeader>Sender / Target</TableColumnHeader>
            <TableColumnHeader isNumeric>Value</TableColumnHeader>
          </TableRow>
        </TableHeaderComponent>
        <TableBody>
          { socketType && <TxsSocketNotice type={ socketType } place="table" isLoading={ isLoading }/> }
          { items.map((item, index) => (
            <CrossChainTxsTableItem
              key={ String(item.nonce) + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
              currencySymbol={ currencySymbol }
              currentAddress={ currentAddress }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(CrossChainTxsTable);
