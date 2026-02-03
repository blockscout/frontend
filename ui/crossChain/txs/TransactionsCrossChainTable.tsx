import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TransactionsCrossChainTableItem from './TransactionsCrossChainTableItem';

interface Props {
  data: Array<InterchainMessage>;
  isLoading?: boolean;
  top?: number;
  stickyHeader?: boolean;
  currentAddress?: string;
}

const TransactionsCrossChainTable = ({ data, isLoading, top, stickyHeader, currentAddress }: Props) => {
  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1300px">
        <TableHeaderComponent top={ stickyHeader ? top : undefined }>
          <TableRow>
            <TableColumnHeader w="42px"/>
            { currentAddress && <TableColumnHeader w="44px"/> }
            <TableColumnHeader w="130px">Message</TableColumnHeader>
            <TableColumnHeader w="180px">
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="140px">Msg sender</TableColumnHeader>
            <TableColumnHeader w="20%">Source tx</TableColumnHeader>
            <TableColumnHeader w="20%">Dest tx</TableColumnHeader>
            <TableColumnHeader w="60px">Transf</TableColumnHeader>
            <TableColumnHeader w="20%">Sender</TableColumnHeader>
            <TableColumnHeader w="32px"/>
            <TableColumnHeader w="20%">Recipient</TableColumnHeader>
            <TableColumnHeader w="20%">Protocol</TableColumnHeader>
          </TableRow>
        </TableHeaderComponent>
        <TableBody>
          { data.map((item, index) => (
            <TransactionsCrossChainTableItem
              key={ item.message_id + (isLoading ? String(index) : '') }
              data={ item }
              isLoading={ isLoading }
              currentAddress={ currentAddress }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TransactionsCrossChainTable);
