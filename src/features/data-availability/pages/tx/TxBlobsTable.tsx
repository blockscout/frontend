// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TxBlobsTableItem from './TxBlobsTableItem';

interface Props {
  data: Array<schemas['BlobResponse']>;
  isLoading?: boolean;
}

const getBaseKey = (item: schemas['BlobResponse']): string => item.hash;

const TxBlobsTable = ({ data, isLoading }: Props) => {
  const keys = useUniqueKeys(data, getBaseKey);

  return (
    <TableRoot minW="600px">
      <TableHeaderSticky>
        <TableRow>
          <TableColumnHeader width="60%">Blob hash</TableColumnHeader>
          <TableColumnHeader width="20%">Data type</TableColumnHeader>
          <TableColumnHeader width="20%">Size, bytes</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <TxBlobsTableItem key={ keys[index] } data={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TxBlobsTable;
