import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TacOperationsTableItem from './TacOperationsTableItem';

 type Props = {
   items: Array<tac.OperationBriefDetails>;
   top: number;
   isLoading?: boolean;
 };

const TacOperationsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Operation</TableColumnHeader>
          <TableColumnHeader>Age</TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>Sender</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TacOperationsTableItem key={ String(item.operation_id) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TacOperationsTable;
