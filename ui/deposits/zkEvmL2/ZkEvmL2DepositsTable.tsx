import React from 'react';

import type { ZkEvmL2DepositsItem } from 'types/api/zkEvmL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZkEvmL2DepositsTableItem from './ZkEvmL2DepositsTableItem';

 type Props = {
   items: Array<ZkEvmL2DepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const ZkEvmL2DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>L1 block</TableColumnHeader>
          <TableColumnHeader>Index</TableColumnHeader>
          <TableColumnHeader>L1 txn hash</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>L2 txn hash</TableColumnHeader>
          <TableColumnHeader isNumeric>Value</TableColumnHeader>
          <TableColumnHeader>Token</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ZkEvmL2DepositsTableItem key={ String(item.index) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ZkEvmL2DepositsTable;
