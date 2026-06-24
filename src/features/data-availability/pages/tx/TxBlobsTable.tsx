// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TxBlobsTableItem from './TxBlobsTableItem';

interface Props {
  data: Array<schemas['BlobResponse']>;
  isLoading?: boolean;
}

const TxBlobsTable = ({ data, isLoading }: Props) => {

  return (
    <TableRoot>
      <TableHeaderSticky>
        <TableRow>
          <TableColumnHeader width="60%">Blob hash</TableColumnHeader>
          <TableColumnHeader width="20%">Data type</TableColumnHeader>
          <TableColumnHeader width="20%">Size, bytes</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <TxBlobsTableItem key={ item.hash + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TxBlobsTable;
