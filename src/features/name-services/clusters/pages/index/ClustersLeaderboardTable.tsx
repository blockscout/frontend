// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersLeaderboardObject } from 'src/features/name-services/clusters/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableHeaderSticky, TableRow, TableColumnHeader, TableRoot } from 'src/toolkit/chakra/table';

import ClustersLeaderboardTableItem from './ClustersLeaderboardTableItem';

interface Props {
  data: Array<ClustersLeaderboardObject>;
  isLoading?: boolean;
  top?: number;
  resetKey?: string;
}

const ClustersLeaderboardTable = ({ data, isLoading, top, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="5%">Rank</TableColumnHeader>
          <TableColumnHeader width="40%">Cluster name</TableColumnHeader>
          <TableColumnHeader width="10%">Names</TableColumnHeader>
          <TableColumnHeader width="10%">Total backing</TableColumnHeader>
          <TableColumnHeader width="10%">Active chains</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ClustersLeaderboardTableItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ClustersLeaderboardTable);
