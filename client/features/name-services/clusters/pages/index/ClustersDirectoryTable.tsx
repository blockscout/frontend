// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersDirectoryObject } from 'client/features/name-services/clusters/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'client/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'toolkit/chakra/table';

import ClustersDirectoryTableItem from './ClustersDirectoryTableItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  top?: number;
  isClusterDetailsLoading?: boolean;
}

const ClustersDirectoryTable = ({ data, isLoading, top, isClusterDetailsLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="40%">Cluster name</TableColumnHeader>
            <TableColumnHeader width="40%">Address</TableColumnHeader>
            <TableColumnHeader width="180px">
              Joined
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="20%">Active chains</TableColumnHeader>
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
    </AddressHighlightProvider>
  );
};

export default React.memo(ClustersDirectoryTable);
