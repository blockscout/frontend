import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TxsSocketType } from 'ui/txs/socket/types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';
import TxsSocketNotice from 'ui/txs/socket/TxsSocketNotice';

import CrossChainTxsTableItem from './CrossChainTxsTableItem';

interface Props {
  items: Array<multichain.InteropMessage>;
  isLoading: boolean;
  socketType?: TxsSocketType;
}

const CrossChainTxsTable = ({ items, isLoading, socketType }: Props) => {

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1150px">
        <TableHeaderSticky top={ 68 }>
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
        </TableHeaderSticky>
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
