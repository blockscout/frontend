import { Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { FheOperation } from 'types/api/fheOperations';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { getTypeColor } from 'ui/tx/fheOperations/utils';

type Props = FheOperation & { isLoading?: boolean };

const TxFHEOperationsTableItem = (props: Props) => {
  const { log_index: logIndex, operation, type, fhe_type: fheType, is_scalar: isScalar, hcu_cost: hcuCost, hcu_depth: hcuDepth, caller, isLoading } = props;
  const hcuDepthValue = hcuDepth ?? hcuCost;

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } fontSize="sm">
          { logIndex }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight="medium">
          { operation }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette={ getTypeColor(type) } fontSize="sm" loading={ isLoading }>
          { capitalize(type) }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" fontSize="sm" loading={ isLoading }>
          { fheType }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Badge colorPalette="gray" fontSize="sm" loading={ isLoading }>
          { isScalar ? 'Scalar' : 'Non-scalar' }
        </Badge>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } fontSize="sm">
          { hcuCost.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          { hcuDepthValue.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        { caller && caller.hash ? (
          <AddressEntity
            address={ caller }
            truncation="dynamic"
            isLoading={ isLoading }
          />
        ) : (
          <Text fontSize="sm" color="text.secondary">—</Text>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxFHEOperationsTableItem);
