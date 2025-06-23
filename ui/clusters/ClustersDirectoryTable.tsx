import React from 'react';

import type { ClustersDirectoryObject } from 'types/api/clusters';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'toolkit/chakra/table';

import ClustersDirectoryTableItem from './ClustersDirectoryTableItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  top?: number;
}

const ClustersDirectoryTable = ({ data, isLoading, top }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="20%">Cluster Name</TableColumnHeader>
          <TableColumnHeader width="30%">Address</TableColumnHeader>
          <TableColumnHeader width="10%">Joined</TableColumnHeader>
          <TableColumnHeader width="10%">Active Chains</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ClustersDirectoryTableItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ClustersDirectoryTable);
