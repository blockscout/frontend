import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TxsSocketType } from 'ui/txs/socket/types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';
import TxsSocketNotice from 'ui/txs/socket/TxsSocketNotice';

import CrossChainTxsTableItem from './CrossChainTxsTableItem';

interface Props {
  items: Array<multichain.InteropMessage>;
  isLoading: boolean;
  socketType?: TxsSocketType;
  stickyHeader?: boolean;
}

const CrossChainTxsTable = ({ items, isLoading, socketType, stickyHeader = true }: Props) => {
  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1150px">
        <TableHeaderComponent top={ stickyHeader ? 68 : undefined }>
          <TableRow>
            <TableColumnHeader width="52px"/>
            <TableColumnHeader w="180px">
              Message
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="130px">Type</TableColumnHeader>
            <TableColumnHeader w="130px">Method</TableColumnHeader>
            <TableColumnHeader w="25%">Source tx</TableColumnHeader>
            <TableColumnHeader w="25%">Destination tx</TableColumnHeader>
            <TableColumnHeader w="25%">Sender</TableColumnHeader>
            <TableColumnHeader w="32px"/>
            <TableColumnHeader w="25%">Target</TableColumnHeader>
            <TableColumnHeader w="130px">Value</TableColumnHeader>
          </TableRow>
        </TableHeaderComponent>
        <TableBody>
          { socketType && <TxsSocketNotice type={ socketType } place="table" isLoading={ isLoading }/> }
          { items.map((item, index) => (
            <CrossChainTxsTableItem
              key={ String(item.nonce) + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(CrossChainTxsTable);
