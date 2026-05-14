// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ValidatorStability } from 'types/api/validators';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ValidatorStatus from 'ui/shared/statusTag/ValidatorStabilityStatus';

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
