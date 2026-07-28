// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersDirectoryObject } from 'src/features/name-services/clusters/types/api';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'src/toolkit/chakra/table';

import ClustersDirectoryTableItem from './ClustersDirectoryTableItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  top?: number;
  isClusterDetailsLoading?: boolean;
  resetKey?: string;
}

const ClustersDirectoryTable = ({ data, isLoading, top, isClusterDetailsLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

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
          { data.slice(0, renderedItemsNum).map((item, index) => (
            <ClustersDirectoryTableItem
              key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
              item={ item }
              isLoading={ isLoading }
              isClusterDetailsLoading={ isClusterDetailsLoading }
            />
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(ClustersDirectoryTable);
