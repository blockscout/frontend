import React from 'react';

import type { ShibariumDepositsItem } from 'types/api/shibarium';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import DepositsTableItem from './DepositsTableItem';

 type Props = {
   items: Array<ShibariumDepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot style={{ tableLayout: 'auto' }} minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>L1 block No</TableColumnHeader>
          <TableColumnHeader>L1 txn hash</TableColumnHeader>
          <TableColumnHeader>L2 txn hash</TableColumnHeader>
          <TableColumnHeader>User</TableColumnHeader>
          <TableColumnHeader>Age</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <DepositsTableItem key={ item.l2_transaction_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default DepositsTable;
