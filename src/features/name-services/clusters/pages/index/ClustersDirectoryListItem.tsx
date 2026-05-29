// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersDirectoryObject } from 'src/features/name-services/clusters/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { isEvmAddress } from 'src/slices/address/utils/is-evm-address';

import ClustersEntity from 'src/features/name-services/clusters/components/ClustersEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  item: ClustersDirectoryObject;
  isLoading?: boolean;
  isClusterDetailsLoading?: boolean;
}

const ClustersDirectoryListItem = ({ item, isLoading, isClusterDetailsLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Cluster name
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 500 }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Address
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.owner && (
          <AddressEntity
            address={{ hash: item.owner }}
            isLoading={ isLoading }
            fontWeight={ 500 }
            noLink={ !isEvmAddress(item.owner) }
          />
        ) }
        { !item.owner && <Skeleton loading={ isLoading }>—</Skeleton> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Joined
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          <Time timestamp={ item.createdAt } display="block"/>
          <div> { dayjs(item.createdAt).fromNow() }</div>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Active chains
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading || isClusterDetailsLoading }>
          { (item.chainIds?.length || 1) } { (item.chainIds?.length || 1) === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ClustersDirectoryListItem);
