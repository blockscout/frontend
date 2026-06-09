// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersLeaderboardObject } from 'src/features/name-services/clusters/types/api';

import ClustersEntity from 'src/features/name-services/clusters/components/ClustersEntity';

import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  item: ClustersLeaderboardObject;
  isLoading?: boolean;
}

const ClustersLeaderboardListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Rank
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          #{ item.rank }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Cluster name
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 500 }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Names
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { item.nameCount }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Backing
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { (parseFloat(item.totalWeiAmount) / 1e18).toFixed(2) } ETH
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Network presence
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { item.chainIds.length } { item.chainIds.length === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ClustersLeaderboardListItem);
