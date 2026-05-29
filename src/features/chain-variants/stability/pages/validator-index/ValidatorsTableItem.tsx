// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ValidatorStability } from 'src/features/chain-variants/stability/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ValidatorStatus from 'src/features/chain-variants/stability/components/ValidatorStabilityStatus';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: ValidatorStability;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { data.blocks_validated_count.toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
