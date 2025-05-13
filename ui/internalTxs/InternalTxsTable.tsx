import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import InternalTxsTableItem from './InternalTxsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  currentAddress?: string;
  isLoading?: boolean;
}

const InternalTxsTable = ({ data, currentAddress, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot minW="900px">
        <TableHeaderSticky top={ 68 }>
          <TableRow>
            <TableColumnHeader width="180px">Parent txn hash</TableColumnHeader>
            <TableColumnHeader width="15%">Type</TableColumnHeader>
            <TableColumnHeader width="15%">Block</TableColumnHeader>
            <TableColumnHeader width="50%">From/To</TableColumnHeader>
            <TableColumnHeader width="20%" isNumeric>
              Value { currencyUnits.ether }
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => (
            <InternalTxsTableItem
              key={ item.transaction_hash + '_' + index }
              { ...item }
              currentAddress={ currentAddress }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>

  );
};

export default InternalTxsTable;
