import React from 'react';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZkEvmL2WithdrawalsTableItem from './ZkEvmL2WithdrawalsTableItem';

 type Props = {
   items: Array<ZkEvmL2WithdrawalsItem>;
   top: number;
   isLoading?: boolean;
 };

const ZkEvmL2DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Block</TableColumnHeader>
          <TableColumnHeader>Index</TableColumnHeader>
          <TableColumnHeader>L2 txn hash</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>L1 txn hash</TableColumnHeader>
          <TableColumnHeader isNumeric>Value</TableColumnHeader>
          <TableColumnHeader>Token</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ZkEvmL2WithdrawalsTableItem key={ String(item.index) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ZkEvmL2DepositsTable;
