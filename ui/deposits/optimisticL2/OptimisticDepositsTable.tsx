import React from 'react';

import type { OptimisticL2DepositsItem } from 'types/api/optimisticL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticDepositsTableItem from './OptimisticDepositsTableItem';

 type Props = {
   items: Array<OptimisticL2DepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const OptimisticDepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>L1 block No</TableColumnHeader>
          <TableColumnHeader>L2 txn hash</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>L1 txn hash</TableColumnHeader>
          <TableColumnHeader>L1 txn origin</TableColumnHeader>
          <TableColumnHeader isNumeric>Gas limit</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticDepositsTableItem key={ item.l2_transaction_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticDepositsTable;
