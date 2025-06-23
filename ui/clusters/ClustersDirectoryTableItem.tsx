import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ClustersDirectoryObject } from 'types/api/clusters';

import { isEvmAddress } from 'lib/clusters/detectInputType';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  item: ClustersDirectoryObject;
  isLoading?: boolean;
}

const ClustersDirectoryTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.owner && isEvmAddress(item.owner) && (
          <AddressEntity address={{ hash: item.owner }} isLoading={ isLoading } fontWeight={ 500 }/>
        ) }
        { item.owner && !isEvmAddress(item.owner) && (
          <Box display="inline-flex" alignItems="center" minWidth={ 0 }>
            <AddressEntity address={{ hash: item.owner }} isLoading={ isLoading } fontWeight={ 500 } noLink={ true }/>
          </Box>
        ) }
        { !item.owner && <Skeleton loading={ isLoading }>—</Skeleton> }
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.createdAt }
          isLoading={ isLoading }
          timeFormat="relative"
          enableIncrement={ true }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.chainIds?.length || 0 } { (item.chainIds?.length || 0) === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClustersDirectoryTableItem);
