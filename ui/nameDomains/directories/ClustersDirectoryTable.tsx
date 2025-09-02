import React from 'react';

import type { ClustersDirectoryObject } from 'types/api/clusters';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ClustersDirectoryTableItem from './ClustersDirectoryTableItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  top?: number;
  isClusterDetailsLoading?: boolean;
}

const ClustersDirectoryTable = ({ data, isLoading, top, isClusterDetailsLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="40%">Cluster Name</TableColumnHeader>
          <TableColumnHeader width="40%">Address</TableColumnHeader>
          <TableColumnHeader width="180px">
            Joined
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="20%">Active Chains</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ClustersDirectoryTableItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
            isClusterDetailsLoading={ isClusterDetailsLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ClustersDirectoryTable);
