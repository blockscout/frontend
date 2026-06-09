// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClustersDirectoryObject } from 'src/features/name-services/clusters/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { isEvmAddress } from 'src/slices/address/utils/is-evm-address';

import ClustersEntity from 'src/features/name-services/clusters/components/ClustersEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  item: ClustersDirectoryObject;
  isLoading?: boolean;
  isClusterDetailsLoading?: boolean;
}

const ClustersDirectoryTableItem = ({ item, isLoading, isClusterDetailsLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.owner && (
          <AddressEntity
            address={{ hash: item.owner }}
            isLoading={ isLoading }
            fontWeight={ 500 }
            noLink={ !isEvmAddress(item.owner) }
            w="fit-content"
            maxW="100%"
          />
        ) }
        { !item.owner && <Skeleton loading={ isLoading }>—</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.createdAt }
          isLoading={ isLoading }
          enableIncrement={ true }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading || isClusterDetailsLoading }>
          { (item.chainIds?.length || 1) } { (item.chainIds?.length || 1) === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClustersDirectoryTableItem);
