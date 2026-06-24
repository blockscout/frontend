// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import { getTypeColor } from '../../utils/utils';

interface Props {
  data: schemas['FheOperation'];
  isLoading?: boolean;
}

const TxFHEOperationsTableItem = (props: Props) => {
  const { data, isLoading } = props;

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { data.log_index }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { data.operation }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette={ getTypeColor(data.type) } loading={ isLoading }>
          { capitalize(data.type) }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" loading={ isLoading }>
          { data.fhe_type }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" loading={ isLoading }>
          { data.is_scalar ? 'Scalar' : 'Non-scalar' }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { data.hcu_cost.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } color="text.secondary">
          { data.hcu_depth.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        { data.caller && data.caller.hash ? (
          <AddressEntity
            address={ data.caller }
            truncation="dynamic"
            isLoading={ isLoading }
          />
        ) : (
          <Text color="text.secondary">—</Text>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxFHEOperationsTableItem);
