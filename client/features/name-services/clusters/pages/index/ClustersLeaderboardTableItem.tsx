// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersLeaderboardObject } from 'client/features/name-services/clusters/types/api';

import ClustersEntity from 'client/features/name-services/clusters/components/ClustersEntity';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

interface Props {
  item: ClustersLeaderboardObject;
  isLoading?: boolean;
}

const ClustersLeaderboardTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          #{ item.rank }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.nameCount }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { (parseFloat(item.totalWeiAmount) / 1e18).toFixed(2) } ETH
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.chainIds.length } { item.chainIds.length === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClustersLeaderboardTableItem);
