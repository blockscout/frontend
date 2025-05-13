import React from 'react';

import type { ShibariumWithdrawalsItem } from 'types/api/shibarium';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import WithdrawalsTableItem from './WithdrawalsTableItem';

 type Props = {
   items: Array<ShibariumWithdrawalsItem>;
   top: number;
   isLoading?: boolean;
 };

const WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>L2 block No</TableColumnHeader>
          <TableColumnHeader>L2 txn hash</TableColumnHeader>
          <TableColumnHeader>L1 txn hash</TableColumnHeader>
          <TableColumnHeader>User</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <WithdrawalsTableItem key={ `${ item.l2_transaction_hash }-${ index }` } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default WithdrawalsTable;
